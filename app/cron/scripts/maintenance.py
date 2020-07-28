import argparse
import datetime
import logging
import subprocess
import os
import shutil
import tempfile
from tempfile import mkstemp

import configparser
import gzip
import boto3
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Amazon S3 settings.
# AWS_ACCESS_KEY_ID  in ~/.aws/credentials
# AWS_SECRET_ACCESS_KEY in ~/.aws/credentials


def upload_to_s3(file_full_path, dest_file, manager_config, bucket_path):
    """
    Upload a file to an AWS S3 bucket.
    """
    s3_client = boto3.client('s3', 
                      aws_access_key_id=manager_config.get('AWS_ACCESS_KEY_ID'),
                      aws_secret_access_key=manager_config.get('AWS_SECRET_ACCESS_KEY'),
                      region_name=manager_config.get('AWS_REGION_NAME')
                      )
    try:
        s3_client.upload_file(file_full_path,
                              manager_config.get('AWS_BUCKET_NAME'),
                              bucket_path + dest_file)
        os.remove(file_full_path)
    except boto3.exceptions.S3UploadFailedError as exc:
        print(exc)
        exit(1)


def download_from_s3(backup_s3_key, dest_file, manager_config):
    """
    Upload a file to an AWS S3 bucket.
    """
    s3_client = boto3.resource('s3')
    try:
        s3_client.meta.client.download_file(manager_config.get('AWS_BUCKET_NAME'), backup_s3_key, dest_file)
    except Exception as e:
        print(e)
        exit(1)


def list_available_backups(storage_engine, manager_config, bucket_path):
    key_list = []
    if storage_engine == 'LOCAL':
        try:
            backup_folder = manager_config.get('LOCAL_BACKUP_PATH')
            backup_list = os.listdir(backup_folder)
        except FileNotFoundError:
            print(f'Could not found {backup_folder} when searching for backups.'
                  f'Check your .config file settings')
            exit(1)
    elif storage_engine == 'S3':
        # logger.info('Listing S3 bucket s3://{}/{} content :'.format(aws_bucket_name, aws_bucket_postgres_path))
        s3_client = boto3.client('s3', 
                      aws_access_key_id=manager_config.get('AWS_ACCESS_KEY_ID'),
                      aws_secret_access_key=manager_config.get('AWS_SECRET_ACCESS_KEY'),
                      region_name=manager_config.get('AWS_REGION_NAME')
                      )
        s3_objects = s3_client.list_objects_v2(Bucket=manager_config.get('AWS_BUCKET_NAME'),
                                               Prefix=bucket_path)
        backup_list = [s3_content['Key'] for s3_content in s3_objects['Contents']]

    for bckp in backup_list:
        key_list.append(bckp)
    return key_list


def list_postgres_databases(host, database_name, port, user, password):
    try:
        process = subprocess.Popen(
            ['psql',
             '--dbname=postgresql://{}:{}@{}:{}/{}'.format(user, password, host, port, database_name),
             '--list'],
            stdout=subprocess.PIPE
        )
        output = process.communicate()[0]
        if int(process.returncode) != 0:
            print('Command failed. Return code : {}'.format(process.returncode))
            exit(1)
        return output
    except Exception as e:
        print(e)
        exit(1)


def backup_postgres_db(host, database_name, port, user, password, dest_file, verbose):
    """
    Backup postgres db to a file.
    """
    if verbose:
        try:
            process = subprocess.Popen(
                ['pg_dump',
                 '--dbname=postgresql://{}:{}@{}:{}/{}'.format(user, password, host, port, database_name),
                 '-Fc',
                 '-f', dest_file,
                 '-v'],
                stdout=subprocess.PIPE
            )
            output = process.communicate()[0]
            if int(process.returncode) != 0:
                print('Command failed. Return code : {}'.format(process.returncode))
                exit(1)
            return output
        except Exception as e:
            print(e)
            exit(1)
    else:

        try:
            process = subprocess.Popen(
                ['pg_dump',
                 '--dbname=postgresql://{}:{}@{}:{}/{}'.format(user, password, host, port, database_name),
                 '-f', dest_file],
                stdout=subprocess.PIPE
            )
            output = process.communicate()[0]
            if process.returncode != 0:
                print('Command failed. Return code : {}'.format(process.returncode))
                exit(1)
            return output
        except Exception as e:
            print(e)
            exit(1)


def compress_file(src_file):
    compressed_file = "{}.gz".format(str(src_file))
    with open(src_file, 'rb') as f_in:
        with gzip.open(compressed_file, 'wb') as f_out:
            for line in f_in:
                f_out.write(line)
    return compressed_file


