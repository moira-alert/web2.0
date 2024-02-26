import { test as cleanup, expect } from "@playwright/test";

cleanup("Adding tag", async ({ request }) => {
    const response = await request.post("/api/tag", {
        data: {
            list: ["testTag"],
        },
    });

    expect(response.status()).toBe(200);
});
