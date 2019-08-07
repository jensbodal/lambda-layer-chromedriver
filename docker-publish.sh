#! /bin/bash
IMAGE_TAG_BASE="jensbodal/lambda-amazonlinux2"
IMAGE_TAG_NODE10="${IMAGE_TAG_BASE}:node10"
IMAGE_TAG_NODE10_CHROMEDRIVER="${IMAGE_TAG_BASE}:node10-chromedriver"

docker login
docker image build --target "al2-node10" --tag ${IMAGE_TAG_NODE10} ./build/chromedriver-layer-builder
docker image build --target "lambda-layer-chromedriver-al2-node10-publish" --tag ${IMAGE_TAG_NODE10_CHROMEDRIVER} ./build/chromedriver-layer-builder
docker push ${IMAGE_TAG_NODE10}
docker push ${IMAGE_TAG_NODE10_CHROMEDRIVER}
