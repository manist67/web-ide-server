#!/bin/bash

docker build -t java-compile-run:1.0 ./java/build_run
# sudo docker build -t java-build:1.0 ./java/build
# sudo docker build -t java-run:1.0 ./java/run


docker build -t c-compile-run:1.0 ./c/build_run
# sudo docker build -t c-build:1.0 ./c/build
# sudo docker build -t c-run:1.0 ./c/run
