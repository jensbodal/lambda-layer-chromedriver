#! /bin/bash
LAYER_NAME=$(cat ./dockerfile | grep "^ARG LAYER_NAME=" | sed -r 's#.*=(.*)#\1#')
IMAGE_TAG="lambda-layer-chromedriver-${LAYER_NAME}"

mkdir -p ./layers
docker image build --target "${LAYER_NAME}-builder" --tag $IMAGE_TAG ./
container=$(docker create $IMAGE_TAG)
docker cp ${container}:/home/${LAYER_NAME}.zip ./layers/
