import { expect, Page } from "@playwright/test";

export async function expectToMatchScreenshot(
    page: Page,
    component: string,
    story: string,
    theme: string
) {
    const themeSuffix = `--${theme.replace(/\s+/g, "_")}`;
    const fileName = `${story}${themeSuffix}.png`;

    if (component.toLowerCase().includes("modal")) {
        await expect(page.locator('//*[@data-tid="modal-content"]')).toHaveScreenshot([
            component,
            fileName,
        ]);
    } else {
        const element = page.locator("#storybook-root");
        await expect(element).toHaveScreenshot([component, fileName]);
    }
}
