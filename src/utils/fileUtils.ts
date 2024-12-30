import fs from 'fs/promises';

// Saves HTML content to a specified file asynchronously.
export async function saveHtmlToFile(html: string, file: string): Promise<void> {
  try {
    await fs.writeFile(file, html, 'utf8');
  } catch (error: any) {
    throw new Error('Error while saving HTML to file: ' + error.message);
  }
}
