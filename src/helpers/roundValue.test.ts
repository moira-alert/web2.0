import { roundValue } from "./roundValue";

const cases = [
    [0, "0"],
    [1, "1"],
    [100, "100"],
    [1000, "1000"],
    [100_000, "100 K"],
    [100_005, "100 K"],
    [100_095, "100.09 K"],
    [100_903_000, "100.9 M"],
    [100_905_000, "100.91 M"],
    [100_960_000, "100.96 M"],
    [1_000_000_000, "1000 M"],
    [10_000_000_000, "10 G"],
    [10_000_000_000_000, "10 T"],
    [10_000_000_000_000_000, "10 P"],
    [10_000_000_000_000_000_000, "10 E"],
    [10_000_000_000_000_000_000_000, "10 Z"],
    [10_000_000_000_000_000_000_000_000, "10 Y"],
];

describe("roundValue", () => {
    test.each(cases)("rounds %i as %s", (value, expected) =>
        expect(roundValue(value)).toBe(expected)
    );

    it("returns empty string or placeholder for string inputs", () => {
        expect(roundValue("100", false)).toBe("");
        expect(roundValue("100")).toBe("—");
    });
});
