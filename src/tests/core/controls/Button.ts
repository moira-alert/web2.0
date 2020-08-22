import { Page } from "puppeteer";

export interface Button {
    click: () => Promise<void>;
}

export function getButton(page: Page, selector: string): Button {
    const getControl = async () => {
        await page.waitForSelector(selector);
        return page.$(selector);
    };

    return {
        click() {
            return getControl().then((control) => control?.click());
        },
    };
}
