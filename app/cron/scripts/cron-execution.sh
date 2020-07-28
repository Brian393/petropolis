#!/bin/bash

scriptPath=$(dirname "$(readlink -f "$0")")
source "${scriptPath}/.env.sh"

# the docker-compose variables should be available here"
python3 /app/maintenance.py --action backup-postgres --verbose true
python3 /app/maintenance.py --action backup-geoserver --verbose true
