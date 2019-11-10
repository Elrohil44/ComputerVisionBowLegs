#!/bin/bash

version=`cat ./version`

docker build -t elrohil/computer-vision-bow-legs:latest -t elrohil/computer-vision-bow-legs:${version} .