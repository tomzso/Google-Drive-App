const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('http://localhost:4200'); 

    const googleBtn = await driver.wait(
      until.elementLocated(By.id('googleBtn')),
      10000
    );

    await driver.wait(
      async () => {
        const html = await googleBtn.getAttribute('innerHTML');
        return html;
      },
      10000,
      'Google Sign-In button was not rendered in time'
    );

    console.log('Google Sign-In button rendered successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

runTest();