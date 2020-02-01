#!/usr/bin/env bash

docker-compose pull
docker-compose down -v
docker-compose up -d --scale consumer=3