import { Dispatch } from "react";
import type { Trigger } from "../Domain/Trigger";
import {
    checkTriggerTarget,
    triggerClientToPayload,
    TriggerTargetProblemType,
} from "../Domain/Trigger";
import { useSaveTrigger } from "./useSaveTrigger";
import { useValidateTargetMutation } from "../services/TriggerApi";
import {
    setIsSaveButtonDisabled,
    setValidationResult,
    setIsSaveModalVisible,
} from "../store/Reducers/TriggerFormReducer.slice";
import { Action } from "@reduxjs/toolkit";

export const useValidateTarget = (dispatch: Dispatch<Action>) => {
    const saveTrigger = useSaveTrigger();
    const [validateTarget] = useValidateTargetMutation();

    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const triggerPayload = triggerClientToPayload(trigger);

        try {
            const validationResult = await validateTarget(triggerPayload).unwrap();

            const doAnyTargetsHaveError = validationResult.targets?.some((target) =>
                checkTriggerTarget(target, TriggerTargetProblemType.BAD)
            );
            const doAnyTargetsHaveWarning = validationResult.targets?.some((target) =>
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
        } catch {
            return;
        }
    };
};
