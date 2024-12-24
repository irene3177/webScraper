const puppeteer = require('puppeteer');

async function fetchHtmlWithPuppeteer(url) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle2' });

    if(!response || !response.ok()) {
      throw new Error(`Failed to load the page: ${response && response.status()}`);
    }

    const html = await page.content();
    return html;
    
  } catch (error) {
    throw error;
  } finally {
    if(browser) {
      await browser.close();
    }
  }
}

module.exports = {
  fetchHtmlWithPuppeteer,
};