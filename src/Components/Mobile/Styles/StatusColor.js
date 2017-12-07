// @flow
import { Statuses } from "../../../Domain/Status";
import type { Status } from "../../../Domain/Status";
import { okColor, errorColor, warnColor, noDataColor, unknownColor } from "./variables.less";

export { unknownColor };

export default function getStatusColor(status: Status): string {
    if (status === Statuses.OK) {
        return okColor;
    }
    if (status === Statuses.NODATA) {
        return noDataColor;
    }
    if (status === Statuses.WARN) {
        return warnColor;
    }
    if (status === Statuses.ERROR) {
        return errorColor;
    }
    if (status === Statuses.EXCEPTION) {
        return errorColor;
    }
    if (status === Statuses.DEL) {
        return errorColor;
    }
    return "";
}
