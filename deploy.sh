#!/bin/sh
VERSION=0.0.1-alpha.0
docker build -f configs/docker/prod/Dockerfile . -t aroliant/felix:$VERSION 
docker tag aroliant/felix:$VERSION aroliant/felix:latest
docker push aroliant/felix:$VERSION
docker push aroliant/felix:latest
