This is an example of using the existing lambda layer docker image to build a layer which includes dependencies for running
[webdriver.io](https://webdriver.io) (wdio) in a lambda function.

There are three helper scripts included:

**build.sh**

Build all the build stages if you want.

**invoke.sh**

Utilizes the [lambci](https://github.com/lambci/docker-lambda) docker container as a proof of concept for invoking a lambda function with the
test code. Lambci docker containers attempt to recreate the lambda invocation environment as close as possible but it does not guarantee that your code
will run the same in the actual lambda environment.

**create-layer.sh**

Creates a lambda node10 layer including all dependencies needed for chromium, chromedriver, and webdriver.io.

**publish-layer.sh**

Example of publishing the layer to your AWS account.

## Creating a lambda function

Create a lambda function with the default execution role, name it `wdio-demo-node10`.

Run `./update-lambda.sh` to update the lambda with the test handler code and layer information.
