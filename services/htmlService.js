const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteerService = require('./puppeteerService');
const { NotFoundError } = require('../errors/notFoundError');
const {
  filterLinksByDomain,
  saveHtmlToFile,
  hasDynamicContent,
  extractLinksFromHtml,
} = require('../utils/fileUtils');


async function fetchAndProcessHtml(targetUrl) {
  let html;

  try {
    html = await axios.get(targetUrl).then(response => response.data);
  } catch (error) {
      throw new NotFoundError('Could not fetch the URL.');
  }



  const websiteName = new URL(targetUrl).hostname.replace('www.', '');
  const htmlFilePath = path.join(__dirname, `../savedWebsites/${websiteName}.html`);
  
  try {
    // Check if the website has dynamic content and refetch using Puppeteer
    if(hasDynamicContent(html)) {
      html = await puppeteerService.fetchHtmlWithPuppeteer(targetUrl);
    }
    saveHtmlToFile(html, htmlFilePath);
  } catch (error) {
    throw new Error('Error while processing dynamic content or saving HTML: ' + error.message);
  }
  
  try {
    html = fs.readFileSync(htmlFilePath, 'utf-8');
  } catch (error) {
    throw new Error('Error reading saved HTML file: ' + error.message);
  }

  links = extractLinksFromHtml(html);
  const filteredLinks = filterLinksByDomain(links, targetUrl);

  return { links: filteredLinks, htmlFilePath };
}

module.exports = {
  fetchAndProcessHtml,
};