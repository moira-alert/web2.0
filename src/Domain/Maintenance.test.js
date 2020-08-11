import MockDate from "mockdate";
import { calculateMaintenanceTime, setTriggerMaintenance } from "./Maintenance";

const mockFn = jest.fn();

describe("Maintenance", () => {
    const triggerId = "f96c5608-bd00-4ea2-abd5-be677cdf7e03";
    const api = { setMaintenance: mockFn };

    beforeEach(() => {
        MockDate.set("Tue Jun 09 2020 09:00:00 GMT+0300");
    });

    afterEach(() => {
        MockDate.reset();
        mockFn.mockClear();
    });

    it(`call setTriggerMaintenance with off`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("off"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 0 });
    });
    it(`call setTriggerMaintenance with quarterHour "15 min"`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("quarterHour"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 1591683300 });
    });
    it(`call setTriggerMaintenance with oneHour "1 hour"`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("oneHour"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 1591686000 });
    });
    it(`call setTriggerMaintenance with oneDay "1 day"`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("oneDay"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 1591768800 });
    });
    it(`call setTriggerMaintenance with oneWeek "1 week"`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("oneWeek"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 1592287200 });
    });
    it(`call setTriggerMaintenance with oneMonth "1 month"`, async () => {
        await setTriggerMaintenance(api, triggerId, calculateMaintenanceTime("oneMonth"));
        expect(api.setMaintenance).toBeCalledWith(triggerId, { trigger: 1594274400 });
    });
});
