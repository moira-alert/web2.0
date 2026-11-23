FROM node:24.19.0 AS build-env

ADD . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx/nginx-unprivileged:alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY --from=build-env /app/dist/ /usr/share/nginx/html/
COPY src/favicon.ico         \
     src/favicon-dev.ico     \
     src/favicon-staging.ico \
     /usr/share/nginx/html/

COPY --chown=nginx:nginx pkg/nginx/locations/ /etc/nginx/conf.d/locations/
COPY --chown=nginx:nginx pkg/nginx/moira.conf /etc/nginx/conf.d/moira.conf
COPY --chmod=755 pkg/entrypoint.sh /entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
