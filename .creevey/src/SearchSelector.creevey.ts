import { kind, story, test } from "creevey";

kind("SearchSelector", () => {
    story("default", () => {
        test("clickTest", async function () {
            const simple = await this.takeScreenshot();

            const selector = this.browser.findElement({ css: "#selector" });
            await this.browser.actions().move({ origin: selector }).perform();
            await this.browser.actions().click().perform();
            const clicked = await this.takeScreenshot();

            await this.expect({ simple, clicked }).to.matchImages();
        });
    });
});
