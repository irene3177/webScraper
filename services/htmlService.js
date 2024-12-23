const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteerService = require('./puppeteerService');
const {
  filterLinksByDomain,
  saveHtmlToFile,
  hasDynamicContent,
  extractLinksFromHtml,
} = require('../utils/fileUtils');

async function fetchAndProcessHtml(targetUrl) {
  let html;
  let links;

  try {
    html = await axios.get(targetUrl).then(response => response.data);
  } catch (error) {
    throw new Error('Could not fetch the URL using axios');
  }

  const websiteName = new URL(targetUrl).hostname.replace('www.', '');
  const htmlFilePath = path.join(__dirname, `../savedWebsites/${websiteName}.html`);
  
  if(hasDynamicContent(html)) {
    html = await puppeteerService.fetchHtmlWithPuppeteer(targetUrl);
    saveHtmlToFile(html, htmlFilePath);
  }
  saveHtmlToFile(html, htmlFilePath);
  
  html = fs.readFileSync(htmlFilePath, 'utf-8');

  links = extractLinksFromHtml(html);
  const filteredLinks = filterLinksByDomain(links, targetUrl);

  //const jsonFilePath = path.join(__dirname, '../output.json');
  // fs.writeFileSync(jsonFilePath, JSON.stringify(filteredLinks, null, 2));

  return { links: filteredLinks, htmlFilePath };
}

module.exports = {
  fetchAndProcessHtml,
};