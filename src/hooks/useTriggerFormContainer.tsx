import { Dispatch, SetStateAction, useState } from "react";
import MoiraApi from "../Api/MoiraApi";
import type { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";

type useTriggerFormContainerReturn = {
    validationResult: ValidateTriggerResult | undefined;
    setValidationResult: Dispatch<SetStateAction<ValidateTriggerResult | undefined>>;
    validateTrigger: (
        trigger: Partial<Trigger>
    ) => Promise<{ doAnyTargetsHaveError: boolean; doAnyTargetsHaveWarning: boolean }>;
    updateTrigger: (trigger: Trigger | Partial<Trigger>) => Trigger | Partial<Trigger>;
};

export const useTriggerFormContainer = (moiraApi: MoiraApi): useTriggerFormContainerReturn => {
    const [validationResult, setValidationResult] = useState<ValidateTriggerResult | undefined>(
        undefined
    );

    const validateTrigger = async (trigger: Partial<Trigger>) => {
        const validationResult = await moiraApi.validateTrigger(trigger);

        const doAnyTargetsHaveError = checkTargetsForErrors(validationResult);
        const doAnyTargetsHaveWarning = checkTargetsForWarnings(validationResult);

        if (doAnyTargetsHaveError || doAnyTargetsHaveWarning) {
            setValidationResult(validationResult);
        }

        return { doAnyTargetsHaveError, doAnyTargetsHaveWarning };
    };

    const checkTargetsForErrors = ({ targets }: ValidateTriggerResult): boolean =>
        targets.some(
            (target: ValidateTriggerTarget | undefined) =>
                !target?.syntax_ok || target?.tree_of_problems?.type === "bad"
        );

    const checkTargetsForWarnings = ({ targets }: ValidateTriggerResult): boolean =>
        targets.some((target) => target?.tree_of_problems?.type === "warn");

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
