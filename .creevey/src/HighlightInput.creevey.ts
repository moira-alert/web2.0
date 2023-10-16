import { kind, story, test } from "creevey";

const waitForAnimation = async () =>
    test("animation", async function () {
        const simple = await this.takeScreenshot();

        await this.browser.sleep(1000);
        await this.expect({ simple }).to.matchImages();
    });

kind("HighlightInput", () => {
    const storiesToTest = ["With syntax fail", "Highlight errors"];
    return storiesToTest.map((storyName) => {
        return story(`${storyName}`, () => {
            waitForAnimation();
        });
    });
});
