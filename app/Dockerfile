FROM node:12-alpine

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

WORKDIR /app
COPY ./package.json ./yarn.lock ./

RUN yarn install --pure-lockfile
COPY ./ ./

CMD yarn build
