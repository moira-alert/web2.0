#!/bin/sh

if [[ ! -z $MOIRA_API_URI ]]; then
    sed -i /etc/nginx/conf.d/locations/api.conf -e "s|MOIRA_API_URI|$MOIRA_API_URI|"
    sed -i /etc/nginx/conf.d/moira.conf -e "s|# include API_LOCATION|include conf.d/locations/api.conf|"
fi

exec nginx -g "daemon off;"