import { expect, Page } from "@playwright/test";

export async function expectToMatchScreenshot(page: Page, component: string, story: string) {
    if (story.toLocaleLowerCase().includes("modal")) {
        await expect(page.locator('//*[@data-tid="modal-content"]')).toHaveScreenshot([
            component,
            `${story}.png`,
        ]);
    } else {
        const element = page.locator("#root");
        await expect(element).toHaveScreenshot([component, `${story}.png`]);
    }
}
