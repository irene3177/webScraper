const fs = require('fs');
const cheerio = require('cheerio');
const { URL } = require('url');
const psl = require('psl');

function saveHtmlToFile(html, file) {
  fs.writeFileSync(file, html, 'utf8');
}

async function hasDynamicContent(html) {
  const $ = cheerio.load(html);
  const scripts = $('script');
  let isDynamic = false;
//   const dynamicIndicators = [
//     '.loading',                   // Loading indicator
//     '.loading-indicator',         // Specific loading indicator
//     '.spinner',                   // Spinner for loading
//     '.ajax-content',              // Content loaded via AJAX
//     '.dynamic-content',           // Element for dynamic content
//     '.dynamic-data',              // Placeholder for dynamic data
//     '.lazy-load',                 // Lazy loaded content
//     '[data-load]',                // Custom attribute for load
//     '[data-fetch]',               // Custom attribute for fetching data
//     '.expandable',                // For expandable content
//     '.accordion',                 // For accordion style content
//     '.js-issues',                 // Specifically for issues sections
//     '.js-pull-requests',          // For pull requests
//     '.js-navigation-enable',      // For navigation enable indications
// ];
  
  // Check for JavaScript code indicating dynamic loading
  scripts.each((i, script) => {
    const scriptContent = $(script).html();
    if (scriptContent && (scriptContent.includes('fetch') || scriptContent.includes('XMLHttpRequest'))) {
      isDynamic = true;
    }
  });

  // if (dynamicIndicators.some(selector => $(selector).length > 0 && $(selector).is(':empty'))) {
  //   isDynamic = true;
  // }
  return isDynamic;
}

function extractLinksFromHtml(html) {
  const $ = cheerio.load(html);

  return $('a').map((_, anchor) => $(anchor).attr('href')).get();
}

function filterLinksByDomain(links, targetUrl) {
  const parsed = psl.parse(new URL(targetUrl).hostname);
  const domain = `${parsed.domain}`;
  return links
    .map(link => {
      try {
        const absoluteUrl = new URL(link, targetUrl).href;
        return absoluteUrl;
      } catch {
        return null;
      }
    })
    .filter(link => link && new URL(link).hostname.endsWith(domain));
}

module.exports = {
  saveHtmlToFile,
  hasDynamicContent,
  extractLinksFromHtml,
  filterLinksByDomain,
};