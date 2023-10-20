#!/bin/bash

echo "Please log in using your Docker Hub credentials to update the container image"
docker login
#Without Contrast (to show K8s operator)
docker tag nodegoat:1.3.0 contrastsecuritydemo/nodegoat:1.3.0
docker push contrastsecuritydemo/nodegoat:1.3.0
#With v4
docker tag nodegoat-assess:1.3.0 contrastsecuritydemo/nodegoat-assess:1.3.0
docker push contrastsecuritydemo/nodegoat-assess:1.3.0
#With v5
docker tag nodegoat-protect:1.3.0 contrastsecuritydemo/nodegoat-protect:1.3.0
docker push contrastsecuritydemo/nodegoat-protect:1.3.0