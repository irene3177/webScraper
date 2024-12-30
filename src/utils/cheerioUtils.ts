const cheerio = require('cheerio');

/**
 * Loads HTML content into Cheerio.
 * @param html - The HTML content to load.
 * @returns A CheerioAPI instance.
 * @throws Error if HTML is undefined or empty.
 */
export function loadCheerio(html: string): cheerio.CheerioAPI {
    if (!html) {
        throw new Error('HTML content is undefined or empty.');
    }

    return cheerio.load(html); // Load and return the Cheerio instance
}