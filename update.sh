#!/usr/bin/env bash

set -e

git pull
docker-compose pull
docker-compose down -v
docker-compose up -d