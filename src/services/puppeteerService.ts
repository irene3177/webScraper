import { Page } from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';

let cluster: Cluster | null = null;

/**
 * Initializes the Puppeteer cluster for handling multiple scraping tasks concurrently.
 */
async function initializeCluster() {
  if (!cluster) {
    cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE, // Use Cluster.CONCURRENCY_CONTEXT for lower memory use
      maxConcurrency: 5, // Max number of concurrent tasks
      puppeteerOptions: {
        headless: true, // Run in headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'], // Additional settings for secure environments
      },
    });

    // Define the task to process each URL
    await cluster.task(async ({ page, data: url }: { page: Page; data: string }) => {
      try {
        const response = await page.goto(url, { waitUntil: 'networkidle2' });
        
        if (!response || !response.ok()) {
          throw new Error(`Failed to load page: ${response?.status}`);
        }
  
        const html = await page.content();
        return html;
      } catch (error) {
        throw error;
      }
    });
    
    // Optional: Handle task errors globally
    cluster.on('taskerror', (err: Error, data: string) => {
      console.error(`Error crawling ${data}: ${err.message}`);
    });
  }
}

/**
 * Fetch HTML content for a specified URL using the Puppeteer cluster.
 * 
 * @param url - The URL to scrape.
 * @returns The HTML content fetched from the URL.
 * @throws Error if there was an issue fetching the HTML.
 */
async function fetchHtmlWithPuppeteer(url: string): Promise<string> {
  await initializeCluster(); // Ensure cluster is initialized
  try {
    const html = await (cluster as Cluster).execute(url); // Add URL to the queue and execute
    return html;
  } catch (error: any) {
    throw new Error(`Error fetching HTML: ${error.message}`);
  }
}

async function closeCluster() {
  if (cluster) {
    await cluster.idle();
    await cluster.close();
    cluster = null; // Reset cluster instance
  }
}

process.on('exit', closeCluster);
process.on('SIGINT', closeCluster);
process.on('SIGTERM', closeCluster);

export { fetchHtmlWithPuppeteer };
