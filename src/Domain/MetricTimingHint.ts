import { Status } from "./Status";

export type AlertSeverity = Status.WARN | Status.ERROR;

export enum MetricTimingHintKind {
    Pending = "pending",
    KeepFiring = "keepFiring",
}

export interface MetricTimingSettings {
    warn_for?: number | null;
    error_for?: number | null;
    warn_keep_firing_for?: number | null;
    error_keep_firing_for?: number | null;
}

export interface MetricTimingHint {
    kind: MetricTimingHintKind;
    severity: AlertSeverity;
    forSeconds: number;
    startedAt: number;
    remainingSeconds: number;
}
