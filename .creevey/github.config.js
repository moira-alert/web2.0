const path = require("path");

module.exports = {
    screenDir: path.join(__dirname, "images"),
    reportDir: path.join(__dirname, "report"),
    maxRetries: 2,
    useDocker: false,
    browsers: {
        chrome: {
            browserName: "chrome",
            platformName: "linux",
            viewport: { width: 1024, height: 720 },
            gridUrl: "http://localhost:4444/wd/hub",
        },
    },
};