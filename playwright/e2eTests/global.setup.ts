import { test as setup, expect } from "@playwright/test";

setup("Adding tag", async ({ request, context }) => {
    if (!process.argv.includes("--skip-setup")) {
        const response = await request.post("/api/tag", {
            data: {
                list: ["testTag"],
            },
        });

        expect(response.status()).toBe(200);

        await context.storageState({ path: "storageState.json" });
    }
});
