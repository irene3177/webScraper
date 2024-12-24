const e = require('express');
const htmlService = require('../services/htmlService');

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

exports.fetchUrl = async (req, res, next) => {
  try {
    const { targetUrl } = req.body;

    if(!targetUrl) {
      return next(createError('Target URL is required', 400));
    }

    try{ 
      new URL(targetUrl);
    } catch {
      return next(createError('Invalid URL', 400));
    }

    const { links, htmlFilePath } = await htmlService.fetchAndProcessHtml(targetUrl);

    res.status(200).json({
      links,
      htmlFilePath,
    });

  } catch (error) {
      return next(error);
    }
};