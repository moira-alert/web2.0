// @flow
import { action } from "@storybook/addon-actions";
import { delay } from "../Helpers/PromiseUtils";

export function actionWithDelay(name: string, timeout: number): (...args: mixed[]) => Promise<void> {
    return async (...args: mixed[]) => {
        action(name)(...args);
        await delay(timeout);
    };
}
