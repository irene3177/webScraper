import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import NotFoundError from '../errors/notFoundError';
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

const mockedAxios = axios as jest.Mocked<typeof axios>;


describe('fetchHtml', () => {
  const targetUrl = 'http://example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return HTML content if the fetch is successful', async () => {
    const htmlContent = '<html><body>Example</body></html>';
    (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: htmlContent });

    const result = await fetchHtml(targetUrl);

    expect(axios.get).toHaveBeenCalledWith(targetUrl);
    expect(result).toBe(htmlContent);
  });

  it('should throw NotFoundError if the fetch fails', async () => {
    const errorMessage = 'Network Error';
    (axios.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(fetchHtml(targetUrl)).rejects.toThrow(NotFoundError);
    await expect(fetchHtml(targetUrl)).rejects.toThrow(`Could not fetch the URL: ${targetUrl}. Error: ${errorMessage}`);
  });
});


describe('ensureDirectoryExists', () => {
  const htmlFilePath = '/some/path/to/file.html';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create the directory if it does not exist', async () => {
    // Mock the implementation of fs.mkdir to resolve successfully
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);

    await ensureDirectoryExists(htmlFilePath);

    // Verify `fs.mkdir` was called with the correct directory path
    expect(fs.mkdir).toHaveBeenCalledWith(path.dirname(htmlFilePath), { recursive: true });
  });

  it('should throw an error if directory creation fails', async () => {
    // Setup the mock to reject with an error
    const errorMessage = 'Permission denied';
    (fs.mkdir as jest.Mock).mockRejectedValue(new Error(errorMessage));

    // Assert that the custom error message is thrown
    await expect(ensureDirectoryExists(htmlFilePath)).rejects.toThrow(
      `Failed to create directory for file path "${htmlFilePath}": ${errorMessage}`
    );
  });
});

describe('processDynamicContent', () => {
  const targetUrl = 'http://example.com';
  const initialHtml = '<html><body><p>Sample content</p></body></html>';
  const puppeteerHtml = '<html><body><p>Dynamic content</p></body></html>';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the original HTML if no dynamic content is detected', async () => {
    (hasDynamicContent as jest.Mock).mockResolvedValue(false);

    const result = await processDynamicContent(targetUrl, initialHtml);

    expect(hasDynamicContent).toHaveBeenCalledWith(initialHtml);
    expect(result).toBe(initialHtml);
  });

  it('should refetch and return HTML with Puppeteer if dynamic content is detected', async () => {
    (hasDynamicContent as jest.Mock).mockResolvedValue(true);
    (fetchHtmlWithPuppeteer as jest.Mock).mockResolvedValue(puppeteerHtml);

    const result = await processDynamicContent(targetUrl, initialHtml);

    expect(hasDynamicContent).toHaveBeenCalledWith(initialHtml);
    expect(fetchHtmlWithPuppeteer).toHaveBeenCalledWith(targetUrl);
    expect(result).toBe(puppeteerHtml);
  });

  it('should throw an error if fetchHtmlWithPuppeteer encounters an error', async () => {
    const errorMessage = 'Puppeteer error';
    (hasDynamicContent as jest.Mock).mockResolvedValue(true);
    (fetchHtmlWithPuppeteer as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(processDynamicContent(targetUrl, initialHtml)).rejects.toThrow(
      `Error while processing dynamic content for URL "${targetUrl}": ${errorMessage}`
    );
  });
});

//// FIX THIS //////

// describe('fetchAndProcessHtml', () => {
//   const targetUrl = 'http://example.com';
//   const initialHtml = '<html><body><a href="http://example.com/page">Link</a></body></html>';
//   const finalHtml = '<html><body>Processed Content</body></html>';
//   const links = ['http://example.com/page'];
//   const filteredLinks = ['http://example.com/page'];
//   const htmlFilePath = path.resolve(__dirname, `../savedWebsites/example.com.html`);

//   beforeEach(() => {
//     jest.clearAllMocks();

//     (axios.get as jest.Mock).mockResolvedValue({ status: 200, data: initialHtml });
//     (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
//     (fetchHtmlWithPuppeteer as jest.Mock).mockResolvedValue(finalHtml);
//     (saveHtmlToFile as jest.Mock).mockResolvedValue(undefined);
//     (hasDynamicContent as jest.Mock).mockResolvedValue(false);
//     (extractLinksFromHtml as jest.Mock).mockReturnValue(links);
//     (filterLinksByDomain as jest.Mock).mockReturnValue(filteredLinks);
//   });

//   it('should fetch and process HTML, then return extracted links and file path', async () => {
//     const ensureDirSpy = jest.spyOn(require('./htmlService'), 'ensureDirectoryExists').mockResolvedValue(undefined);

//     // Spy on the processDynamicContent method
//     const processSpy = jest.spyOn(require('./htmlService'), 'processDynamicContent').mockResolvedValue(finalHtml);

//     const result = await fetchAndProcessHtml(targetUrl);


//     expect(axios.get).toHaveBeenCalledWith(targetUrl);
//     expect(ensureDirSpy).toHaveBeenCalledWith(htmlFilePath);
//     expect(processSpy).toHaveBeenCalledWith(targetUrl, initialHtml);
//     expect(saveHtmlToFile).toHaveBeenCalledWith(finalHtml, htmlFilePath);
//     expect(extractLinksFromHtml).toHaveBeenCalledWith(finalHtml);
//     expect(filterLinksByDomain).toHaveBeenCalledWith(links, targetUrl);

//     expect(result).toEqual({ links: filteredLinks, htmlFilePath });
//   });

//   it('should handle dynamic content and refetch if necessary', async () => {
//     (hasDynamicContent as jest.Mock).mockResolvedValue(true);

//     await fetchAndProcessHtml(targetUrl);

//     expect(fetchHtmlWithPuppeteer).toHaveBeenCalledWith(targetUrl);
//   });

//   it('should throw an error if any processing step fails', async () => {
//     (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

//     await expect(fetchAndProcessHtml(targetUrl)).rejects.toThrow(
//       `Error while processing HTML for URL "${targetUrl}": Could not fetch the URL: ${targetUrl}. Error: Failed to fetch`
//     );
//   });
// });