import { chromium, test as setup, expect } from "@playwright/test";
import { clearDatabase } from "../../src/tests/core/utils";

setup("Adding tag", async ({ request }) => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await clearDatabase();

    const response = await request.post("/api/tag", {
        data: {
            list: ["testTag"],
        },
    });

    expect(response.status()).toBe(200);

    await page.context().storageState({ path: "storageState.json" });
    await browser.close();
});
