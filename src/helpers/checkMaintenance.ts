import { getUnixTime } from "date-fns";
import { getUTCDate, humanizeDuration } from "./DateUtil";
import { getMaintenanceCaption, Maintenance } from "../Domain/Maintenance";

export default function checkMaintenance(maintenance?: number | null): string {
    if (!maintenance) {
        return getMaintenanceCaption(Maintenance.off);
    }
    const delta = maintenance - getUnixTime(getUTCDate());
    return delta <= 0 ? getMaintenanceCaption(Maintenance.off) : humanizeDuration(delta);
}
