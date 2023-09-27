import { kind, story, test } from "creevey";

kind("ContactSelect", () => {
    story("ContactTypeIcon", ({ setStoryParameters }) => {
        setStoryParameters({
            captureElement: "null",
        });

        test("moveToElement", async function () {
            // Some icons get by url and loaded with a delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // @ts-ignore matchImage is custom method
            await this.expect(await this.takeScreenshot()).to.matchImage();
        });
    });
});
