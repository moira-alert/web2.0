import { TestInfo } from "@playwright/test";

export const configureSnapshotPath = (testInfo: TestInfo): any => {
    const originalSnapshotPath = testInfo.snapshotPath;

    testInfo.snapshotPath = (snapshotName) => {
        const result = originalSnapshotPath
            .apply(testInfo, [snapshotName])
            .replace("-1-chromium", "")
            .replace("-linux", "")
            .replace("-darwin", "");

        return result;
    };
};
