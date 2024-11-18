import { Dispatch } from "react";
import type { Trigger } from "../Domain/Trigger";
import {
    checkTriggerTarget,
    triggerClientToPayload,
    TriggerTargetProblemType,
} from "../Domain/Trigger";
import {
    Action,
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    setValidationResult,
} from "./useTriggerFormContainerReducer";
import { useSaveTrigger } from "./useSaveTrigger";
import { History } from "history";
import { useValidateTargetMutation } from "../services/TriggerApi";

export const useValidateTarget = (dispatch: Dispatch<Action>, history: History<unknown>) => {
    const saveTrigger = useSaveTrigger(history);
    const [validateTarget] = useValidateTargetMutation();

    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const triggerPayload = triggerClientToPayload(trigger);
        const validationResult = await validateTarget(triggerPayload).unwrap();

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
    };
};
