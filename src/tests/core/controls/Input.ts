import { Page } from "puppeteer";

export interface Input {
    click: () => Promise<void>;
    type: (value: string) => Promise<void>;
}

export function getInput(page: Page, selector: string): Input {
    const getControl = async () => {
        await page.waitForSelector(selector);
        return page.$(selector);
    };

    return {
        click() {
            return getControl().then((control) => control?.click());
        },
        type(value: string) {
            return getControl().then((control) => control?.type(value));
        },
    };
}
