import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { LOW_TRIGGER_TTL } from "../../../Domain/Trigger";
import { Schedule } from "../../../Domain/Schedule";

export const validateRequiredString = (
    value: string,
    message?: string
): ValidationInfo | null | undefined => {
    const isEmptyValue = !value.trim().length;
    return isEmptyValue
        ? {
              type: isEmptyValue ? "submit" : "lostfocus",
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

export const validateSched = (schedule: Schedule | undefined): ValidationInfo | null => {
    if (!schedule) {
        return null;
    }

    return schedule?.days.every((day) => !day.enabled)
        ? {
              type: "submit",
              message: "Schedule can't be empty",
          }
        : null;
};

export const validateClusterID = (clusterID: string | undefined | null): ValidationInfo | null => {
    if (clusterID == null || clusterID === undefined) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }
    return null;
};
