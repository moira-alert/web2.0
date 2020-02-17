// @flow
import { getUnixTime } from "date-fns";
import { getUTCDate, parseUnixTimestampToJS } from "./DateUtil";
import { getMaintenanceCaption } from "../Domain/Maintenance";

export default function checkMaintenance(maintenance: ?number): string {
    if (!maintenance) {
        return getMaintenanceCaption("off");
    }
    const delta = maintenance - getUnixTime(getUTCDate());
    return delta <= 0 ? getMaintenanceCaption("off") : parseUnixTimestampToJS(delta);
}
