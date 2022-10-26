const path = require('path');

module.exports = {
    useDocker: true,
    storybookUrl: "http://localhost:9001",
    screenDir: path.join(__dirname, "images"),
    reportDir: path.join(__dirname, "report"),
    maxRetries: 2,
    browsers: {
        chrome: {
            browserName: "chrome",
            viewport: { width: 1024, height: 720 },
        }
    },
};
