import { expect, Page } from "@playwright/test";

export async function expectToMatchScreenshot(page: Page, component: string) {
    if (component.toLocaleLowerCase().includes("modal")) {
        await expect(page.locator('//*[@data-tid="modal-content"]')).toHaveScreenshot();
    } else {
        const element = page.locator("#root");
        await expect(element).toHaveScreenshot();
    }
}
