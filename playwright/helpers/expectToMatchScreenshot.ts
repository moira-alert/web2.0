import { expect, Page, TestInfo } from "@playwright/test";

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
