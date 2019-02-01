// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import { action } from "@storybook/addon-actions";
import delay from "../Helpers/PromiseUtils";

export default function actionWithDelay(
    name: string,
    timeout: number
): (...args: mixed[]) => Promise<void> {
    return async (...args: mixed[]) => {
        action(name)(...args);
        await delay(timeout);
    };
}
