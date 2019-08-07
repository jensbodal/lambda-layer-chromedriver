#! /bin/bash
LAYER_NAME=$(cat ./build/chromedriver-layer-builder/dockerfile | grep "^ARG LAYER_NAME=" | sed -r 's#.*=(.*)#\1#')
IMAGE_TAG="lambda-layer-chromedriver-${LAYER_NAME}"

mkdir -p ./layers
docker image build --target "${LAYER_NAME}-builder" --tag $IMAGE_TAG ./build/chromedriver-layer-builder
container=$(docker create $IMAGE_TAG)
docker cp ${container}:/home/${LAYER_NAME}.zip ./layers/
