const { runner } = require('./runner');

exports.handler = async(event) => {
  let exitCode = -1;

  try {
    exitCode = await runner();
    console.log(`Test finished! [${exitCode}]`);
  }
  catch (e) {
    console.log('[Caught error] Test error');
    console.log(e);
    exitCode = 1;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
    exitCode,
  };
  return response;
};