def extract_file(src_file):
    extracted_file, extension = os.path.splitext(src_file)

    with gzip.open(src_file, 'rb') as f_in:
        with open(extracted_file, 'wb') as f_out:
            for line in f_in:
                f_out.write(line)
    return extracted_file

def make_archive(source, destination):
        base = os.path.basename(destination)
        name = base.split('.')[0]
        format = base.split('.')[1]
        archive_from = os.path.dirname(source)
        archive_to = os.path.basename(source.strip(os.sep))
        print(source, destination, archive_from, archive_to)
        shutil.make_archive(name, format, archive_from, archive_to)
        shutil.move('%s.%s'%(name,format), destination)

def remove_faulty_statement_from_dump(src_file):
    temp_file, _ = tempfile.mkstemp()

    try:
        with open(temp_file, 'w+'):
            process = subprocess.Popen(
                ['pg_restore',
                 '-l'
                 '-v',
                 src_file],
                stdout=subprocess.PIPE
            )
            output = subprocess.check_output(('grep', '-v', '"EXTENSION - plpgsql"'), stdin=process.stdout)
            process.wait()
            if int(process.returncode) != 0:
                print('Command failed. Return code : {}'.format(process.returncode))
                exit(1)

            os.remove(src_file)
            with open(src_file, 'w+') as cleaned_dump:
                subprocess.call(
                    ['pg_restore',
                     '-L'],
                    stdin=output,
                    stdout=cleaned_dump
                )

    except Exception as e:
        print("Issue when modifying dump : {}".format(e))


def change_user_from_dump(source_dump_path, old_user, new_user):
    fh, abs_path = mkstemp()
    with os.fdopen(fh, 'w') as new_file:
        with open(source_dump_path) as old_file:
            for line in old_file:
                new_file.write(line.replace(old_user, new_user))
    # Remove original file
    os.remove(source_dump_path)
    # Move new file
    shutil.move(abs_path, source_dump_path)


def restore_postgres_db(db_host, db, port, user, password, backup_file, verbose):
    """Restore postgres db from a file."""
    try:
        subprocess_params = [
            'pg_restore',
            '--no-owner',
            '--dbname=postgresql://{}:{}@{}:{}/{}'.format(user,
                                                          password,
                                                          db_host,
                                                          port,
                                                          db)
        ]

        if verbose:
            subprocess_params.append('-v')

        subprocess_params.append(backup_file)
        process = subprocess.Popen(subprocess_params, stdout=subprocess.PIPE)
        output = process.communicate()[0]

        if int(process.returncode) != 0:
            print('Command failed. Return code : {}'.format(process.returncode))

        return output
    except Exception as e:
        print("Issue with the db restore : {}".format(e))


def create_db(db_host, database, db_port, user_name, user_password):
    try:
        con = psycopg2.connect(dbname='postgres', port=db_port,
                               user=user_name, host=db_host,
                               password=user_password)

    except Exception as e:
        print(e)
        exit(1)

    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        cur.execute("SELECT pg_terminate_backend( pid ) "
                    "FROM pg_stat_activity "
                    "WHERE pid <> pg_backend_pid( ) "
                    "AND datname = '{}'".format(database))
        cur.execute("DROP DATABASE IF EXISTS {} ;".format(database))
    except Exception as e:
        print(e)
        exit(1)
    cur.execute("CREATE DATABASE {} ;".format(database))
    cur.execute("GRANT ALL PRIVILEGES ON DATABASE {} TO {} ;".format(database, user_name))
    return database


def swap_after_restore(db_host, restore_database, new_active_database, db_port, user_name, user_password):
    try:
        con = psycopg2.connect(dbname='postgres', port=db_port,
                               user=user_name, host=db_host,
                               password=user_password)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        cur.execute("SELECT pg_terminate_backend( pid ) "
                    "FROM pg_stat_activity "
                    "WHERE pid <> pg_backend_pid( ) "
                    "AND datname = '{}'".format(new_active_database))
        cur.execute("DROP DATABASE IF EXISTS {}".format(new_active_database))
        cur.execute('ALTER DATABASE "{}" RENAME TO "{}";'.format(restore_database, new_active_database))
    except Exception as e:
        print(e)
        exit(1)


def move_to_local_storage(comp_file, filename_compressed, manager_config):
    """ Move compressed backup into {LOCAL_BACKUP_PATH}. """
    backup_folder = manager_config.get('LOCAL_BACKUP_PATH')
    try:
        check_folder = os.listdir(backup_folder)
    except FileNotFoundError:
        os.mkdir(backup_folder)
    shutil.move(comp_file, '{}{}'.format(manager_config.get('LOCAL_BACKUP_PATH'), filename_compressed))


