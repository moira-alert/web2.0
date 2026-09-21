import { Status } from "../Domain/Status";
import type { Metric } from "../Domain/Metric";
import {
    AlertSeverity,
    MetricTimingHint,
    MetricTimingHintKind,
    MetricTimingSettings,
} from "../Domain/MetricTimingHint";

const isSupportedState = (state: Status): state is Status.OK | AlertSeverity =>
    state === Status.OK || state === Status.WARN || state === Status.ERROR;
const isTimerRunning = (since: number | null | undefined): since is number => (since ?? 0) > 0;

const getPendingHint = (
    severity: Status,
    startedAt: number,
    checkedAt: number,
    settings: MetricTimingSettings
): MetricTimingHint | null => {
    const forSeconds = severity === Status.ERROR ? settings.error_for : settings.warn_for;
    if ((severity !== Status.WARN && severity !== Status.ERROR) || !forSeconds || forSeconds <= 0)
        return null;
    return {
        kind: MetricTimingHintKind.Pending,
        severity,
        forSeconds,
        startedAt,
        remainingSeconds: Math.max(0, forSeconds - (checkedAt - startedAt)),
    };
};

const getKeepFiringHint = (
    state: Status,
    startedAt: number,
    checkedAt: number,
    settings: MetricTimingSettings
): MetricTimingHint | null => {
    if (state !== Status.WARN && state !== Status.ERROR) return null;
    const forSeconds =
        state === Status.ERROR ? settings.error_keep_firing_for : settings.warn_keep_firing_for;
    if (!forSeconds || forSeconds <= 0) return null;
    return {
        kind: MetricTimingHintKind.KeepFiring,
        severity: state,
        forSeconds,
        startedAt,
        remainingSeconds: Math.max(0, forSeconds - (checkedAt - startedAt)),
    };
};

export const getMetricTimingHints = (
    metric: Pick<
        Metric,
        | "state"
        | "timestamp"
        | "warn_since"
        | "error_since"
        | "warn_recover_since"
        | "error_recover_since"
    >,
    settings: MetricTimingSettings
): MetricTimingHint[] => {
    const { state, timestamp, warn_since, error_since, warn_recover_since, error_recover_since } =
        metric;
    if (!isSupportedState(state)) return [];
    const hints: MetricTimingHint[] = [];
    if (state !== Status.ERROR && isTimerRunning(error_since)) {
        const hint = getPendingHint(Status.ERROR, error_since, timestamp, settings);
        if (hint) hints.push(hint);
    }
    if (state === Status.OK && isTimerRunning(warn_since)) {
        const hint = getPendingHint(Status.WARN, warn_since, timestamp, settings);
        if (hint) hints.push(hint);
    }
    if (state === Status.ERROR && isTimerRunning(error_recover_since)) {
        const hint = getKeepFiringHint(Status.ERROR, error_recover_since, timestamp, settings);
        if (hint) hints.push(hint);
    }
    if (state === Status.WARN && isTimerRunning(warn_recover_since)) {
        const hint = getKeepFiringHint(Status.WARN, warn_recover_since, timestamp, settings);
        if (hint) hints.push(hint);
    }
    return hints;
};

export const getMetricTimingHint = (
    metric: Pick<
        Metric,
        | "state"
        | "timestamp"
        | "warn_since"
        | "error_since"
        | "warn_recover_since"
        | "error_recover_since"
    >,
    settings: MetricTimingSettings
): MetricTimingHint | null => getMetricTimingHints(metric, settings)[0] ?? null;
