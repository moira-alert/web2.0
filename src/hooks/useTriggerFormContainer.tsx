import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Toast } from "@skbkontur/react-ui";
import MoiraApi from "../Api/MoiraApi";
import type { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";

type useTriggerFormContainerReturn = {
    validationResult: ValidateTriggerResult | undefined;
    setValidationResult: Dispatch<SetStateAction<ValidateTriggerResult | undefined>>;
    validateTrigger: (
        container: RefObject<ValidationContainer>,
        trigger: Partial<Trigger>
    ) => Promise<boolean>;
    updateTrigger: (trigger: Trigger | Partial<Trigger>) => Trigger | Partial<Trigger>;
};

export const useTriggerFormContainer = (moiraApi: MoiraApi): useTriggerFormContainerReturn => {
    const [validationResult, setValidationResult] = useState<ValidateTriggerResult | undefined>(
        undefined
    );

    const validateTrigger = async (
        container: RefObject<ValidationContainer>,
        trigger: Partial<Trigger>
    ) => {
        const isFormValid = await container.current?.validate();
        if (!isFormValid) {
            return false;
        }

        const validationResult = await validateTriggerData(trigger);
        if (!validationResult) {
            return false;
        }

        const areTargetsValid = checkTargets(validationResult);
        if (!areTargetsValid) {
            setValidationResult(validationResult);
            return false;
        }

        return true;
    };

    const validateTriggerData = async (trigger: Trigger | Partial<Trigger>) => {
        try {
            return moiraApi.validateTrigger(trigger);
        } catch (error) {
            Toast.push(error.toString());
            return false;
        }
    };

    const checkTargets = ({ targets }: ValidateTriggerResult): boolean =>
        targets.every(
            (target: ValidateTriggerTarget | undefined) =>
                target?.syntax_ok && !target?.tree_of_problems
        );

    const updateTrigger = (trigger: Trigger | Partial<Trigger>) => {
        switch (trigger.trigger_type) {
            case "expression":
                return {
                    ...trigger,
                    error_value: null,
                    warn_value: null,
                };
            case "rising":
            case "falling":
                return {
                    ...trigger,
                    expression: "",
                };
            default:
                throw new Error(`Unknown trigger type: ${trigger.trigger_type}`);
        }
    };

    return {
        validationResult,
        setValidationResult,
        validateTrigger,
        updateTrigger,
    };
};
