import { Dispatch, RefObject } from "react";
import MoiraApi from "../Api/MoiraApi";
import type { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Toast } from "@skbkontur/react-ui";
import { Action, ActionType } from "./useTriggerFormContainerReducer";

const checkTargetsForErrors = ({ targets }: ValidateTriggerResult): boolean =>
    targets.some(
        (target: ValidateTriggerTarget | undefined) =>
            !target?.syntax_ok || target?.tree_of_problems?.type === "bad"
    );

const checkTargetsForWarnings = ({ targets }: ValidateTriggerResult): boolean =>
    targets.some((target) => target?.tree_of_problems?.type === "warn");

export const useSaveTrigger = (
    moiraApi: MoiraApi,
    validator: RefObject<ValidationContainer>,
    dispatch: Dispatch<Action>
) => {
    const validateTrigger = async (trigger: Partial<Trigger>) => {
        const validationResult = await moiraApi.validateTrigger(trigger);

        const doAnyTargetsHaveError = checkTargetsForErrors(validationResult);
        const doAnyTargetsHaveWarning = checkTargetsForWarnings(validationResult);

        if (doAnyTargetsHaveError || doAnyTargetsHaveWarning) {
            dispatch({ type: ActionType.setValidationResult, payload: validationResult });
        }

        return { doAnyTargetsHaveError, doAnyTargetsHaveWarning };
    };

    return async (trigger) => {
        if (!trigger) {
            return;
        }

        const isFormValid = await validator.current?.validate();
        if (!isFormValid) {
            return;
        }

        dispatch({ type: ActionType.setIsLoading, payload: true });
        try {
            const { doAnyTargetsHaveError, doAnyTargetsHaveWarning } = await validateTrigger(
                trigger
            );

            if (doAnyTargetsHaveError) {
                dispatch({ type: ActionType.setIsSaveButtonDisabled, payload: true });
                validator.current?.submit();
                return;
            }

            if (doAnyTargetsHaveWarning) {
                dispatch({ type: ActionType.setIsSaveModalVisible, payload: true });
            }
        } catch (error) {
            Toast.push(error.message);
            dispatch({ type: ActionType.setError, payload: error.message });
            throw error;
        } finally {
            dispatch({ type: ActionType.setIsLoading, payload: false });
        }
    };
};
