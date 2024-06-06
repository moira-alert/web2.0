import { Dispatch } from "react";
import MoiraApi from "../Api/MoiraApi";
import type { Trigger } from "../Domain/Trigger";
import {
    checkTriggerTarget,
    triggerClientToPayload,
    TriggerTargetProblemType,
} from "../Domain/Trigger";
import {
    Action,
    setError,
    setIsLoading,
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    setValidationResult,
} from "./useTriggerFormContainerReducer";
import { useSaveTrigger } from "./useSaveTrigger";
import { History } from "history";

export const useValidateTarget = (
    moiraApi: MoiraApi,
    dispatch: Dispatch<Action>,
    history: History<unknown>
) => {
    const saveTrigger = useSaveTrigger(moiraApi, dispatch, history);

    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        dispatch(setIsLoading(true));
        try {
            const triggerPayload = triggerClientToPayload(trigger);
            const validationResult = await moiraApi.validateTarget(triggerPayload);

            const doAnyTargetsHaveError = validationResult.targets.some((target) =>
                checkTriggerTarget(target, TriggerTargetProblemType.BAD)
            );
            const doAnyTargetsHaveWarning = validationResult.targets.some((target) =>
                checkTriggerTarget(target, TriggerTargetProblemType.WARN)
            );

            if (doAnyTargetsHaveError || doAnyTargetsHaveWarning) {
                dispatch(setValidationResult(validationResult));
            }

            if (doAnyTargetsHaveError) {
                dispatch(setIsSaveButtonDisabled(true));
                return;
            }

            if (doAnyTargetsHaveWarning) {
                dispatch(setIsSaveModalVisible(true));
                return;
            }

            await saveTrigger(triggerPayload);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };
};
