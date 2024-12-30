// import { hasDynamicContent } from './dynamicContentChecker'; 
// import { loadCheerio } from '../utils/cheerioUtils';

// jest.mock('../utils/cheerioUtils');

// describe('hasDynamicContent', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should throw an error if HTML content is undefined', async () => {
//     await expect(hasDynamicContent(undefined as any)).rejects.toThrow('HTML content is undefined');
//   });

//   it('should return true if dynamic scripts are found', async () => {
//     const html = `<html><head><script>fetch('/data');</script></head><body></body></html>`;
    
//     // Mocking the Cheerio instance and its methods returned by loadCheerio
//     const mockCheerio = {
//       toArray: jest.fn().mockReturnValue([{}]), // Simulating one script tag
//       html: jest.fn(() => 'fetch("/data");'),
//     };
    
//     // Mock loadCheerio to return the mocked Cheerio instance
//     (loadCheerio as jest.Mock).mockReturnValue(mockCheerio);
    
//     const result = await hasDynamicContent(html);
    
//     expect(result).toBe(true);
//   });

//   it('should return true if a dynamic element is found', async () => {
//     const html = `<html><body><div class="loading"></div></body></html>`;
    
//     // Mocking Cheerio to return an instance that has .length > 0 for dynamic class
//     const mockCheerio = {
//       toArray: jest.fn().mockReturnValue([]), // No scripts
//       length: jest.fn().mockReturnValue(1), // Class .loading found
//     };

//     (loadCheerio as jest.Mock).mockReturnValue(mockCheerio);

//     const result = await hasDynamicContent(html);
    
//     expect(result).toBe(true);
//   });

//   it('should return false if no dynamic scripts or elements are found', async () => {
//     const html = `<html><body><p>No dynamic content.</p></body></html>`;
    
//     const mockCheerio = {
//       toArray: jest.fn().mockReturnValue([]), // No scripts
//       length: jest.fn().mockReturnValue(0), // No dynamic indicators
//     };

//     (loadCheerio as jest.Mock).mockReturnValue(mockCheerio);
    
//     const result = await hasDynamicContent(html);
    
//     expect(result).toBe(false);
//   });
// });