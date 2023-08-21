import { Action, ActionType } from "./useTriggerFormContainerReducer";
import { getPageLink } from "../Domain/Global";
import MoiraApi from "../Api/MoiraApi";
import { Dispatch } from "react";
import { History } from "history";
import { Trigger, triggerClientToPayload } from "../Domain/Trigger";
import { Toast } from "@skbkontur/react-ui";

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
            const action = payload.id
                ? () => moiraApi.setTrigger(payload.id, payload)
                : () => moiraApi.addTrigger(payload);
            const { id } = await action();
            history.push(getPageLink("trigger", id));
        } catch (error) {
            Toast.push(error.message);
            dispatch({
                type: ActionType.setError,
                payload: error.message,
            });
        } finally {
            dispatch({ type: ActionType.setIsLoading, payload: false });
        }
    };
};
