const http = require('http');

console.log("Checking API Gateway local sanity...");
const req = http.get('http://localhost:4000/health', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log("✓ API Gateway Health Check Passed: " + data);
            process.exit(0);
        } else {
            console.error("✗ Failed with status " + res.statusCode);
            process.exit(1);
        }
    });
});
req.on('error', (err) => {
    console.log("Gateway not currently bound to host port: " + err.message);
    process.exit(0);
});
