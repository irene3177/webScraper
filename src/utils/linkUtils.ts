import psl from 'psl';
import { loadCheerio } from './cheerioUtils';
import { URL } from 'url';
import { DOMAIN_REGEX } from './constants';

function isValidDomain(domain: string): boolean {
  return DOMAIN_REGEX.test(domain);
}

/**
 * Extracts links from HTML content, with an optional limit on the number of links.
 * @param html - The HTML content to extract links from.
 * @param maxLinks - Optional limit on the number of links to extract.
 * @returns An array of extracted links.
 */
export function extractLinksFromHtml(html: string, maxLinks?: number): string[] {
  const $ = loadCheerio(html);
  const links = $('a').map((_: any, anchor: any) => $(anchor).attr('href')).get();
  
  if (maxLinks && maxLinks > 0) {
    return links.slice(0, maxLinks);
  }
  
  return links;
}

/**
 * Filters links based on the domain of the target URL.
 * @param links - An array of links to filter.
 * @param targetUrl - The target URL to match against.
 * @returns An array of filtered links.
 */
export function filterLinksByDomain(links: string[], targetUrl: string): string[] {
  const domain = parseAndValidateUrl(targetUrl);

  // Filter links based on the domain
  return links
    .map(link => {
      try {
        const absoluteUrl = new URL(link, targetUrl).href;
        return absoluteUrl;
      } catch {
        return null;
      }
    })
    .filter(link => link && new URL(link).hostname.endsWith(domain)) as string[];
}

/**
 * Parses and validates the given target URL to extract the domain.
 * 
 * @param targetUrl - The URL to be parsed and validated.
 * @returns The parsed domain string.
 * @throws Error if the URL is invalid or cannot be parsed.
 */
export function parseAndValidateUrl(targetUrl: string): string {
  try {
    const parsedResult = psl.parse(new URL(targetUrl).hostname);

    if (!parsedResult || 'error' in parsedResult) {
      throw new Error('Invalid domain in target URL');
    }

    if (!parsedResult.domain || !isValidDomain(parsedResult.domain)) {
      throw new Error('Could not extract valid domain from target URL');
    }

    const domain = parsedResult.domain;

    // Ensure domain is not null or empty
    if (!domain || domain.trim() === '') {
      throw new Error('Could not extract a valid domain from target URL');
    }

    return domain;
  } catch (error: any) {
    throw new Error('Invalid URL: ' + error.message);
  }
}