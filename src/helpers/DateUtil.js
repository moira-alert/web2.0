import { getUnixTime } from "date-fns";

function getCurrentUnixTime(): String {
    return getUnixTime(getCurrentDate());
}

function getCurrentDate() {
    var date = new Date();
    var now_utc = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
    return new Date(now_utc);
}

export { getCurrentUnixTime, getCurrentDate };
