import { clearDatabase } from "../../src/tests/core/utils";
import { test as cleanup } from "@playwright/test";

cleanup("Clearing database", async () => {
    await clearDatabase();
});
