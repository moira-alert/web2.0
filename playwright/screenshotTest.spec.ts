import { test, expect, Page, TestInfo } from "@playwright/test";
import componentList from "../resources/componentList.json";

const storybookUrl = "http://localhost:9001";

const iFrameUrl = "/iframe.html?id=";

for (const [component, stories] of Object.entries(componentList)) {
    test.describe(`Screenshot tests for component: ${component}`, async () => {
        for (const story of stories) {
            test(`Screenshot test for story: ${story.split("--")[1]}`, async ({
                page,
            }, testInfo) => {
                await page.goto(storybookUrl + iFrameUrl + story, { waitUntil: "networkidle" });
                await expectToMatchScreenshot(page, testInfo, component);
            });
        }
    });
}

export async function expectToMatchScreenshot(page: Page, testInfo: TestInfo, component: string) {
    if (testInfo.retry > 0 || testInfo.config.updateSnapshots === "all") {
        await page.waitForTimeout(1000);
    }

    if (component.toLocaleLowerCase().includes("modal")) {
        await expect(page.locator('//*[@data-tid="modal-content"]')).toHaveScreenshot();
    } else {
        const element = page.locator("#root");
        await expect(element).toHaveScreenshot();
    }
}
