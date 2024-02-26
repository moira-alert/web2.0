import { Page } from "puppeteer";

export async function getText(page: Page, selector: string): Promise<string | null> {
    try {
        await page.waitForSelector(selector);
        return page.$eval(selector, (el) => el.textContent);
    } catch (error) {
        return null;
    }
}
