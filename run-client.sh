#!/bin/bash
set -euo pipefail

cd $APP_HOME/client
yarn install
exec /sbin/setuser app yarn start 0.0.0.0:3000
