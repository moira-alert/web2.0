import { Page, Response } from "puppeteer";
import { delay } from "../core/utils";
import { LOCAL_URL } from "../core/contants";
import { Button, getButton } from "../core/controls/Button";
import { getInput, Input } from "../core/controls/Input";
import { getTagDropdownSelect, TagDropdownSelect } from "../core/controls/TagDropdownSelect";
import { getText } from "../core/controls/Text";

export class AddTriggerPage {
    private page: Page;

    public static url = `${LOCAL_URL}/trigger/new`;
    constructor(page: Page) {
        this.page = page;
    }

    public open(): Promise<Response | null> {
        return this.page.goto(AddTriggerPage.url);
    }

    public async isOpen(): Promise<boolean> {
        if (this.page.url() === AddTriggerPage.url) {
            return true;
        }
        await delay(50);
        return this.page.url() === AddTriggerPage.url;
    }

    public async hasTextInElement(text: string, selector: string): Promise<boolean | undefined> {
        const elementTextContent = await getText(this.page, selector);
        return elementTextContent?.includes(text);
    }

    public get Name(): Input {
        return getInput(this.page, `[data-tid="Name"]`);
    }

    public get TargetT1(): Input {
        return getInput(this.page, `[data-tid="Target T1"]`);
    }

    public get WarnT1(): Input {
        return getInput(this.page, `[data-tid="WARN T1"]`);
    }

    public get ErrorT1(): Input {
        return getInput(this.page, `[data-tid="ERROR T1"]`);
    }

    public get Tags(): TagDropdownSelect {
        return getTagDropdownSelect(this.page, `[data-tid="Tags"]`);
    }

    public get AddTrigger(): Button {
        return getButton(this.page, `[data-tid="Add Trigger"]`);
    }
}
