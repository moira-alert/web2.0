export enum DaysOfWeek {
    Mon = "Mon",
    Tue = "Tue",
    Wed = "Wed",
    Thu = "Thu",
    Fri = "Fri",
    Sat = "Sat",
    Sun = "Sun",
}

export interface Day {
    enabled: boolean;
    name: DaysOfWeek;
}

export interface Schedule {
    startOffset: number;
    endOffset: number;
    tzOffset: number;
    days: Array<Day>;
}

export const WholeWeek: DaysOfWeek[] = [
    DaysOfWeek.Mon,
    DaysOfWeek.Tue,
    DaysOfWeek.Wed,
    DaysOfWeek.Thu,
    DaysOfWeek.Fri,
    DaysOfWeek.Sat,
    DaysOfWeek.Sun,
];

export function createSchedule(days: DaysOfWeek[]): Schedule {
    return {
        days: WholeWeek.map((x) => ({ enabled: days.includes(x), name: x })),
        tzOffset: new Date().getTimezoneOffset(),
        startOffset: 0,
        endOffset: 1439,
    };
}

export const defaultSchedule = (schedule: Schedule | undefined) => {
    return {
        startOffset: schedule?.startOffset || 0,
        endOffset: schedule?.endOffset || 1439,
        tzOffset: schedule?.tzOffset || new Date().getTimezoneOffset(),
        days:
            schedule?.days ||
            Object.values(DaysOfWeek).map((day) => ({ name: day, enabled: false })),
    };
};
