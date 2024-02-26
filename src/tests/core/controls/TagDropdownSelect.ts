import { Page } from "puppeteer";

export interface TagDropdownSelect {
    click: () => Promise<void>;
    type: (value: string) => Promise<void>;
    selectTag: (tag: string) => Promise<void>;
    addTag: (tag: string) => Promise<void>;
}

export function getTagDropdownSelect(page: Page, selector: string): TagDropdownSelect {
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
        async selectTag(tag: string) {
            const control = await getControl();
            await control?.click();

            await page.waitForSelector(`[data-tid="Tag ${tag}"]`);
            const tagControl = await page.$(`[data-tid="Tag ${tag}"]`);

            return tagControl?.click();
        },
        async addTag(value: string) {
            const control = await getControl();
            await control?.click();
            await control?.type(value);

            await page.waitForSelector(`[data-tid="New Tag"]`);
            const tagControl = await page.$(`[data-tid="New Tag"]`);

            return tagControl?.click();
        },
    };
}
