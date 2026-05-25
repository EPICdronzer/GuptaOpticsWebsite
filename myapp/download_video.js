const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://assets.mixkit.co/videos/preview/mixkit-optician-testing-a-customer-s-eyesight-41617-large.mp4';
const outputPath = path.join(__dirname, 'public', 'optician-test.mp4');

console.log('Downloading video from:', url);
console.log('Output path:', outputPath);

const file = fs.createWriteStream(outputPath);

const request = https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
}, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to get video, status code: ${response.statusCode}`);
    response.resume();
    process.exit(1);
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('Download completed successfully!');
    process.exit(0);
  });
});

request.on('error', (err) => {
  console.error('Request error:', err);
  fs.unlink(outputPath, () => {});
  process.exit(1);
});
