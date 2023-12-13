import { test } from "@playwright/test";
import fs from "fs";

const storybookUrl = "http://localhost:9001";

test.describe("Get a list of all stories", () => {
    test("Get a list of all stories", async ({ page }) => {
        await page.goto(storybookUrl);
        const componentList: string[] = [];

        const componentsLocator = page.locator(
            '#storybook-explorer-tree >> //*[@data-nodetype="component"]'
        );
        const components = await componentsLocator.elementHandles();

        for (const componentHandle of components) {
            const componentText = await componentHandle.textContent();

            const isComponentClicked = await componentHandle.evaluate(
                (node) => (node as Element).getAttribute("aria-expanded") === "true"
            );

            if (!isComponentClicked) {
                await componentHandle.click();
            }

            const dataItemId = await componentHandle.getAttribute("data-item-id");

            const stories = page.locator(
                `#storybook-explorer-tree >> //*[@data-nodetype="story" and @data-parent-id="${dataItemId}"]`
            );

            const count = await stories.count();
            for (let i = 0; i < count; i++) {
                const storyItemId = await stories.nth(i).getAttribute("data-item-id");

                if (storyItemId !== null && componentText !== null) {
                    componentList.push(storyItemId);
                }
            }
        }

        const pathForpageList = `resources`;
        !fs.existsSync(pathForpageList) &&
            fs.mkdir(`resources`, (err) => {
                if (err) throw err;
            });
        fs.writeFile(`resources/componentList.json`, JSON.stringify(componentList), function (err) {
            if (err) throw err;
        });
    });
});
