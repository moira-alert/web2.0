// @flow
import moment from 'moment';
import { getMaintenanceCaption } from '../Domain/Maintenance';
export default function checkMaintenance(maintenance: ?number): string {
    if (!maintenance) {
        return getMaintenanceCaption('off');
    }
    const delta = maintenance - moment.utc().unix();
    return delta <= 0 ? getMaintenanceCaption('off') : moment.duration(delta * 1000).humanize();
}
