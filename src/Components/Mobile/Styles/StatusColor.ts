import { Status } from "../../../Domain/Status";
import classNames from "classnames/bind";

import styles from "./variables.less";

const cn = classNames.bind(styles);

const { okColor, errorColor, warnColor, noDataColor, unknownColor } = variables;

export { unknownColor };

export default function getStatusColor(status: Status): string {
    if (status === Status.OK) {
        return okColor;
    }
    if (status === Status.NODATA) {
        return noDataColor;
    }
    if (status === Status.WARN) {
        return warnColor;
    }
    if (status === Status.ERROR) {
        return errorColor;
    }
    if (status === Status.EXCEPTION) {
        return errorColor;
    }
    if (status === Status.DEL) {
        return errorColor;
    }
    return "";
}
