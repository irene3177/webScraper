const htmlService = require('../services/htmlService');

exports.fetchUrl = async (req, res) => {
  const { targetUrl } = req.body;

  if(!targetUrl) {
    return res.status(400).json({ error: 'Target URL is required' });
  }

  try {
    const { links, htmlFilePath } = await htmlService.fetchAndProcessHtml(targetUrl);

    res.status(200).json({
      links,
      htmlFilePath,
    });

  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the URL' });
  }
};