def main():
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    args_parser = argparse.ArgumentParser(description='Postgres database management')
    args_parser.add_argument("--action",
                             metavar="action",
                             choices=['list-postgres-backups', 'list-geoserver-backups', 'list-wp-backups', 'list_postgres_dbs', 'list_wp_dbs', 'backup-postgres', 'backup-geoserver', 'restore-postgres'],
                             required=True)
    args_parser.add_argument("--date",
                             metavar="YYYY-MM-dd",
                             help="Date to use for restore (show with --action list)")
    args_parser.add_argument("--dest-db",
                             metavar="dest_db",
                             default=None,
                             help="Name of the new restored database")
    args_parser.add_argument("--verbose",
                             default=False,
                             help="Verbose output")
    args = args_parser.parse_args()

    postgres_host = os.environ['POSTGRES_HOST']
    postgres_port = os.environ['POSTGRES_PORT']
    postgres_db = os.environ['POSTGRES_DBNAME']
    postgres_restore = "{}_restore".format(postgres_db)
    postgres_user = os.environ['POSTGRES_USER']
    postgres_password = os.environ['POSTGRES_PASS']
    aws_bucket_name = os.environ['BUCKET_NAME']
    aws_bucket_postgres_path = os.environ['BUCKET_POSTGRES_BACKUP_PATH']
    aws_bucket_wp_path = os.environ['BUCKET_WP_BACKUP_PATH']
    aws_bucket_geoserver_path = os.environ['BUCKET_GEOSERVER_BACKUP_PATH']
    storage_engine = os.environ['STORAGE_ENGINE']
    timestr = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
 
    restore_filename = '/tmp/restore.dump.gz'
    restore_uncompressed = '/tmp/restore.dump'
    local_storage_path = os.environ['LOCAL_STORAGE']
    aws_access_key_id = os.environ['AWS_ACCESS_KEY_ID']
    aws_secret_access_key = os.environ['AWS_SECRET_ACCESS_KEY']
    aws_region_name = os.environ['AWS_REGION_NAME']

    manager_config = {
        'AWS_BUCKET_NAME': aws_bucket_name,
        'AWS_BUCKET_POSTGRES_PATH': aws_bucket_postgres_path,
        'AWS_BUCKET_WP_PATH': aws_bucket_wp_path,
        'AWS_BUCKET_GEOSERVER_PATH': aws_bucket_geoserver_path,
        'BACKUP_PATH': '/tmp/',
        'LOCAL_BACKUP_PATH': local_storage_path,
        'AWS_ACCESS_KEY_ID': aws_access_key_id,
        'AWS_SECRET_ACCESS_KEY': aws_secret_access_key,
        'AWS_REGION_NAME': aws_region_name
    }


    # list postgres backups task
    if args.action == "list-postgres-backups":
        backup_objects = sorted(list_available_backups(storage_engine, manager_config, manager_config.get('AWS_BUCKET_POSTGRES_PATH')), reverse=True)
        for key in backup_objects:
            logger.info("Key : {}".format(key))
    elif args.action == "list-wp-backups":
        backup_objects = sorted(list_available_backups(storage_engine, manager_config, manager_config.get('AWS_BUCKET_WP_PATH')), reverse=True)
        for key in backup_objects:
            logger.info("Key : {}".format(key))
    elif args.action == "list-geoserver-backups":
        backup_objects = sorted(list_available_backups(storage_engine, manager_config, manager_config.get('AWS_BUCKET_GEOSERVER_PATH')), reverse=True)
        for key in backup_objects:
            logger.info("Key : {}".format(key))
    # list databases task
    elif args.action == "list_postgres_dbs":
        result = list_postgres_databases(postgres_host,
                                         postgres_db,
                                         postgres_port,
                                         postgres_user,
                                         postgres_password)
        for line in result.splitlines():
            logger.info(line)
    # backup postgres task
    elif args.action == "backup-postgres":
        filename = 'postgres-backup-{}-{}.dump'.format(timestr, postgres_db)
        filename_compressed = '{}.gz'.format(filename)
        local_file_path = '{}{}'.format(manager_config.get('BACKUP_PATH'), filename)
        logger.info('Backing up {} database to {}'.format(postgres_db, local_file_path))
        result = backup_postgres_db(postgres_host,
                                    postgres_db,
                                    postgres_port,
                                    postgres_user,
                                    postgres_password,
                                    local_file_path, args.verbose)
        if args.verbose:
            for line in result.splitlines():
                logger.info(line)
        logger.info("Backup complete")
        logger.info("Compressing {}".format(local_file_path))
        comp_file = compress_file(local_file_path)
        if storage_engine == 'LOCAL':
            logger.info('Moving {} to local storage...'.format(comp_file))
            move_to_local_storage(comp_file, filename_compressed, manager_config)
            logger.info("Moved to {}{}".format(manager_config.get('LOCAL_BACKUP_PATH'), filename_compressed))
        elif storage_engine == 'S3':
            logger.info('Uploading {} to Amazon S3...'.format(comp_file))
            upload_to_s3(comp_file, filename_compressed, manager_config, manager_config.get('AWS_BUCKET_POSTGRES_PATH'))
            logger.info("Uploaded to {}".format(filename_compressed))
    # backup geoserver task
    elif args.action == "backup-geoserver":
        filename = 'geoserver-backup-{}'.format(timestr)
        filename_compressed = '{}.zip'.format(filename)
        local_file_path = '{}{}'.format(manager_config.get('BACKUP_PATH'), filename_compressed)
        logger.info('Backing up geoserver to {}'.format(local_file_path))
        make_archive('/mnt/geoserver_data',local_file_path)
        logger.info("Backup complete")
        if storage_engine == 'LOCAL':
            logger.info('Moving {} to local storage...'.format(local_file_path))
            move_to_local_storage(local_file_path, filename_compressed, manager_config)
            logger.info("Moved to {}{}".format(manager_config.get('LOCAL_BACKUP_PATH'), filename_compressed))
        elif storage_engine == 'S3':
            logger.info('Uploading {} to Amazon S3...'.format(local_file_path))
            upload_to_s3(local_file_path, filename_compressed, manager_config, manager_config.get('AWS_BUCKET_GEOSERVER_PATH'))
            logger.info("Uploaded to {}".format(filename_compressed))
    # restore postgres task
    elif args.action == "restore-postgres":
        if not args.date:
            logger.warn('No date was chosen for restore. Run again with the "list" '
                        'action to see available restore dates')
        else:
            try:
                os.remove(restore_filename)
            except Exception as e:
                logger.info(e)
            all_backup_keys = list_available_backups(storage_engine, manager_config, manager_config.get('AWS_BUCKET_POSTGRES_PATH'))
            backup_match = [s for s in all_backup_keys if args.date in s]
            if backup_match:
                logger.info("Found the following backup : {}".format(backup_match))
            else:
                logger.error("No match found for backups with date : {}".format(args.date))
                logger.info("Available keys : {}".format([s for s in all_backup_keys]))
                exit(1)

            if storage_engine == 'LOCAL':
                logger.info("Choosing {} from local storage".format(backup_match[0]))
                shutil.copy('{}/{}'.format(manager_config.get('LOCAL_BACKUP_PATH'), backup_match[0]),
                            restore_filename)
                logger.info("Fetch complete")
            elif storage_engine == 'S3':
                logger.info("Downloading {} from S3 into : {}".format(backup_match[0], restore_filename))
                download_from_s3(backup_match[0], restore_filename, manager_config)
                logger.info("Download complete")

            logger.info("Extracting {}".format(restore_filename))
            ext_file = extract_file(restore_filename)
            # cleaned_ext_file = remove_faulty_statement_from_dump(ext_file)
            logger.info("Extracted to : {}".format(ext_file))
            logger.info("Creating temp database for restore : {}".format(postgres_restore))
            tmp_database = create_db(postgres_host,
                                     postgres_restore,
                                     postgres_port,
                                     postgres_user,
                                     postgres_password)
            logger.info("Created temp database for restore : {}".format(tmp_database))
            logger.info("Restore starting")
            result = restore_postgres_db(postgres_host,
                                         postgres_restore,
                                         postgres_port,
                                         postgres_user,
                                         postgres_password,
                                         restore_uncompressed,
                                         args.verbose)
            if args.verbose:
                for line in result.splitlines():
                    logger.info(line)
            logger.info("Restore complete")
            if args.dest_db is not None:
                restored_db_name = args.dest_db
                logger.info("Switching restored database with new one : {} > {}".format(
                    postgres_restore, restored_db_name
                ))
            else:
                restored_db_name = postgres_db
                logger.info("Switching restored database with active one : {} > {}".format(
                    postgres_restore, restored_db_name
                ))

            swap_after_restore(postgres_host,
                               postgres_restore,
                               restored_db_name,
                               postgres_port,
                               postgres_user,
                               postgres_password)
            logger.info("Database restored and active.")
    else:
        logger.warn("No valid argument was given.")
        logger.warn(args)


if __name__ == '__main__':
    main()