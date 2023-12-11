import { test } from "@playwright/test";
import componentList from "../resources/componentList.json";
import { expectToMatchScreenshot } from "./helpers/expectToMatchScreenshot";
import { configureSnapshotPath } from "./helpers/configureSnapshotPath";
import { getStoryURL } from "./helpers/getStoryURL";

for (const [component, stories] of Object.entries(componentList)) {
    test.beforeEach(async ({}, testInfo) => {
        configureSnapshotPath(testInfo);
    });
    test.describe(async () => {
        for (const story of stories) {
            test(`${story}`, async ({ page }) => {
                await page.goto(getStoryURL(story));
                await expectToMatchScreenshot(page, component);
            });
        }
    });
}
