import { Page, Response } from "puppeteer";
import { delay } from "../core/utils";
import { LOCAL_URL } from "../core/contants";
import { Button, getButton } from "../core/controls/Button";
import { getInput, Input } from "../core/controls/Input";
import { getTagDropdownSelect, TagDropdownSelect } from "../core/controls/TagDropdownSelect";

export class EditTriggerPage {
    public static url = `${LOCAL_URL}/trigger`;
    private page: Page;
    private id?: string;

    constructor(page: Page, id?: string) {
        this.page = page;
        this.id = id;
    }

    private checkUrl = (url: string): boolean => {
        if (this.id) {
            return url === `${EditTriggerPage.url}/${this.id}/edit`;
        }
        const isGuid = (value: string): boolean => {
            return value.length === 36;
        };

        return (
            url.startsWith(EditTriggerPage.url) && isGuid(url.slice(EditTriggerPage.url.length + 1))
        );
    };

    public open(): Promise<Response | null> {
        if (!this.id) {
            throw new Error("For call open EditTrigger page should have id");
        }
        return this.page.goto(`${EditTriggerPage.url}/${this.id}/edit`);
    }

    public async isOpen(): Promise<boolean> {
        if (this.checkUrl(this.page.url())) {
            return true;
        }
        await delay(1000);
        return this.checkUrl(this.page.url());
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

    public get SaveTrigger(): Button {
        return getButton(this.page, `[data-tid="Save Trigger"]`);
    }
}
