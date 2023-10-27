// @ts-nocheck
import { kind, story, test } from "creevey";

const waitForAnimation = async () =>
    test("animation", async function () {
        await this.browser.sleep(1000);
        await this.expect(await this.takeScreenshot()).to.matchImage("simple");
    });

kind("HighlightInput", () => {
    const storiesToTest = ["With syntax fail", "Highlight errors"];
    return storiesToTest.map((storyName) => {
        return story(`${storyName}`, () => {
            waitForAnimation();
        });
    });
});
