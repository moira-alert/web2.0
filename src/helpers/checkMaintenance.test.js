import MockDate from "mockdate";
import checkMaintenance from "./checkMaintenance";

describe("checkMaintenance", () => {
    let result;

    beforeEach(() => {
        result = +new Date("Tue Jun 09 2020 09:01:00 GMT+0300") / 1000;
        MockDate.set("Tue Jun 09 2020 09:00:00 GMT+0300");
    });

    afterEach(() => {
        result = null;
        MockDate.reset();
    });

    it("returns off if maintenance not set", () => {
        expect(checkMaintenance()).toStrictEqual("Off");
    });

    it("returns correct humanized value", () => {
        expect(checkMaintenance(result)).toStrictEqual("1 minute");
    });

    it("returns off if maintenance in pass", () => {
        expect(checkMaintenance(result - 60)).toStrictEqual("Off");
    });
});
