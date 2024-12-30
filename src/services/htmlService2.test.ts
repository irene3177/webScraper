import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fetchHtmlWithPuppeteer } from './puppeteerService';
import { hasDynamicContent } from './dynamicContentChecker';
import { saveHtmlToFile } from '../utils/fileUtils';
import { filterLinksByDomain, extractLinksFromHtml } from '../utils/linkUtils';
import { 
  fetchHtml, 
  ensureDirectoryExists, 
  processDynamicContent, 
  fetchAndProcessHtml 
} from './htmlService';

jest.mock('axios');
jest.mock('fs/promises');
jest.mock('./puppeteerService');
jest.mock('./dynamicContentChecker');
jest.mock('../utils/fileUtils');
jest.mock('../utils/linkUtils');

describe('fetchAndProcessHtml', () => {
  const targetUrl = 'http://example.com';
  const initialHtml = '<html><body><a href="http://example.com/page">Link</a></body></html>';
  const finalHtml = '<html><body>Processed Content</body></html>';
  const links = ['http://example.com/page'];
  const filteredLinks = ['http://example.com/page'];
  const htmlFilePath = path.resolve(__dirname, `../savedWebsites/example.com.html`);

  beforeEach(() => {
    jest.clearAllMocks();

    (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: initialHtml });
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fetchHtmlWithPuppeteer as jest.Mock).mockResolvedValue(finalHtml);
    (saveHtmlToFile as jest.Mock).mockResolvedValue(undefined);
    (hasDynamicContent as jest.Mock).mockResolvedValue(false);
    (extractLinksFromHtml as jest.Mock).mockReturnValue(links);
    (filterLinksByDomain as jest.Mock).mockReturnValue(filteredLinks);
  });

  it('should fetch and process HTML, then return extracted links and file path', async () => {
    
    const result = await fetchAndProcessHtml(targetUrl);


    expect(axios.get).toHaveBeenCalledWith(targetUrl);
    expect(ensureDirectoryExists).toHaveBeenCalledWith(htmlFilePath);
    expect(processDynamicContent).toHaveBeenCalledWith(targetUrl, initialHtml);
    expect(saveHtmlToFile).toHaveBeenCalledWith(finalHtml, htmlFilePath);
    expect(extractLinksFromHtml).toHaveBeenCalledWith(finalHtml);
    expect(filterLinksByDomain).toHaveBeenCalledWith(links, targetUrl);

    expect(result).toEqual({ links: filteredLinks, htmlFilePath });
  });

  it('should handle dynamic content and refetch if necessary', async () => {
    (hasDynamicContent as jest.Mock).mockResolvedValue(true);

    await fetchAndProcessHtml(targetUrl);

    expect(fetchHtmlWithPuppeteer).toHaveBeenCalledWith(targetUrl);
  });

  it('should throw an error if any processing step fails', async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    await expect(fetchAndProcessHtml(targetUrl)).rejects.toThrow(
      `Error while processing HTML for URL "${targetUrl}": Could not fetch the URL: ${targetUrl}. Error: Failed to fetch`
    );
  });
});