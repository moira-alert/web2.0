const path = require("path");

module.exports = {
    screenDir: path.join(__dirname, "images"),
    reportDir: path.join(__dirname, "report"),
    storybookUrl: "http://localhost:9001",
    maxRetries: 2,
    useDocker: true,
    browsers: {
        chrome: {
            browserName: "chrome",
            platformName: "linux",
            viewport: { width: 1024, height: 720 },
        },
    },
};