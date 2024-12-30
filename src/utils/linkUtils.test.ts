import { extractLinksFromHtml, filterLinksByDomain, parseAndValidateUrl } from './linkUtils'; // Adjust the path as necessary
import psl from 'psl';

describe('LinkUtils', () => {
  describe('extractLinksFromHtml', () => {
    it('should extract all links from HTML', () => {
      const html = `
        <html>
          <body>
            <a href="http://example.com/page1">Page 1</a>
            <a href="http://example.com/page2">Page 2</a>
            <a href="http://example.com/page3">Page 3</a>
          </body>
        </html>
      `;
      const links = extractLinksFromHtml(html);
      expect(links).toEqual([
        'http://example.com/page1',
        'http://example.com/page2',
        'http://example.com/page3',
      ]);
    });

    it('should limit the number of extracted links', () => {
      const html = `
        <html>
          <body>
            <a href="http://example.com/page1">Page 1</a>
            <a href="http://example.com/page2">Page 2</a>
          </body>
        </html>
      `;
      const links = extractLinksFromHtml(html, 1);
      expect(links).toEqual(['http://example.com/page1']); // Should only return the first link
    });
  });

  describe('filterLinksByDomain', () => {
    it('should return only links from the same domain as the targetUrl', () => {
      const links = ['http://domain.com/page1', 'https://another.com/page', 'http://domain.com/page2'];
      const targetUrl = 'http://domain.com';
      const filteredLinks = filterLinksByDomain(links, targetUrl);
      expect(filteredLinks).toEqual(['http://domain.com/page1', 'http://domain.com/page2']);
    });
  
    it('should return an empty array if no links match the domain', () => {
      const links = ['https://another.com/page', 'http://sample.com/page2'];
      const targetUrl = 'http://domain.com';
      const filteredLinks = filterLinksByDomain(links, targetUrl);
      expect(filteredLinks).toEqual([]);
    });
  });

  describe('parseAndValidateUrl', () => {
    it('should return the domain for a valid URL', () => {
      const domain = parseAndValidateUrl('http://example.com/page');
      expect(domain).toEqual('example.com');
    });
  
    it('should throw an error for an invalid URL', () => {
      expect(() => parseAndValidateUrl('invalid-url')).toThrow('Invalid URL');
    });
  
    it('should correctly parse and validate subdomains', () => {
      const domain = parseAndValidateUrl('http://sub.example.com');
      expect(domain).toEqual('example.com'); // Assume the logic should extract the registerable domain
    });
  });
});