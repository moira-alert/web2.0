const path = require("path");

module.exports = {
    launch: {
        headless: process.env.HEADLESS !== "false",
    },
    browser: "chromium",
    server: [
        {
            command: `docker-compose -f ${path.join(
                __dirname,
                "src/tests/core/api/docker-compose.yml"
            )} up`,
            port: 8080,
            launchTimeout: 120000,
        },
        {
            command: "yarn start-with-local-api",
            port: 9000,
            launchTimeout: 60000,
        },
    ],
};
