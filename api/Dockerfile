FROM node:12-alpine

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      python

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash

WORKDIR /app
COPY ./package.json ./yarn.lock ./

RUN yarn install --pure-lockfile
COPY ./ ./

CMD yarn start
EXPOSE 5000