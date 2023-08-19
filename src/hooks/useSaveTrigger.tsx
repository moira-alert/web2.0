import { Action, ActionType } from "./useTriggerFormContainerReducer";
import { getPageLink } from "../Domain/Global";
import MoiraApi from "../Api/MoiraApi";
import { Dispatch } from "react";
import { History } from "history";
import { Trigger, triggerClientToPayload } from "../Domain/Trigger";

export const useSaveTrigger = (
    moiraApi: MoiraApi,
    dispatch: Dispatch<Action>,
    history: History<unknown>
) => {
    return async (trigger?: Trigger) => {
        if (!trigger) {
            return;
        }

        const payload = triggerClientToPayload(trigger);

        dispatch({ type: ActionType.setIsLoading, payload: true });
        try {
            await moiraApi.setTrigger(trigger.id, payload);
            history.push(getPageLink("trigger", trigger.id));
        } catch (error) {
            dispatch({
                type: ActionType.setError,
                payload: error.message,
            });
        } finally {
            dispatch({ type: ActionType.setIsLoading, payload: false });
        }
    };
};
