FROM node:16 AS build-env

ADD . /app
WORKDIR /app
RUN yarn install && yarn run build

FROM nginx:alpine

COPY --from=build-env /app/dist /usr/share/nginx/html
COPY src/favicon.ico /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY pkg/nginx/locations /etc/nginx/conf.d/locations
COPY pkg/nginx/moira.conf /etc/nginx/conf.d/moira.conf

COPY pkg/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]