import fs from 'fs/promises';
import path from 'path';
import axios from'axios';
import { fetchHtmlWithPuppeteer } from './puppeteerService';
import NotFoundError from '../errors/notFoundError';
import { saveHtmlToFile } from '../utils/fileUtils';
import { hasDynamicContent } from './dynamicContentChecker';
import { filterLinksByDomain, extractLinksFromHtml } from '../utils/linkUtils';


/**
 * Fetches HTML content from the specified URL and processes it.
 * 
 * @param targetUrl - The URL to be scraped.
 * @returns An object containing the extracted links and path to the saved HTML file.
 * @throws NotFoundError if the URL cannot be fetched.
 */
async function fetchAndProcessHtml(targetUrl: string) {
  try {
    const html = await fetchHtml(targetUrl);
    const websiteName = new URL(targetUrl).hostname.replace('www.', '');
    const htmlFilePath = path.join(__dirname, `../savedWebsites/${websiteName}.html`);
  
    // Ensure the directory for the saved HTML file exists
    await ensureDirectoryExists(htmlFilePath);
  
    const finalHtml = await processDynamicContent(targetUrl, html);
    await saveHtmlToFile(finalHtml, htmlFilePath);
  
    const links = extractLinksFromHtml(finalHtml); // Extract links from the final HTML
    const filteredLinks = filterLinksByDomain(links, targetUrl); // Filter links by domain
  
    return { links: filteredLinks, htmlFilePath }; // Return the results

  } catch (error: any) {
    throw new Error(`Error while processing HTML for URL "${targetUrl}": ${error.message}`);
  }
}

/**
 * Fetches HTML content from the specified URL using Axios.
 *
 * @param targetUrl - The URL to fetch.
 * @returns Fetched HTML content.
 * @throws NotFoundError if the HTML cannot be fetched.
 */
async function fetchHtml(targetUrl: string): Promise<string> {
  try {
    const response = await axios.get(targetUrl);
    return response.data; // Return the HTML
  } catch (error: any) {
    throw new NotFoundError(`Could not fetch the URL: ${targetUrl}. Error: ${error.message}`);
  }
}

/**
 * Ensures that the directory for the saved HTML file exists.
 *
 * @param htmlFilePath - The file path to check for directory existence.
 */
async function ensureDirectoryExists(htmlFilePath: string): Promise<void> {
  const dirPath = path.dirname(htmlFilePath);
  try {
    await fs.mkdir(dirPath, { recursive: true }); // Create directory recursively if it doesn't exist
  } catch (error: any) {
    throw new Error(`Failed to create directory for file path "${htmlFilePath}": ${error.message}`);
  }
}

/**
 * Processes the HTML to check and refetch if dynamic content is detected.
 *
 * @param targetUrl - The URL to check for dynamic content.
 * @param html - The initial HTML content.
 * @returns Final HTML content after processing.
 */
async function processDynamicContent(targetUrl: string, html: string): Promise<string> {
  try {
    if (await hasDynamicContent(html)) {
      return await fetchHtmlWithPuppeteer(targetUrl); // Refetch dynamic content
    }
    return html; // Return the original HTML if it's static
  } catch (error: any) {
    throw new Error(`Error while processing dynamic content for URL "${targetUrl}": ${error.message}`);
  }
}

export { fetchAndProcessHtml, fetchHtml, ensureDirectoryExists, processDynamicContent };
