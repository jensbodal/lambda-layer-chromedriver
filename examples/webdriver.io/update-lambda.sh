SCRIPT_DIR=$(dirname $(readlink -f "$0"))
SCRIPT_NAME=$(basename "$0")
DOCKERFILE="./dockerfile"
LAMBDA_NAME="wdio-demo-node10"
LAYER_NAME=$(cat ${DOCKERFILE} | grep "^ARG LAYER_NAME=" | sed -r 's#.*=(.*)#\1#')
ZIP_FILE_NAME="${LAYER_NAME}.zip"
ZIP_FILE_LOC="./layers/${ZIP_FILE_NAME}"

main() {
  local layer_arn="$(get_latest_layer_arn ${LAYER_NAME} | tr -d '"')"

  create_lambda_zip


  aws lambda update-function-configuration \
    --function-name ${LAMBDA_NAME} \
    --description "Example of running webdriver.io tests in lambda using headless chromium and chromedriver" \
    --handler "index.handler" \
    --timeout 60 \
    --memory-size 3008 \
    --layers $layer_arn && \
  aws lambda update-function-code \
    --function-name ${LAMBDA_NAME} \
    --zip-file fileb://${LAMBDA_NAME}.zip

}

create_lambda_zip() {
  cp ${SCRIPT_DIR}/wdio-files/* ${SCRIPT_DIR}/handler/
  pushd ${SCRIPT_DIR}/handler
  zip -9 --filesync --recurse-paths --symlinks "${LAMBDA_NAME}.zip" "./"
  mv "${LAMBDA_NAME}.zip" "${SCRIPT_DIR}"
  popd
}

get_latest_layer_arn() {
  local layername="$1"
  echo $(aws lambda list-layers | jq -c '.Layers | .[] | select(.LayerName == "'$layername'").LatestMatchingVersion.LayerVersionArn')
}

print_help() {
  echo "${SCRIPT_NAME} {aws_account_id} {aws_region}"
}

main "$@"
