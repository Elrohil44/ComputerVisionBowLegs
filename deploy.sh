#!/bin/bash

version=`cat ./version`

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push elrohil/computer-vision-bow-legs:latest
docker push elrohil/computer-vision-bow-legs:${version}