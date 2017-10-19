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
ENV MOIRA_API_URI localhost:8081
RUN sed -i /etc/nginx/conf.d/default.conf -e "s|MOIRA_API_URI|$MOIRA_API_URI|"

EXPOSE 80
