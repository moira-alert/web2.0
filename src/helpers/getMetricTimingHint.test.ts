import { getMetricTimingHint, MetricTimingThresholds } from "./getMetricTimingHint";
import { Status } from "../Domain/Status";

const rising: MetricTimingThresholds = {
    trigger_type: "rising",
    warn_value: 1,
    error_value: 10,
    warn_for: 60,
    error_for: 120,
    warn_keep_firing_for: 30,
    error_keep_firing_for: 90,
};

describe("getMetricTimingHint", () => {
    it("returns null for expression triggers", () => {
        expect(
            getMetricTimingHint({ state: Status.OK, value: 5 }, { ...rising, trigger_type: undefined })
        ).toBeNull();
    });

    it("returns null when value is missing", () => {
        expect(getMetricTimingHint({ state: Status.OK, value: null }, rising)).toBeNull();
    });

    it("pending WARN: value over warn threshold but state still OK (rising)", () => {
        expect(getMetricTimingHint({ state: Status.OK, value: 5 }, rising)).toEqual({
            kind: "pending",
            severity: Status.WARN,
            forSeconds: 60,
        });
    });

    it("pending ERROR: value over error threshold but state still WARN (rising)", () => {
        expect(getMetricTimingHint({ state: Status.WARN, value: 20 }, rising)).toEqual({
            kind: "pending",
            severity: Status.ERROR,
            forSeconds: 120,
        });
    });

    it("keepFiring WARN: value recovered but state still WARN (rising)", () => {
        expect(getMetricTimingHint({ state: Status.WARN, value: 0 }, rising)).toEqual({
            kind: "keepFiring",
            severity: Status.WARN,
            forSeconds: 30,
        });
    });

    it("keepFiring ERROR: value dropped below error but state still ERROR", () => {
        expect(getMetricTimingHint({ state: Status.ERROR, value: 5 }, rising)).toEqual({
            kind: "keepFiring",
            severity: Status.ERROR,
            forSeconds: 90,
        });
    });

    it("no hint when state matches value severity", () => {
        expect(getMetricTimingHint({ state: Status.WARN, value: 5 }, rising)).toBeNull();
    });

    it("no pending hint when the timer is 0", () => {
        expect(
            getMetricTimingHint({ state: Status.OK, value: 5 }, { ...rising, warn_for: 0 })
        ).toBeNull();
    });

    it("falling: pending WARN when value is at/below threshold", () => {
        const falling: MetricTimingThresholds = {
            ...rising,
            trigger_type: "falling",
            warn_value: 10,
            error_value: 1,
        };
        expect(getMetricTimingHint({ state: Status.OK, value: 5 }, falling)).toEqual({
            kind: "pending",
            severity: Status.WARN,
            forSeconds: 60,
        });
    });

    it("returns null for non OK/WARN/ERROR states", () => {
        expect(getMetricTimingHint({ state: Status.NODATA, value: 5 }, rising)).toBeNull();
    });
});
