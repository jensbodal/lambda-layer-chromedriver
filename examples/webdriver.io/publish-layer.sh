#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
SCRIPT_NAME=$(basename "$0")
DOCKERFILE="./dockerfile"
LAYER_NAME=$(cat ${DOCKERFILE} | grep "^ARG LAYER_NAME=" | sed -r 's#.*=(.*)#\1#')
ZIP_FILE_NAME="${LAYER_NAME}.zip"
ZIP_FILE_LOC="./layers/${ZIP_FILE_NAME}"

main() {
  local s3_bucket="$1"

  if [ ! -f "${ZIP_FILE_LOC}" ]; then
    echo "Missing ${ZIP_FILE_LOC} lambda layer. Run create-lambda-layer.sh first"
    return 1
  fi

  if [ -z $s3_bucket ]; then
    log "${SCRIPT_NAME}: missing s3_bucket name"
    return 1
  fi

  publish_layer "${s3_bucket}"
}

log() {
  output="$@"
  echo "${output}" >&2
}

publish_layer() {
  local s3_bucket="$1"
  local s3url="s3://${s3_bucket}/"

  log "copying ${ZIP_FILE_LOC} to ${s3url} ..."
  aws s3 cp "${ZIP_FILE_LOC}" "${s3url}" >&2 && \

  log "publishing ${LAYER_NAME} ..." && \
  local output=$(aws lambda publish-layer-version \
    --layer-name ${LAYER_NAME} \
    --content S3Bucket=${s3_bucket},S3Key=${ZIP_FILE_NAME} \
    --compatible-runtimes nodejs10.x)

  log "${output}"

  local version=$(echo "$output" | jq '.Version')

  echo "$version"
}

main "$@"
