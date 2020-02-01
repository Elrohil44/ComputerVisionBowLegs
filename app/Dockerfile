FROM node:12-alpine

ARG REACT_APP_API_URL
ARG REACT_APP_STATIC_RESOURCES_ROOT_URL

WORKDIR /app
COPY ./package.json ./yarn.lock ./

RUN yarn install --pure-lockfile
COPY ./ ./

RUN yarn build

VOLUME /app

CMD echo "Build finished"