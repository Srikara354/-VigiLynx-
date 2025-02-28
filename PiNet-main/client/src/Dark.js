const express = require('express');
const app = express();

app.get('/api/dark-web-scan', async (req, res) => {
  const { input } = req.query;
  const normalizedInput = input.replace(/^(https?:\/\/|www\.)/i, '').toLowerCase();

  if (normalizedInput.endsWith('.onion')) {
    return res.json({
      isDarkWeb: true,
      analysis: {
        status: 'Detected',
        message: 'This is a .onion domain, indicating a Tor hidden service.',
        confidence: 0.98,
        details: { input, type: 'Tor Hidden Service', accessMethod: 'Tor network' }
      }
    });
  }

  // Add real dark web checks here (e.g., API calls to threat intelligence services)
  res.json({
    isDarkWeb: false,
    analysis: {
      status: 'Not Detected',
      message: 'No dark web association found.',
      confidence: 0.90,
      details: { input, result: 'Surface web resource' }
    }
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));