import type { ReactElement } from "react";
import { IconMinusCircleRegular16 } from "@skbkontur/icons/IconMinusCircleRegular16";
import classNames from "classnames/bind";

import styles from "./ModalError.module.less";

const cn = classNames.bind(styles);

type FooterErrorProps = {
    message?: string | null;
    maxWidth?: string;
    margin?: string | number;
    padding?: string | number;
};

export default function ModalError({
    message,
    maxWidth,
    margin,
    padding,
}: FooterErrorProps): ReactElement | null {
    return message ? (
        <div className={cn("root")} style={{ margin, padding }}>
            <div style={{ maxWidth }}>
                <IconMinusCircleRegular16 /> {message}
            </div>
        </div>
    ) : null;
}
