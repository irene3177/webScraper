import { Request, Response, NextFunction } from 'express';
import { fetchAndProcessHtml } from '../services/htmlService';
import { createError } from '../utils/errorUtils';
import { URL_REGEX } from '../utils/constants';

/**
 * Fetches HTML content from a URL and extracts links.
 * @param req - The request object containing the URL.
 * @param res - The response object used to send back the results.
 * @param next - The next middleware function in the stack for error handling.
 */
const fetchUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { targetUrl } = req.body as { targetUrl: string };

    if(!targetUrl) {
      return next(createError('Target URL is required', 400));
    }

     // Check if the URL has a valid protocol
     if (!URL_REGEX.test(targetUrl)) {
      return next(createError('Invalid URL: must start with http:// or https://', 400));
    }

    // Check if the URL is valid
    try{ 
      new URL(targetUrl);
    } catch {
      return next(createError('Invalid URL format', 400));
    }

    // Process the fetching and extracting links
    const { links, htmlFilePath } = await fetchAndProcessHtml(targetUrl);

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