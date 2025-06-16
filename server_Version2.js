const express = require('express');
const https = require('https');
const app = express();

const API_KEY = 'AIzaSyC0mTj1ZjKXVXadWXMg3i26kzDpqJ80du8'; // Your Google API key

app.get('/stream/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const range = req.headers.range || '';
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`;

  const options = {
    headers: {
      Range: range
    }
  };

  https.get(url, options, (driveRes) => {
    if (driveRes.statusCode !== 200 && driveRes.statusCode !== 206) {
      res.status(driveRes.statusCode).send('Failed to fetch file from Google Drive.');
      return;
    }
    // Forward headers
    Object.entries(driveRes.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.status(driveRes.statusCode);
    driveRes.pipe(res);
  }).on('error', (err) => {
    res.status(500).send('Error connecting to Google Drive: ' + err.message);
  });
});

app.listen(3000, () => {
  console.log('GD Proxy Server running on http://localhost:3000');
});