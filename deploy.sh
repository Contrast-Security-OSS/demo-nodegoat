#!/bin/bash

echo "Please log in using your Docker Hub credentials to update the container image"
docker login
docker tag nodegoat:1.3.0 contrastsecuritydemo/nodegoat:1.3.0
docker push contrastsecuritydemo/nodegoat:1.3.0