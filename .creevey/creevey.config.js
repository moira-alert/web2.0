const path = require("path");
const { hybridStoriesProvider } = require("creevey");

module.exports = {
    storiesProvider: hybridStoriesProvider,
    testsRegex: /.creevey.(t|j)s$/,
    testsDir: path.join(__dirname, "src"),
    useDocker: true,
    storybookUrl: "http://localhost:9001",
    storybookDir: path.join(__dirname, "../.storybook"),
    screenDir: path.join(__dirname, "images"),
    reportDir: path.join(__dirname, "report"),
    maxRetries: 2,
    browsers: {
        chrome: {
            browserName: "chrome",
            platformName: "linux",
            viewport: { width: 1280, height: 720 },
        },
        firefox: {
            browserName: "firefox",
            platformName: "linux",
            viewport: { width: 1280, height: 720 },
        },
    },
};
