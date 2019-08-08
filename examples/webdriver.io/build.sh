#! /bin/bash
pushd "$(dirname $0)"

TARGET_STAGE="${1:-lambci-node10-wdio-test}"
IMAGE_TAG="al2-node10-chromedriver-wdio-example-${TARGET_STAGE}"

docker build --target $TARGET_STAGE -t $IMAGE_TAG ./
docker run -it ${IMAGE_TAG} sh

popd
echo $IMAGE_TAG
