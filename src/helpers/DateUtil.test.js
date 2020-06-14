import MockDate from "mockdate";
import { humanizeDuration, getUTCDate } from "./DateUtil";

describe("getUTCDate", () => {
    let result;

    beforeEach(() => {
        result = new Date("Tue Jun 09 2020 06:00:00 GMT+0000");
        MockDate.set("Tue Jun 09 2020 09:00:00 GMT+0300");
    });

    afterEach(() => {
        result = null;
        MockDate.reset();
    });

    it("returns correct UTC date from PC timezone", () => {
        expect(getUTCDate()).toStrictEqual(result);
    });
});

test("humanizeDuration", () => {
    expect(humanizeDuration(29)).toBe("less than a minute");
    expect(humanizeDuration(86400)).toBe("1 day");
    expect(humanizeDuration(2764800)).toBe("about 1 month");
});
