import { Page, Response } from "puppeteer";
import { delay } from "../core/utils";
import { Button, getButton } from "../core/controls/Button";
import { LOCAL_URL } from "../core/contants";

export class MainPage {
    private page: Page;

    public static url = `${LOCAL_URL}/`;
    constructor(page: Page) {
        this.page = page;
    }

    public open(): Promise<Response | null> {
        return this.page.goto(LOCAL_URL);
    }

    public async isOpen(): Promise<boolean> {
        if (this.page.url() === MainPage.url) {
            return true;
        }
        await delay(1000);
        return this.page.url() === MainPage.url;
    }

    public get AddTrigger(): Button {
        return getButton(this.page, `[data-tid="Add Trigger"]`);
    }
}
