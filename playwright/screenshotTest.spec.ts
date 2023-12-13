import { test } from "@playwright/test";
import componentList from "../resources/componentList.json";
import { expectToMatchScreenshot } from "./helpers/expectToMatchScreenshot";
import { getStoryURL } from "./helpers/getStoryURL";

for (const story of <string[]>componentList) {
    test.describe(async () => {
        test(`${story}`, async ({ page }) => {
            await page.goto(getStoryURL(story));
            await expectToMatchScreenshot(page, story);
        });
    });
}
