// @flow
import { getCurrentUnixTime } from "../helpers/DateUtil";
import { formatDistance } from "date-fns";
import { getMaintenanceCaption } from "../Domain/Maintenance";

export default function checkMaintenance(maintenance: ?number): string {
    if (!maintenance) {
        return getMaintenanceCaption("off");
    }
    const delta = maintenance - getCurrentUnixTime();
    return delta <= 0 ? getMaintenanceCaption("off") : formatDistance(0, delta * 1000);
}
