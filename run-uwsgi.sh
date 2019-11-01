#!/bin/bash
set -euo pipefail

cd $APP_HOME/server

setuser app pipenv run ./manage.py migrate
setuser app pipenv run ./manage.py collectstatic --no-input --link

exec /sbin/setuser app \
     pipenv run uwsgi \
     --uwsgi-socket /tmp/uwsgi.sock \
     --chmod-socket=666 \
     --module wsgi:application \
     --need-app \
     --processes 4 \
     --master
