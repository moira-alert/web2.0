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

let pendingRequests = 0;

const updateLoadingState = (api: MiddlewareAPI, increment: boolean) => {
    pendingRequests += increment ? 1 : -1;
    if (pendingRequests <= 0) {
        api.dispatch(toggleLoading(false));
        pendingRequests = 0;
    } else {
        api.dispatch(toggleLoading(true));
    }
};

export const rtkQueryErrorAndLoadingHandler: Middleware = (api: MiddlewareAPI) => (next) => (
    action: unknown
) => {
    const typedAction = action as Action;
    if (hasRequiredMeta(typedAction)) {
        if (isPending(typedAction) && !typedAction.meta.arg.originalArgs?.handleLoadingLocally) {
            updateLoadingState(api, true);
        }

        if (
            (isFulfilled(typedAction) || isRejectedWithValue(typedAction)) &&
            !typedAction.meta.arg.originalArgs?.handleLoadingLocally
        ) {
            updateLoadingState(api, false);
        }

        if (
            isRejectedWithValue(typedAction) &&
            !typedAction.meta.arg.originalArgs?.handleErrorLocally
        ) {
            const errorMessage = typedAction.payload;
            api.dispatch(setError(errorMessage));
        }
    }

    return next(action);
};
