const chromium = require('chrome-aws-lambda');
// node 10.15.3 does not have mkdirp so polyfill it
const { mkdirpSync } = require('./fileUtils');

// necessary for telling chrome-aws-lambda to pretend we are in a lambda exection environment if we are not in one or not using lambci
process.env.AWS_LAMBDA_FUNCTION_NAME = process.env.AWS_LAMBDA_FUNCTION_NAME || 'lambdafunctionname';
process.env.FUNCTION_NAME = process.env.FUNCTION_NAME || 'myfunctionname';
process.env.FUNCTION_TARGET = process.env.FUNCTION_TARGET || 'target';

// set fontconfig path so chromium knows where to find fonts
process.env.FONTCONFIG_PATH = '/opt/usr/share/fontconfig';

// helper function for modifying browser capabilities
const arrayBuilder = (arrBase, arrAdd = [], arrRemove = []) => {
  const tmp = [...arrBase.concat(arrAdd)];
  const config = Array.from(new Set(tmp));

  return config.filter((val, idx) => arrRemove.indexOf(val) === -1);
}

const runner = async() => {
  process.env.CHROME_BINARY_PATH = await chromium.executablePath;

  if (process.env.TAKE_SCREENSHOTS) {
    await mkdirpSync('/tmp/screenshots');
  }

  const Launcher = require('@wdio/cli').default;
  const baseCapabilities = require('./wdio.conf.js').baseCapabilities;
  const capabilities = {...baseCapabilities};

  capabilities['goog:chromeOptions'].args = arrayBuilder(
    baseCapabilities['goog:chromeOptions'].args,
    // these aren't necessary but shown as an example of additional arguments to pass to chromium
    [
      '--ignore-certificate-errors',
      '--allow-insecure-localhost',
      '--data-path=/tmp/data-path',
      '--user-data-dir=/tmp/user-data',
      '--homedir=/tmp',
      '--disk-cache-dir=/tmp/cache-dir',
      '--enable-features=NetworkService',
    ],
    [],
  );

  // logging the capabilities for ease in debugging
  // TODO use https://www.npmjs.com/package/debug
  console.log(capabilities);

  const wdio = new Launcher('./wdio.conf.js', {
    capabilities: [capabilities],
  });

  return new Promise((resolve, reject) => {
    wdio.run().then((code) => {
      return resolve(code);
    }, (error) => {
      console.error('Launcher failed to start the test', error.stacktrace);
      return reject(error);
    });
  });
}

exports.runner = runner;
