#!/bin/bash

#Without Contrast (to show K8s operator)
docker build . -t nodegoat:1.3.0
#With v4
docker build . --build-arg CONTRAST_INSTALL=ASSESS -t nodegoat-assess:1.3.0
#With v5
docker build . --build-arg CONTRAST_INSTALL=PROTECT -t nodegoat-protect:1.3.0