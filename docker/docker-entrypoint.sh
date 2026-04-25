#!/bin/sh

set -e

bash ./scripts/runtime-env.sh './.env.example' './dist/env-config.js'
cp -u ./dist/env-config.js /usr/share/nginx/html/env-config.js
nginx -g "daemon off;"
