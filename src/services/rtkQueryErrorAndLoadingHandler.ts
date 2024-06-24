import { isPending, isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { setError, toggleLoading } from "../store/Reducers/UIReducer.slice";
import { CustomBaseQueryArgs } from "./BaseApi";

interface CustomMeta {
    arg: {
        originalArgs: CustomBaseQueryArgs;
    };
}

type Action = {
    meta?: CustomMeta;
};

function hasRequiredMeta(action: Action): action is Action {
    return (
        "meta" in action &&
        action.meta !== undefined &&
        "arg" in action.meta &&
        "originalArgs" in action.meta.arg
    );
}

export const rtkQueryErrorAndLoadingHandler: Middleware = (api: MiddlewareAPI) => (next) => (
    action: unknown
) => {
    const typedAction = action as Action;

    if (
        isPending(typedAction) &&
        hasRequiredMeta(typedAction) &&
        !typedAction.meta.arg.originalArgs.handleLoadingLocally
    ) {
        api.dispatch(toggleLoading(true));
    }

    if (
        (isFulfilled(typedAction) || isRejectedWithValue(typedAction)) &&
        hasRequiredMeta(typedAction) &&
        !typedAction.meta.arg.originalArgs.handleLoadingLocally
    ) {
        api.dispatch(toggleLoading(false));
    }

    if (
        isRejectedWithValue(typedAction) &&
        hasRequiredMeta(typedAction) &&
        !typedAction.meta.arg.originalArgs.handleErrorLocally
    ) {
        const errorMessage = typedAction.payload;
        api.dispatch(setError(errorMessage));
    }

    return next(action);
};
