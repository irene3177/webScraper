const puppeteer = require('puppeteer');

async function fetchHtmlWithPuppeteer(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const html = await page.content();
  await browser.close();
  return html;
}

module.exports = {
  fetchHtmlWithPuppeteer,
};