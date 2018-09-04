#!/usr/bin/env bash
set -eo pipefail

while getopts "m:c:wh" opt; do
  case $opt in
    m)
      bash -c "$MANAGE_PY $OPTARG"
      ;;
    c)
      bash -c "$OPTARG"
      ;;
    w)
      uwsgi --socket :8888 \
              --module core.wsgi:application \
              --chdir project/ \
              --env DJANGO_SETTINGS_MODULE=core.settings \
              --env PYTHONPATH=$PYTHONPATH
      ;;
    h)
      echo -e "USAGE: \n
               docker run [CONTAINER ID] -e [EXECUTION ENVIRONMENT], pg: -e testing \n
               docker run [CONTAINER ID] -w \n
               docker run [CONTAINER ID] -m [MANAGE.PY COMMAND], pg: -m makemigrations"
      ;;
    \?)
      echo Invalid option: $OPTARG >&2
      ;;
  esac
done
