const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.API_KEY || 'your_secure_api_key';

const data = JSON.stringify({
    longUrl: 'https://example.com',
    expiryDays: 30
});

const req = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/shorten',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'api-key': apiKey
    }
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        console.log('BODY:', body);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
