import { Page, Response } from "puppeteer";
import { delay } from "../core/utils";
import { LOCAL_URL } from "../core/contants";
import { getText } from "../core/controls/Text";

export class TriggerViewPage {
    public static url = `${LOCAL_URL}/trigger`;
    private page: Page;
    private id?: string;

    constructor(page: Page, id?: string) {
        this.page = page;
        this.id = id;
    }

    private checkUrl = (url: string): boolean => {
        if (this.id) {
            return url === `${TriggerViewPage.url}/${this.id}`;
        }
        const isGuid = (value: string): boolean => {
            return value.length === 36;
        };

        return (
            url.startsWith(TriggerViewPage.url) && isGuid(url.slice(TriggerViewPage.url.length + 1))
        );
    };

    public open(): Promise<Response | null> {
        if (!this.id) {
            throw new Error("For call open TriggerView page should have id");
        }
        return this.page.goto(`${TriggerViewPage.url}/${this.id}`);
    }

    public async isOpen(): Promise<boolean> {
        if (this.checkUrl(this.page.url())) {
            return true;
        }
        await delay(100);
        return this.checkUrl(this.page.url());
    }

    public get Name(): Promise<string | null> {
        return getText(this.page, `[data-tid="Name"]`);
    }
}
