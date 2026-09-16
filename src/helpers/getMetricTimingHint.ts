import { Status, getStatusWeight } from "../Domain/Status";
import { Metric } from "../Domain/Metric";
import { TriggerType } from "../Domain/Trigger";

export interface MetricTimingThresholds {
    trigger_type?: TriggerType;
    warn_value?: number | null;
    error_value?: number | null;
    warn_for?: number | null;
    error_for?: number | null;
    warn_keep_firing_for?: number | null;
    error_keep_firing_for?: number | null;
}

export interface MetricTimingHint {
    kind: "pending" | "keepFiring";
    severity: Status.WARN | Status.ERROR;
    forSeconds: number;
    // TODO(for-timers): remainingSeconds, когда API отдаст *_since / *_recover_since
}

const breaches = (value: number, threshold: number, triggerType: TriggerType): boolean =>
    triggerType === "falling" ? value <= threshold : value >= threshold;

/**
 * Derives a transitional "for"-timer hint for a metric, since the API exposes no
 * dedicated pending state. Two symmetric cases:
 *  - pending:    value is over threshold but state is still lower (warn_for/error_for counting up)
 *  - keepFiring: value recovered but state is still higher (warn_keep_firing_for/error_keep_firing_for)
 * Returns null for expression triggers (no thresholds on the frontend) and when there is nothing to hint.
 */
export function getMetricTimingHint(
    metric: Pick<Metric, "state" | "value">,
    thresholds: MetricTimingThresholds
): MetricTimingHint | null {
    const { trigger_type: triggerType, warn_value, error_value } = thresholds;

    if (triggerType !== "rising" && triggerType !== "falling") return null;

    const { state, value } = metric;
    if (value == null) return null;
    if (state !== Status.OK && state !== Status.WARN && state !== Status.ERROR) return null;

    let severityByValue: Status = Status.OK;
    if (warn_value != null && breaches(value, warn_value, triggerType)) {
        severityByValue = Status.WARN;
    }
    if (error_value != null && breaches(value, error_value, triggerType)) {
        severityByValue = Status.ERROR;
    }

    const valueWeight = getStatusWeight(severityByValue);
    const stateWeight = getStatusWeight(state);

    if (valueWeight > stateWeight) {
        const forSeconds =
            (severityByValue === Status.ERROR ? thresholds.error_for : thresholds.warn_for) ?? 0;
        return forSeconds > 0
            ? {
                  kind: "pending",
                  severity: severityByValue as Status.WARN | Status.ERROR,
                  forSeconds,
              }
            : null;
    }

    if (valueWeight < stateWeight) {
        const forSeconds =
            (state === Status.ERROR
                ? thresholds.error_keep_firing_for
                : thresholds.warn_keep_firing_for) ?? 0;
        return forSeconds > 0
            ? { kind: "keepFiring", severity: state as Status.WARN | Status.ERROR, forSeconds }
            : null;
    }

    return null;
}
