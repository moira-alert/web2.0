// @ts-nocheck
import { kind, story, test } from "creevey";

kind("ContactSelect", () => {
    story("ContactTypeIcon", ({ setStoryParameters }) => {
        setStoryParameters({
            captureElement: "null",
        });

        test("moveToElement", async function () {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await this.expect(await this.takeScreenshot()).to.matchImage();
        });
    });
});
