import { Dispatch, RefObject } from "react";
import MoiraApi from "../Api/MoiraApi";
import type { Trigger } from "../Domain/Trigger";
import {
    checkTriggerTargetsForErrors,
    checkTriggerTargetsForWarnings,
    triggerClientToPayload,
} from "../Domain/Trigger";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Toast } from "@skbkontur/react-ui";
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

export const useValidateTrigger = (
    moiraApi: MoiraApi,
    dispatch: Dispatch<Action>,
    validator: RefObject<ValidationContainer>,
    history: History<unknown>
) => {
    const saveTrigger = useSaveTrigger(moiraApi, dispatch, history);

    return async (trigger?: Trigger | Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        const isFormValid = await validator.current?.validate();
        if (!isFormValid) {
            return;
        }

        dispatch(setIsLoading(true));
        try {
            const triggerPayload = triggerClientToPayload(trigger);
            const validationResult = await moiraApi.validateTrigger(triggerPayload);

            const doAnyTargetsHaveError = checkTriggerTargetsForErrors(validationResult);
            const doAnyTargetsHaveWarning = checkTriggerTargetsForWarnings(validationResult);

            if (doAnyTargetsHaveError || doAnyTargetsHaveWarning) {
                dispatch(setValidationResult(validationResult));
            }

            if (doAnyTargetsHaveError) {
                dispatch(setIsSaveButtonDisabled(true));
                validator.current?.submit();
                return;
            }

            if (doAnyTargetsHaveWarning) {
                dispatch(setIsSaveModalVisible(true));
                return;
            }

            await saveTrigger(triggerPayload);
        } catch (error) {
            Toast.push(error.message);
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setIsLoading(false));
        }
    };
};
