FROM python:3.6

RUN apt-get -y update && apt-get -y upgrade

RUN apt update && apt install -y \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main"  > /etc/apt/sources.list.d/postgresql.list \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc -O- | apt-key add -


# PYTHON AND DB DEPENDECIES
RUN apt update \
    && apt-get install -y cron postgresql-client-12 \
    && pip3 install pyyaml requests psycopg2-binary boto3

WORKDIR /app
COPY crontab /etc/cron.d/crontab
COPY ./scripts/maintenance.py /app/maintenance.py
COPY ./scripts/start.sh /app/start.sh
COPY ./scripts/cron-execution.sh /app/cron-execution.sh


RUN chmod 0644 /etc/cron.d/crontab
RUN /usr/bin/crontab /etc/cron.d/crontab

# run crond as main process of container
CMD /app/start.sh

