import { formatDistance } from "date-fns";
import { format, parse } from "date-fns";

function getUTCDate(): Date {
    const date = new Date();
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        )
    );
}

function humanizeDuration(unixTimestamp: number): string {
    return formatDistance(0, unixTimestamp * 1000);
}

export { humanizeDuration, getUTCDate };

export const dateStringToUnixTimestamp = (dateString: string): Date => {
    return parse(dateString, "dd.MM.yyyy", new Date());
};

export const timeList = Array(24)
    .fill(undefined)
    .map((_, index) => `${index}:00`.padStart(5, "0"));

export const formatDateToCalendarDate = (date: Date | number): string => format(date, "dd.MM.yyyy");

export const pluralizeHours = (hours: number): string => {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
};
