const { runner } = require('./runner');

(async () => {
  try {
    const exitCode = await runner();
    console.log(`Test finished! [${exitCode}]`);
    process.exit(exitCode);
  } catch (e) {
    console.log('[Caught error] Test error');
    console.log(e);
    process.exit(e);
  }
})().catch((e) => {
  console.log('SOME OTHER ERROR');
  console.error(e);
});
