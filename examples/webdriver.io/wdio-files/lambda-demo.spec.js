const expect = require('chai').expect;

describe('lambda demo test', () => {
  it('renders "Google" as page title', async() => {
    await browser.url('google.com');
    const title = await browser.getTitle();

    expect(title).to.equal('Google');
    console.log(`Browser title: "${title}"`);

    if (process.env.TAKE_SCREENSHOTS) {
      await browser.saveScreenshot('/tmp/screenshots/google.png');
    }
  });
});
