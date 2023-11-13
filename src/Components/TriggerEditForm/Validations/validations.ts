import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { LOW_TRIGGER_TTL } from "../../../Domain/Trigger";

export const validateRequiredString = (
    value: string,
    message?: string
): ValidationInfo | null | undefined => {
    return value.trim().length === 0
        ? {
              type: value.trim().length === 0 ? "submit" : "lostfocus",
              message: message || "Can't be empty",
          }
        : null;
};

export const validateTTL = (value?: number): ValidationInfo | null => {
    if (value === undefined) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }

    if (value <= 0) {
        return {
            type: "lostfocus",
            message: "Can't be zero or negative",
        };
    }

    if (value < LOW_TRIGGER_TTL) {
        return {
            type: "lostfocus",
            level: "warning",
            message: "Low TTL can lead to false positives",
        };
    }

    return null;
};
