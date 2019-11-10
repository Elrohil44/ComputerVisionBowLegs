#!/bin/bash

VERSION=`cat ./version`

docker build -t elrohil/computer-vision-bow-legs:latest -t elrohil/computer-vision-bow-legs:${VERSION} .