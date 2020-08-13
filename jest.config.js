// TODO that flag don't means e2e tests
let isIntegrationTests = process.argv.includes("--runInBand");
// run on WebStorm
const testPathIndex = process.argv.findIndex(arg => arg === "--runTestsByPath");
if (testPathIndex !== -1) {
    const testPath = process.argv[testPathIndex + 1];
    isIntegrationTests = testPath.includes("/src/tests");
}

module.exports = {
    // NOTE: ignore integration tests when run jest with common config
    modulePathIgnorePatterns: isIntegrationTests ? [] : ["/src/tests"],
    preset: isIntegrationTests ? "jest-puppeteer" : undefined,
};
