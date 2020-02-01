#!/bin/bash

VERSION=`cat ./version`

API_URL=http://${EC2_INSTANCE_IP}/api
STATIC_RESOURCES_ROOT_URL=http://${EC2_INSTANCE_IP}/static

docker build -t elrohil/bow-legs-app:latest -t elrohil/bow-legs-app:${VERSION} \
    --build-arg "REACT_APP_API_URL=${API_URL}" \
    --build-arg "REACT_APP_STATIC_RESOURCES_ROOT_URL=${STATIC_RESOURCES_ROOT_URL}" \
    "./$1"