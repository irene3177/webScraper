import { loadCheerio } from './cheerioUtils';
const cheerio = require ('cheerio');

jest.mock('cheerio', () => {
  const originalModule = jest.requireActual('cheerio');
  return {
    ...originalModule,
    load: jest.fn().mockImplementation(originalModule.load),
  };
});

describe('loadCheerio', () => {
  it('should load HTML content into Cheerio and return an instance', () => {
    const html = '<html><body><div>Hello World</div></body></html>';
    const $ = loadCheerio(html);

    expect(typeof $).toBe('function'); // CheerioAPI is callable like a function
    expect(cheerio.load).toHaveBeenCalledWith(html);
    const divText = $('div').text();
    expect(divText).toBe('Hello World');
  });

  it('should throw an error if HTML is undefined', () => {
    expect(() => loadCheerio(undefined as any)).toThrow('HTML content is undefined or empty.');
  });

  it('should throw an error if HTML is an empty string', () => {
    expect(() => loadCheerio('')).toThrow('HTML content is undefined or empty.');
  });
});