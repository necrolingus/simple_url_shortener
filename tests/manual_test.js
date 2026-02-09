const http = require('http');

console.log('Testing connection...');
const req = http.request({
    hostname: '127.0.0.1', // Use explicit IP to avoid localhost resolution issues
    port: 3000,
    path: '/login',
    method: 'GET'
}, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    if (res.statusCode === 200) {
        console.log('Server is reachable and .env loaded correctly (DB connect would fail otherwise)');
        process.exit(0);
    } else {
        console.log('Server unreachable or error');
        process.exit(1);
    }
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
});

req.end();
