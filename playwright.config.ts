import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
    testDir: "./playwright",
    snapshotDir: "./playwright/snapshots",
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
        actionTimeout: 0,
        trace: "on-first-retry",
        headless: !!process.env.CI,
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
