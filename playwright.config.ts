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
    workers: 1,
    reporter: process.env.CI ? "github" : [["list"], ["html", { open: "on-failure" }]],
    use: {
        baseURL: "http://localhost:9000",
        actionTimeout: 0,
        trace: "on-first-retry",
    },

    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
            },
        },
    ],
};

export default config;
