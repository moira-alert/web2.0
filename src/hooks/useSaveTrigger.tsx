import { Action, setError, setIsLoading } from "./useTriggerFormContainerReducer";
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
    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const triggerPayload = triggerClientToPayload(trigger);

        dispatch(setIsLoading(true));
        try {
            const action = triggerPayload.id
                // @ts-ignore This branch will only run if triggerPayload has id
                ? () => moiraApi.setTrigger(triggerPayload.id!, triggerPayload)
                : () => moiraApi.addTrigger(triggerPayload);
            const { id } = await action();
            history.push(getPageLink("trigger", id));
        } catch (error) {
            Toast.push(error.message);
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };
};
