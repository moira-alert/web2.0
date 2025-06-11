import * as React from "react";
import WarningIcon from "@skbkontur/react-icons/Warning";
import classNames from "classnames/bind";

import styles from "./Bar.module.less";

const cn = classNames.bind(styles);

type Props = {
    message: string;
};

export default function Bar(props: Props): React.ReactElement {
    const { message } = props;
    return (
        <div className={cn("bar")}>
            <WarningIcon /> {message}
        </div>
    );
}
