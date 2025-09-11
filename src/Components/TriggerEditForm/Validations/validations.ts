import { ValidationInfo } from "@skbkontur/react-ui-validations";
import TriggerSource, { LOW_TRIGGER_TTL } from "../../../Domain/Trigger";
import { Schedule } from "../../../Domain/Schedule";
import { IMetricSourceCluster } from "../../../Domain/Metric";

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

export const validateClusterID = (
    clusterID: string | undefined | null,
    triggerSource: TriggerSource,
    metricSourceClusters: IMetricSourceCluster[]
): ValidationInfo | null => {
    const clusterEntities = metricSourceClusters?.reduce((acc: string[][], item) => {
        if (item.trigger_source === triggerSource) {
            acc.push([item.cluster_id, item.cluster_name]);
        }
        return acc;
    }, []);

    const isValid = clusterEntities.length !== 1 && !clusterID;
    return isValid
        ? {
              type: "submit",
              message: "Can't be empty",
          }
        : null;
};
