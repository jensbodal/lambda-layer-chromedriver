const chromium = require('chrome-aws-lambda');

const baseCapabilities = {
  browserName: 'chrome',
  'goog:chromeOptions': {
    binary: process.env.CHROME_BINARY_PATH,
    args: chromium.args,
  },
};

const config = {
  port: 9515,
  path: '/',
  services: ['chromedriver'],
  chromeDriverArgs: [ '--whitelisted-ips', '--disable-dev-shm-usage'],
  chromeDriverLogs: '/tmp',
  outputDir: '/tmp',
  logLevel: 'trace',
  specFileRetries: 0,
  specs: [
    './lambda-demo.spec.js',
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};

exports.config = config;
exports.baseCapabilities = baseCapabilities;
