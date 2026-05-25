import type { ReactElement } from "react";
import { IconWarningTriangleRegular16 } from "@skbkontur/icons/IconWarningTriangleRegular16";
import classNames from "classnames/bind";

import styles from "./Bar.module.less";

const cn = classNames.bind(styles);

type Props = {
    message: string;
};

export default function Bar(props: Props): ReactElement {
    const { message } = props;
    return (
        <div className={cn("bar")}>
            <IconWarningTriangleRegular16 /> {message}
        </div>
    );
}
