import path from "path";
import fs from "fs";

const localAuthPath = path.join(__dirname, "auth.config.json");
const auth = fs.existsSync(localAuthPath)
    ? JSON.parse(fs.readFileSync(localAuthPath))
    : {
        user: "moirakontur1",
        key: process.env["BROWSERSTACK_KEY"],
    };

const config = {
    gridUrl: "http://hub-cloud.browserstack.com/wd/hub",
    storybookUrl: "http://localhost:9001",
    screenDir: path.join(__dirname, "images"),
    reportDir: path.join(__dirname, "report"),
    maxRetries: 2,
    browsers: {
        chrome: {
            browserName: "Chrome",
            viewport: { width: 1024, height: 720 },
            limit: 4,
            'browserstack.user': auth.user,
            'browserstack.key': auth.key,
            "browserstack.local": "true",
            "os" : "Windows",
            "os_version" : "10",
            "browser_version" : "80.0",
            "browserstack.selenium_version" : "3.5.2",
            "browserstack.localIdentifier": process.env["BROWSERSTACK_LOCAL_IDENTIFIER"],
        }
    },
};

export default config;
