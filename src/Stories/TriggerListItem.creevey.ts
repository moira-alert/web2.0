import { kind, story, test } from "creevey";

kind("TriggerListItem", () => {
    story("TriggerListItem", ({ setStoryParameters }) => {
        setStoryParameters({
            captureElement: "null",
        });

        test("moveToElement", async function () {
            const moveToElement = async (selector: string) => {
                const element = this.browser.findElement({
                    css: selector,
                });
                await this.browser.actions().move({ origin: element }).perform();
            };

            const simple = await this.takeScreenshot();

            await moveToElement('a[data-tid="TriggerListItem_header"]');
            const headerHovered = await this.takeScreenshot();

            await moveToElement('button[data-tid^="tag_"]');
            const tagHovered = await this.takeScreenshot();

            await moveToElement('div[data-tid="TriggerListItem_status"]');
            const statusHovered = await this.takeScreenshot();
            await this.browser.actions().click().perform();
            const statusClicked = await this.takeScreenshot();

            await this.expect({
                simple,
                statusHovered,
                statusClicked,
                headerHovered,
                tagHovered,
            }).to.matchImages();
        });
    });
});
