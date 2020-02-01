#!/bin/bash

VERSION=`cat ./version`

docker build -t elrohil/bow-legs-${1}:latest -t elrohil/bow-legs-${1}:${VERSION} "./$1"