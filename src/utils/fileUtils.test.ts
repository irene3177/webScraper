import { saveHtmlToFile } from './fileUtils';
import fs from 'fs/promises';

// Cast writeFile as a jest mock
jest.mock('fs/promises');

const mockedWriteFile = fs.writeFile as jest.Mock;

describe('saveHtmlToFile', () => {
  beforeEach(() => {
    mockedWriteFile.mockClear();
  });

  it('should call writeFile with the correct arguments', async () => {
    const htmlContent = '<html><body>Hello, World!</body></html>';
    const filePath = 'test.html';

    await saveHtmlToFile(htmlContent, filePath);

    expect(mockedWriteFile).toHaveBeenCalledWith(filePath, htmlContent, 'utf8');
  });

  it('should throw an error if writeFile fails', async () => {
    const errorMessage = 'Failed to write file';
    mockedWriteFile.mockRejectedValue(new Error(errorMessage));

    const htmlContent = '<html><body>Error Test</body></html>';
    const filePath = 'errorTest.html';

    await expect(saveHtmlToFile(htmlContent, filePath)).rejects.toThrow(`Error while saving HTML to file: ${errorMessage}`);
  });
});