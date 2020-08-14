let isE2eTests = process.env["TYPE"] === "e2e";
// When running on code editor
const testPathIndex = process.argv.findIndex((arg) => arg === "--runTestsByPath");
if (testPathIndex !== -1) {
    const testPath = process.argv[testPathIndex + 1];
    isE2eTests = testPath.includes("/src/tests");
}

module.exports = {
    // NOTE: ignore e2e tests when running jest with common config
    modulePathIgnorePatterns: isE2eTests ? [] : ["/src/tests"],
    preset: isE2eTests ? "jest-puppeteer" : undefined,
};
