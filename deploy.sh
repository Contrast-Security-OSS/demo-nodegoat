#!/bin/bash
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 109573999282.dkr.ecr.eu-north-1.amazonaws.com

docker pull 109573999282.dkr.ecr.eu-north-1.amazonaws.com/docker-project:$1

docker rm -f demo-nodegoat

docker run -itd -p 4000:4000 --name demo-nodegoat 109573999282.dkr.ecr.eu-north-1.amazonaws.com/docker-project:$1