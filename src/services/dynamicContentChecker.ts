import { URL_PATTERN } from '../utils/constants';
import { loadCheerio } from '../utils/cheerioUtils';

/**
 * Checks if the provided HTML has dynamic content.
 * @param html - The HTML content to analyze.
 * @returns A promise that resolves to true if dynamic content is found, otherwise false.
 */
export async function hasDynamicContent(html: string): Promise<boolean> {
  if (!html) {
      throw new Error('HTML content is undefined');
  }

  const $ = loadCheerio(html); // Load HTML into Cheerio
  const scripts = $('script'); // Select all script tags

  // Check for dynamic indicators using scripts and other HTML elements
  const hasDynamicScripts = checkDynamicScripts(scripts, $);

  // Check for dynamic elements in the document
  const hasDynamicElements = hasDynamicIndicators($); 

  return hasDynamicElements || hasDynamicScripts; // Return true if any dynamic content is found
}

/**
 * Checks all script tags for indicators of dynamic content.
 * 
 * @param scripts - The Cheerio collection of script elements.
 * @param $ - The Cheerio instance for traversing HTML.
 * @returns True if any dynamic indicators are found, otherwise false.
 */
function checkDynamicScripts(scripts: cheerio.Cheerio, $: cheerio.CheerioAPI): boolean {
  //for (const script of scripts.toArray()) {
  scripts.each((_, script) => {
    const scriptContent = $(script).html() || "";

    // Check for fetch, XMLHttpRequest, or URLs
    if (scriptContent.includes('fetch') || scriptContent.includes('XMLHttpRequest') || scriptContent.match(URL_PATTERN)) {
      return true; // Return as soon as dynamic content is detected
    }
  });

  return false; // No dynamic content found in scripts
}

/**
 * Checks for specific classes or attributes within the document indicating dynamic content.
 * 
 * @param $ - The Cheerio instance for traversing HTML.
 * @returns True if any dynamic indicators are found; otherwise, false.
 */
function hasDynamicIndicators($: cheerio.CheerioAPI): boolean {
  const dynamicSelectors = [
      '.loading',            
      '.loading-indicator',
      '.spinner',
      '[data-load]',
      '[data-fetch]',
  ];

  return dynamicSelectors.some(selector => $(selector).length > 0); // Check if any dynamic elements exist
}