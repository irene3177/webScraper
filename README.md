# Web Scraping Application

## How It Works

1. **HTML Fetching**: The application fetches the HTML content from the provided URL using Axios.
2. **Dynamic Content Detection**: The dynamic content detection system analyzes HTML to identify indicators of dynamic behavior through script and element inspection using Cheerio, ensuring precise identification of asynchronous operations and loading components.
3. **Re-fetching with Puppeteer**: If the content is detected as dynamic, the system utilizes puppeteer-cluster to efficiently retrieve fully rendered HTML by concurrently executing multiple page load tasks, seamlessly managing resources and handling potential errors through a clustered browser automation approach.
4. **Link Extraction**: The system utilizes Cheerio to parse HTML and extract links, optionally limiting their number, while subsequently filtering these links to ensure they match the domain specified by the target URL, ensuring valid and relevant link gathering.
5. **Error Handling**: Any errors during fetching or processing are captured and returned in a structured format.
6. **Request and Error logging**: The application utilizes Winston to log requests and errors to files for monitoring and debugging purposes.

## Endpoints

### POST /scrape
Scrapes the specified URL and returns the extracted links.

#### Request Format:
```json
{
  "targetUrl": "http://example.com",
  "linksLimit": 2 // Optional: Limits the number of links extracted
}
```
#### Response Format:
```json
{
  "links": ["http://example.com/link-1", "http://example.com/link-2"],
  "htmlFilePath": "path/to/saved/file.html"
}
```

### Dynamic Content Detection

The dynamic content detection mechanism in this project involves analyzing HTML documents to identify indicators of dynamic content. This is crucial for applications that need to act differently based on static versus dynamic pages. The detection is performed in two main steps:

### Script Analysis

The HTML content is parsed to extract <script> tags using the Cheerio library, a jQuery-like tool for server-side manipulation of HTML.
Each script's content is inspected for common indicators of dynamic behavior, such as JavaScript functions and methods that typically handle asynchronous operations:
fetch: Used in scripts to make network requests.
XMLHttpRequest: An older method for making HTTP requests in JavaScript, still commonly found in many applications.
URLs Matching a Pattern: Using a defined URL pattern (URL_PATTERN), scripts are checked for inline URLs that might be indicative of dynamic data fetching operations.

### Dynamic Element Detection

Beyond scripts, the HTML is scanned for various HTML elements and attributes that typically indicate dynamic content:
Classes or attributes commonly associated with loading indicators (e.g., .loading, .loading-indicator, .spinner).
Attributes suggestive of asynchronous actions (e.g., [data-load], [data-fetch]).
The presence of such elements suggests that the page content may change dynamically after the initial load.
The function hasDynamicContent(html: string): Promise<boolean> orchestrates these checks. It returns true if any dynamic indicators are detected, providing a simple yet effective way to identify dynamic content in HTML pages.

This approach ensures that any dynamic content, whether originating from scripts or specialized HTML elements, is comprehensively detected. Such detection is especially useful when determining the need for more complex rendering techniques or tracing data dependencies in web scraping or automation tasks.