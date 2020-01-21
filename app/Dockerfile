FROM node:12-alpine

WORKDIR /app
COPY ./package.json ./yarn.lock ./

RUN yarn install --pure-lockfile
COPY ./ ./

CMD yarn build
