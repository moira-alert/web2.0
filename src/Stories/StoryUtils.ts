import { action } from "@storybook/addon-actions";
import delay from "../helpers/PromiseUtils";

export default function actionWithDelay(
    name: string,
    timeout: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: unknown[]) => Promise<any> {
    return async (...args: unknown[]) => {
        action(name)(...args);
        await delay(timeout);
    };
}
