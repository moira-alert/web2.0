// @ts-nocheck
import { kind, story, test } from "creevey";

const moveToElement = async () => {
    test("moveToElement", async function () {
        const moveToElement = async (selector: string) => {
            const element = await this.browser.findElement({
                css: selector,
            });
            await this.browser.actions({ bridge: true }).move({ origin: element }).perform();
        };

        const simple = await this.browser.takeScreenshot();

        await moveToElement('a[data-tid="TriggerListItem_header"]');
        const headerHovered = await this.browser.takeScreenshot();

        await moveToElement('button[data-tid^="tag_"]');
        const tagHovered = await this.browser.takeScreenshot();

        await moveToElement('div[data-tid="TriggerListItem_status"]');
        const statusHovered = await this.browser.takeScreenshot();
        await this.browser.actions().click().perform();
        const statusClicked = await this.browser.takeScreenshot();

        await this.browser.sleep(1000);
        await this.expect({
            simple,
            statusHovered,
            statusClicked,
            headerHovered,
            tagHovered,
        }).to.matchImages();
    });
};

kind("TriggerListItem", () => {
    const storiesToTest = [
        "Default",
        "Long trigger name",
        "Large counters",
        "Few states",
        "No metrics",
        "Lot targets",
        "One long target name",
        "Short tags",
        "Long tags",
        "Lot tags",
        "Throttling flag",
        "Lot of all data",
        "Exception state",
    ];
    return storiesToTest.map((storyName) => {
        return story(`${storyName}`, () => {
            moveToElement();
        });
    });
});
