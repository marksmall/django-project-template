#!/bin/bash
set -euo pipefail

until echo > /dev/tcp/db/5432; do sleep 1; done

cd $APP_HOME/server

setuser app pipenv run ./manage.py migrate

if [ -d $APP_HOME/client/build ]; then
  setuser app pipenv run ./manage.py collectstatic --no-input --link
fi

exec /sbin/setuser app pipenv run ./manage.py runserver 0.0.0.0:8000
