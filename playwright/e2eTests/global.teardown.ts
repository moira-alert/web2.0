import { test as cleanup, expect } from "@playwright/test";

cleanup("Deleting tag", async ({ request }) => {
    const response = await request.delete("/api/tag", {
        data: {
            list: ["testTag"],
        },
    });

    expect(response.status()).toBe(200);
});
