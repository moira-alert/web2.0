import { test } from "@playwright/test";
import componentList from "../../resources/componentList.json";
import { expectToMatchScreenshot } from "../helpers/expectToMatchScreenshot";
import { getStoryURL } from "../helpers/getStoryURL";

const themes: ("Light" | "Dark")[] = ["Light", "Dark"];

test.describe("Screenshot tests for Light and Dark themes", () => {
    for (const [component, stories] of Object.entries(componentList)) {
        for (const story of stories) {
            for (const theme of themes) {
                if (theme === "Dark" && story.skipDark) continue;

                test(`${component} – ${story.storyId} – ${theme}`, async ({ page }) => {
                    const url = getStoryURL(story.storyId, theme);
                    await page.goto(url);

                    await expectToMatchScreenshot(page, component, story.storyId, theme);
                });
            }
        }
    }
});
