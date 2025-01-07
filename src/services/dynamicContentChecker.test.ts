import { hasDynamicContent } from './dynamicContentChecker'; 
import { loadCheerio } from '../utils/cheerioUtils'; 

jest.mock('../utils/cheerioUtils');

describe('hasDynamicContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if HTML content is undefined', async () => {
    await expect(hasDynamicContent(undefined as any)).rejects.toThrow('HTML content is undefined');
  });

  it('should return true if dynamic scripts are found', async () => {
    const html = `<html><head><script>fetch('/data');</script></head><body></body></html>`;

    // Creating a mock Cheerio instance
    const mockCheerio = {
      find: jest.fn((selector) => {
        if (selector === 'script') {
          return {
            toArray: jest.fn().mockReturnValue([{}]), // Simulating one script tag is present
            html: jest.fn(() => 'fetch("/data");'), // Simulated script content
            length: 1 // Indicates one script tag
          };
        }
        return { length: 0 }; // For other selectors
      }),
    };

    // Mock loadCheerio to return the mock Cheerio instance
    (loadCheerio as jest.Mock).mockReturnValue(() => mockCheerio);

    const result = await hasDynamicContent(html);
    
    expect(result).toBe(true); // Expect true due to the dynamic script
  });

  it('should return true if a dynamic element is found', async () => {
    const html = `<html><body><div class="loading"></div></body></html>`;
    
    const mockCheerio = {
      find: jest.fn((selector) => {
        if (selector === '.loading') {
          return { length: 1 }; // Loading class found
        }
        return { length: 0 }; // For any other selector
      }),
    };

    (loadCheerio as jest.Mock).mockReturnValue(mockCheerio); // Ensure this is correctly set so to return the mock
   
    const result = await hasDynamicContent(html);
    
    expect(result).toBe(true); // Expect true since the loading class is present
  });

  it('should return false if no dynamic scripts or elements are found', async () => {
    const html = `<html><body><p>No dynamic content.</p></body></html>`;
    
    const mockCheerio = {
      find: jest.fn(() => ({ length: 0 })), // No dynamic indicators found
    };

    (loadCheerio as jest.Mock).mockReturnValue(mockCheerio); // Mock to return no dynamic content
    
    const result = await hasDynamicContent(html);
    
    expect(result).toBe(false); // Expect false since no dynamic indicators are present
  });
});