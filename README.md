# lambda-layer-chromedriver

Run selenium-based automation tests in a lambda function using the latest AmazonLinux2 (AL2) with Node10.

This packages uses a pre-built binary ([chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda)) for chromium which is built for
AL2018 with Node8. In order to get this working with Node10 as well as allowing chromedriver to run additional packages were built using the
AmazonLinux2 docker image.

Some further optimizations are needed as this does not currently try to minimize to the fullest extent the size of the layer file. Additionally,
chrome-aws-lambda bundles a stripped down version of iltorb which was built for node8, so instead we are just bundling the full version
of iltorb built for node10.  Some of the chromium dependencies might not be needed if/when chrome-aws-lambda is updated to support node10.
See https://github.com/alixaxel/chrome-aws-lambda/issues/37 to follow the github issue.

---

## Building and publishing the lambda layer

The following assumes you have a default aws profile setup with the AWS CLI installed as well as docker.

The latest layer zip file can be found in the [layers](./layers) folder if you'd prefer to use the pre-built layer.

You can also use the docker image to easily extend the layer such as in the [webdriver.io example](./examples/webdriver.io)

Docker images: https://cloud.docker.com/repository/docker/jensbodal/lambda-amazonlinux2/tags

**Build the layer zip file**

```
./create-lambda-layer.sh
```

**Publish the layer**

```
./publish-layer ${MY_BUCKET_NAME}
# publishes the lambda-layer-chromedriver-al2-node10.zip layer to your lambda layers
# the layer zip file artifact will be stored in s3 in the specified bucket
```

