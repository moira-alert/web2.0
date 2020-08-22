import { Page, Response } from "puppeteer";
import { Button, getButton } from "../core/controls/Button";
import { LOCAL_URL } from "../core/contants";

export class MainPage {
    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public open(): Promise<Response | null> {
        return this.page.goto(LOCAL_URL);
    }

    public get AddTrigger(): Button {
        return getButton(this.page, `[data-tid="Add Trigger"]`);
    }
}
