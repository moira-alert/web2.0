// @flow
export const Maintenances = {
    off: "off",
    quarterHour: "quarterHour",
    oneHour: "oneHour",
    threeHours: "threeHours",
    sixHours: "sixHours",
    oneDay: "oneDay",
    oneWeek: "oneWeek",
    twoWeeks: "twoWeeks",
    oneMonth: "oneMonth",
};

const MaintenanceTimes = {
    off: 0,
    quarterHour: 15,
    oneHour: 60,
    threeHours: 180,
    sixHours: 360,
    oneDay: 1440,
    oneWeek: 10080,
    twoWeeks: 20160,
    oneMonth: 43200,
};

const MaintenanceCaptions = {
    off: "Off",
    quarterHour: "15 min",
    oneHour: "1 hour",
    threeHours: "3 hours",
    sixHours: "6 hours",
    oneDay: "1 day",
    oneWeek: "1 week",
    twoWeeks: "2 weeks",
    oneMonth: "1 month",
};

export type Maintenance = $Keys<typeof Maintenances>;

export function getMaintenanceCaption(maintenance: Maintenance): string {
    return MaintenanceCaptions[maintenance];
}

export function getMaintenanceTime(maintenance: Maintenance): number {
    return MaintenanceTimes[maintenance];
}
