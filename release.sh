#!/bin/bash

set -e

VERSION=`cat ./version`
MODULE=$1

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push elrohil/bow-legs-${MODULE}:latest
docker push elrohil/bow-legs-${MODULE}:${VERSION}