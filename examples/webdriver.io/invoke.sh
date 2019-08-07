#!/bin/bash

LAYER_FILE="./layers/lambda-layer-wdio.zip"

if [ ! -f "${LAYER_FILE}" ]; then
  echo "You need to run create-wdio-test-layer.sh first to create the ${LAYER_FILE} layer"
  exit 1
fi

unzip -o "${LAYER_FILE}" -d opt
cp ./wdio-files/* ./handler/
docker run --ipc=none --shm-size=1b --rm -v "$PWD/handler":/var/task -v "$PWD/opt":/opt lambci/lambda:nodejs10.x index.handler '{"hello": "world"}'
