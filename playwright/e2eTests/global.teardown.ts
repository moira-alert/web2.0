import { clearDatabase } from "../../src/tests/core/utils";
import { test as cleanup } from "@playwright/test";

cleanup("Adding tag", async () => {
    if (!process.env.SKIP_SETUP) {
        await clearDatabase();
    }
});
