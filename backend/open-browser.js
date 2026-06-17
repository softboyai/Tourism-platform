// Wait for server to start, then open browser
setTimeout(() => {
    const { exec } = require('child_process');
    exec('start http://localhost:5000');
}, 3000);
