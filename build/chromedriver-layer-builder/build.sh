#! /bin/bash
pushd "$(dirname $0)"

TARGET_STAGE="${1:-lambda-layer-chromedriver-al2-node10-builder}"
IMAGE_TAG="lambda-layer-chromedriver-$TARGET_STAGE"

docker build --target $TARGET_STAGE -t $IMAGE_TAG ./

popd
echo $IMAGE_TAG
