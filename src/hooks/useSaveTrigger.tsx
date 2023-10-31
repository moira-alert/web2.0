import { Action, setError, setIsLoading } from "./useTriggerFormContainerReducer";
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
    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const triggerPayload = triggerClientToPayload(trigger);

        dispatch(setIsLoading(true));
        try {
            const triggerID = triggerPayload.id;
            const action = triggerID
                ? () => moiraApi.setTrigger(triggerID, triggerPayload)
                : () => moiraApi.addTrigger(triggerPayload);
            const { id } = await action();
            history.push(getPageLink("trigger", id));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };
};
