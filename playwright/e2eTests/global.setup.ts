import { test as setup, expect } from "@playwright/test";

setup("Adding tag", async ({ request }) => {
    const response = await request.post("/api/tag", {
        data: {
            list: ["testTag"],
        },
    });

    expect(response.status()).toBe(200);
});
