const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');

async function runTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    //login to the application
    await driver.get('http://localhost:4200');
    await driver.executeScript(() => {
        const fakeUser = {
            name: "Test User",
        };
        sessionStorage.setItem("loggedInUser", JSON.stringify(fakeUser));
    });

    await driver.get('http://localhost:4200/dashboard'); 


    const uploadLabel = await driver.wait(
      until.elementLocated(By.css('label.google-drive-button')),
      10000
    );

    // Simulate a click on the upload label
    await uploadLabel.click();

    const fileInput = await driver.findElement(By.id('fileInput'));

    const filePath = path.resolve(__dirname, '../../assets/test/sample.pdf'); 
    await fileInput.sendKeys(filePath);

    await sleep(1000);
 
    console.log('File upload simulated');

    // Simulate creating a new folder
    const newFolderButton =  await driver.findElement(By.id('fileCreateFolder'));
    await newFolderButton.click();
    
    const folderInput = await driver.wait(
      until.elementLocated(By.css('mat-dialog-container input[placeholder="Folder name"]')),
      5000
    );
    await folderInput.sendKeys("test folder");

    const createButton = await driver.wait(
      until.elementLocated(By.css('mat-dialog-container button[color="primary"]')),
      5000
    );
    
    await createButton.click();
    await sleep(1000);

    console.log('New folder button clicked');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await driver.quit();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

runTest();
