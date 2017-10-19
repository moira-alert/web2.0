FROM node:latest AS build-env

ADD . /app

WORKDIR /app

RUN yarn install && yarn run build

# build runtime image
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
COPY --from=build-env /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY favicon.ico /usr/share/nginx/html


EXPOSE 80
