import { test } from "@playwright/test";
import componentList from "../../resources/componentList.json";
import { expectToMatchScreenshot } from "../helpers/expectToMatchScreenshot";
import { getStoryURL } from "../helpers/getStoryURL";

Object.entries(componentList).forEach(([component, stories]) => {
    stories.forEach((story) => {
        test(`${component} – ${story}`, async ({ page }) => {
            await page.goto(getStoryURL(story));
            await expectToMatchScreenshot(page, component, story);
        });
    });
});
