// If you encounter a "Permission denied" or log in error, please rerun the tests one or more times and they should pass.

const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

describe('payments', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:8080/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
  });

  it('should complete a new payment', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    const stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'New']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'new');

    const filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    const completePaymentButtons = await driver.findElements(By.css('*[class^="ui loadable teal labeled icon button"]'));
    await completePaymentButtons[0].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Payment has been completed.'));
  });

  it('should clear payment filters', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'New']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'new');

    let channelCombobox = await driver.findElement(By.xpath('//select[@name="criteria[channel]"]'));
    await channelCombobox.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();
    assert.strictEqual(await channelCombobox.getAttribute('value'), '2');

    const filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    const clearFiltersLink = await driver.findElement(By.linkText('Clear filters'));
    await clearFiltersLink.click();

    stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    assert.strictEqual(await stateCombobox.getAttribute('value'), '');

    channelCombobox = await driver.findElement(By.xpath('//select[@name="criteria[channel]"]'));
    assert.strictEqual(await stateCombobox.getAttribute('value'), '');
  });

  it('should show a message if no payments were found with the current filters', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Refunded']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'refunded');

    let channelCombobox = await driver.findElement(By.xpath('//select[@name="criteria[channel]"]'));
    await channelCombobox.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();
    assert.strictEqual(await channelCombobox.getAttribute('value'), '2');

    const filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });

  it('should navigate between payment list pages by clicking on "Next" and "Previous"', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let currentURL = await driver.getCurrentUrl();
    assert(!currentURL.includes('page=1'));

    let previousButtons = await driver.findElements(By.linkText('Previous'));
    assert.strictEqual(previousButtons.length, 0);

    let nextButtons = await driver.findElements(By.linkText('Next'));
    await nextButtons[0].click();

    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('page=2'));

    nextButtons = await driver.findElements(By.linkText('Next'));
    assert.strictEqual(nextButtons.length, 0);

    previousButtons = await driver.findElements(By.linkText('Previous'));
    await previousButtons[0].click();

    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('page=1'));

    previousButtons = await driver.findElements(By.linkText('Previous'));
    assert.strictEqual(previousButtons.length, 0);

    nextButtons = await driver.findElements(By.linkText('Next'));
    assert(nextButtons.length > 0);

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Refunded']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'refunded');

    let channelCombobox = await driver.findElement(By.xpath('//select[@name="criteria[channel]"]'));
    await channelCombobox.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();
    assert.strictEqual(await channelCombobox.getAttribute('value'), '2');

    const filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    previousButtons = await driver.findElements(By.linkText('Previous'));
    assert.strictEqual(previousButtons.length, 0);

    nextButtons = await driver.findElements(By.linkText('Next'));
    assert.strictEqual(nextButtons.length, 0);
  });

  it('should navigate between payment list pages by clicking on each page number', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let currentURL = await driver.getCurrentUrl();
    assert(!currentURL.includes('page=1'));

    let firstPageNumbers = await driver.findElements(By.linkText('1'));
    assert.strictEqual(firstPageNumbers.length, 0);

    let secondPageNumbers = await driver.findElements(By.linkText('2'));
    await secondPageNumbers[0].click();

    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('page=2'));

    secondPageNumbers = await driver.findElements(By.linkText('2'));
    assert.strictEqual(secondPageNumbers.length, 0);

    firstPageNumbers = await driver.findElements(By.linkText('1'));
    await firstPageNumbers[0].click();

    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('page=1'));

    firstPageNumbers = await driver.findElements(By.linkText('1'));
    assert.strictEqual(firstPageNumbers.length, 0);

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Refunded']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'refunded');

    let channelCombobox = await driver.findElement(By.xpath('//select[@name="criteria[channel]"]'));
    await channelCombobox.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();
    assert.strictEqual(await channelCombobox.getAttribute('value'), '2');

    const filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    firstPageNumbers = await driver.findElements(By.linkText('1'));
    assert.strictEqual(firstPageNumbers.length, 0);

    secondPageNumbers = await driver.findElements(By.linkText('2'));
    assert.strictEqual(secondPageNumbers.length, 0);
  });

  it('should limit the payment list', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let currentURL = await driver.getCurrentUrl();
    assert(!currentURL.includes('limit=10'));

    await driver.findElement(By.xpath("//*[contains(text(), 'Show 10')]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.linkText('25')).click();
    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('limit=25'));

    await driver.findElement(By.xpath("//*[contains(text(), 'Show 25')]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.linkText('50')).click();
    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('limit=50'));

    await driver.findElement(By.xpath("//*[contains(text(), 'Show 50')]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.linkText('10')).click();
    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('limit=10'));
  });

  it('should order orders by Date', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    await driver.findElement(By.linkText('Date')).click();
    let currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('sorting%5BcreatedAt%5D=asc'));

    await driver.findElement(By.linkText('Date')).click();
    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('sorting%5BcreatedAt%5D=desc'));

    await driver.findElement(By.linkText('2')).click();
    currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('sorting%5BcreatedAt%5D=desc'));
  });

  it('order link should go to the correct order', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Completed']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'completed');

    let filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    let order = await driver.findElement(By.xpath('//tbody/tr[1]/td[2]/a'));
    let orderText = await order.getText();
    let orderId = parseInt(orderText.replace('#', ''));
    await order.click();

    let currentURL = await driver.getCurrentUrl();
    assert(currentURL.includes('orders/', orderId));

    await driver.findElement(By.linkText('Payments')).click();

    stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Completed']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'completed');

    filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    await driver.findElement(By.xpath("//*[contains(text(), '" + orderText + "')]"));
  });

  it('should filter payments by State', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Completed']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'completed');

    let filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    let elements = await driver.findElements(By.xpath("//*[@class='ui olive label']"));
    assert.strictEqual(elements.length, 0);
    elements = await driver.findElements(By.xpath("//*[@class='ui purple label']"));
    assert.strictEqual(elements.length, 0);
    elements = await driver.findElements(By.xpath("//*[@class='ui green label']"));
    assert.notStrictEqual(elements.length, 0);

    stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'New']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'new');

    filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    elements = await driver.findElements(By.xpath("//*[@class='ui purple label']"));
    assert.strictEqual(elements.length, 0);
    elements = await driver.findElements(By.xpath("//*[@class='ui green label']"));
    assert.strictEqual(elements.length, 0);
    elements = await driver.findElements(By.xpath("//*[@class='ui olive label']"));
    assert.notStrictEqual(elements.length, 0);
  });

  it('should refund orders', async () => {
    await driver.findElement(By.linkText('Payments')).click();

    let stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Completed']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'completed');

    let filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    let order = await driver.findElement(By.xpath('//tbody/tr[1]/td[2]/a'));
    let orderText = await order.getText();
    let orderId = parseInt(orderText.replace('#', ''));
    await order.click();

    await driver.findElement(By.xpath("//*[contains(text(), 'Refund')]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//*[contains(text(), 'Payment has been successfully refunded.')]"));

    await driver.findElement(By.linkText('Payments')).click();

    stateCombobox = await driver.findElement(By.xpath('//select[@name="criteria[state]"]'));
    await stateCombobox.findElement(By.xpath("//option[. = 'Refunded']")).click();
    assert.strictEqual(await stateCombobox.getAttribute('value'), 'refunded');

    filterButton = await driver.findElement(By.css('*[class^="ui blue labeled icon button"]'));
    await filterButton.click();

    await driver.findElement(By.xpath("//*[contains(text(), '" + orderText + "')]"));
  });

});
