#!/bin/sh

if [ -z "${BACKEND_URL}" ]; then
  echo "BACKEND_URL is not set. Defaulting to http://backend:5000"
  export BACKEND_URL="http://backend:5000"
fi

envsubst '$BACKEND_URL' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"