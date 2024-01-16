import React from "react";
import { Schedule } from "../../../Domain/Schedule";
import { format, addMinutes, startOfDay } from "date-fns";
import { getUTCDate } from "../../../helpers/DateUtil";

export function ScheduleView(props: { data: Schedule }): React.ReactElement {
    const { data } = props;
    const { days, startOffset, endOffset, tzOffset } = data;

    const startTime = format(addMinutes(startOfDay(getUTCDate()), startOffset), "HH:mm");

    const endTime = format(addMinutes(startOfDay(getUTCDate()), endOffset), "HH:mm");

    const timeZone = format(addMinutes(startOfDay(getUTCDate()), Math.abs(tzOffset)), "HH:mm");

    const timeZoneSign = tzOffset < 0 ? "+" : "−";
    const enabledDays = days.filter(({ enabled }) => enabled);

    return (
        <>
            {days.length === enabledDays.length
                ? "Everyday"
                : enabledDays.map(({ name }) => name).join(", ")}{" "}
            {startTime}—{endTime} (GMT {timeZoneSign}
            {timeZone})
        </>
    );
}
