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

// macrolevel error and loading handler, any request not containing {handleLoadingLocally, handleErrorLocally} these props will change this state, see ContactEditModal for example
const shouldHandleLoadingGlobally = (action: Action) =>
    hasRequiredMeta(action) && !action.meta!.arg.originalArgs?.handleLoadingLocally;

const shouldHandleErrorGlobally = (action: Action) =>
    hasRequiredMeta(action) && !action.meta!.arg.originalArgs?.handleErrorLocally;

export const rtkQueryErrorAndLoadingHandler: Middleware = (api: MiddlewareAPI) => (next) => (
    action: unknown
) => {
    const typedAction = action as Action;

    const isActionPending = isPending(typedAction);
    const isActionFulfilledOrRejected =
        isFulfilled(typedAction) || isRejectedWithValue(typedAction);
    const isActionRejectedWithError = isRejectedWithValue(typedAction);

    if (shouldHandleLoadingGlobally(typedAction)) {
        if (isActionPending) {
            updateLoadingState(api, true);
        }

        if (isActionFulfilledOrRejected) {
            updateLoadingState(api, false);
        }
    }

    if (shouldHandleErrorGlobally(typedAction) && isActionRejectedWithError) {
        const errorMessage = typedAction.payload;
        api.dispatch(setError(errorMessage));
    }

    return next(action);
};
