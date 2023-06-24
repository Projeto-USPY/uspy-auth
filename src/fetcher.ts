import { Browser } from 'puppeteer';

export const fetchPDF = async (browser: Browser, code: string) => {
  console.log('fetching pdf...');
  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (req) => {
    if (
      req.resourceType() == 'stylesheet' ||
      req.resourceType() == 'font' ||
      req.resourceType() == 'image'
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  console.log('waiting for page goto');
  await page.goto(`https://portalservicos.usp.br/iddigital/${code}`);

  console.log('waiting for recaptcha token...');
  await page.waitForSelector('[title="reCAPTCHA"]');

  console.log('waiting for submit button...');
  const submitButton = await page.waitForSelector('[type="submit"]');

  if (submitButton) {
    console.log('submitting form...');
    await submitButton
      .click()
      .then(() => {
        console.log('form submitted');
      })
      .catch((e) => {
        console.log('form submit failed');
        throw e;
      });
  } else {
    console.log('No submit button found');
    throw new Error('No submit button found');
  }

  // wait for the response to be set or timeout
  return page
    .waitForResponse(
      (response) => {
        return response.url().endsWith(code);
      },
      { timeout: 5000 }
    )
    .then((response) => {
      if (response.status() !== 200) {
        throw new Error(
          `failed to fetch PDF... response status ${response.status()}`
        );
      }

      console.log('got pdf');
      return response.buffer();
    })
    .catch((e) => {
      console.log('failed to fetch PDF');
      throw e;
    });
};
