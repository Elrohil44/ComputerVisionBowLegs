#!/bin/bash

VERSION=`cat ./version`

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push elrohil/computer-vision-bow-legs:latest
docker push elrohil/computer-vision-bow-legs:${VERSION}