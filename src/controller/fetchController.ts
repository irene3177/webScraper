import { Request, Response, NextFunction } from 'express';
import { fetchAndProcessHtml } from '../services/htmlService';
import { createError } from '../utils/errorUtils';
import { URL_REGEX } from '../utils/constants';


/**
 * Validate request parameters.
 * @param targetUrl - The target URL to validate.
 * @param linksLimit - The optional link limit to validate.
 * @throws Error if validation fails.
 */
function validateRequestParameters(targetUrl: string, linksLimit?: number | string): void {
  if (!targetUrl) {
    throw createError('Target URL is required', 400);
  }

  // Check if the URL has a valid protocol
  if (!URL_REGEX.test(targetUrl)) {
    throw createError('Invalid URL: must start with http:// or https://', 400);
  }

  // Check if the URL is valid
  try {
    new URL(targetUrl);
  } catch {
    throw createError('Invalid URL format', 400);
  }

  if (linksLimit !== undefined) {
    const limit = Number(linksLimit);
    if (isNaN(limit) || !Number.isInteger(limit) || limit < 0) {
      throw createError('linksLimit must be a non-negative integer', 400);
    }
  }
}

/**
 * Fetches HTML content from a URL and extracts links.
 * @param req - The request object containing the URL.
 * @param res - The response object used to send back the results.
 * @param next - The next middleware function in the stack for error handling.
 */
const fetchUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { targetUrl, linksLimit } = req.body as { targetUrl: string, linksLimit?: number | string};

  try {
    // Validate incoming request parameters
    validateRequestParameters(targetUrl, linksLimit);

    // Process the fetching and extracting links
    const { links, htmlFilePath } = await fetchAndProcessHtml(targetUrl, Number(linksLimit));

    res.status(200).json({
      links,
      htmlFilePath,
    });

  } catch (error) {
      return next(error); // Forward unexpected errors to the error handler
    }
};

export default {
  fetchUrl,
};