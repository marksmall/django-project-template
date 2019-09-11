#!/usr/bin/env bash
set -eo pipefail

while getopts "m:c:wh" opt; do
  case $opt in
    m)
      # run django management command
      bash -c "$MANAGE_PY $OPTARG"
      ;;
    c)
      # run shell (bash) command
      bash -c "$OPTARG"
      ;;
    w)
      # run wsgi
      uwsgi --socket :8888 \
              --module wsgi:application \
              --chdir server/ \
              --env DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE \
              --env PYTHONPATH=$PYTHONPATH
      ;;
    h)
      # get help
      echo -e "USAGE: \n
               docker run [CONTAINER ID] -e [EXECUTION ENVIRONMENT], eg: -e testing \n
               docker run [CONTAINER ID] -w \n
               docker run [CONTAINER ID] -m [MANAGE.PY COMMAND], eg: -m makemigrations"
      ;;
    \?)
      echo Invalid option: $OPTARG >&2
      ;;
  esac
done
