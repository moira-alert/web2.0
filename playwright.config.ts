import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
    testDir: "./playwright",
    snapshotDir: "./playwright/snapshots",
    snapshotPathTemplate: "{snapshotDir}/{arg}{ext}",
    timeout: 30 * 1000,
    expect: {
        timeout: 5000,
    },

    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? "github" : [["list"], ["html", { open: "on-failure" }]],
    use: {
        baseURL: "http://localhost:9000",
        actionTimeout: 0,
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium-all",
            testIgnore: [
                "notificationsOperations.spec.ts",
                "getAllStories.spec.ts",
                "screenshotTest.spec.ts",
            ],
            use: {
                ...devices["Desktop Chrome"],
            },
        },
        {
            name: "chromium-notifications",
            testMatch: "notificationsOperations.spec.ts",
            use: {
                ...devices["Desktop Chrome"],
            },
            dependencies: ["chromium-all"],
        },
    ],
};

export default config;
