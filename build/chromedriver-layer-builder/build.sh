#! /bin/bash
pushd "$(dirname $0)"

TARGET_STAGE="${1:-lambda-layer-chromedriver-al2-node10-builder}"
ENTRY_CMD="$2"
IMAGE_TAG="lambda-layer-chromedriver-$TARGET_STAGE"

docker build --target $TARGET_STAGE -t $IMAGE_TAG ./

if [ ! -z "${ENTRY_CMD}" ]; then
  docker run -it $IMAGE_TAG ${ENTRY_CMD}
fi

popd
echo $IMAGE_TAG
