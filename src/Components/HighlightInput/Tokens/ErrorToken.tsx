import React from "react";
import classNames from "classnames/bind";

import styles from "./Tokens.less";

const cn = classNames.bind(styles);

type ErrorTokenProps = {
    children: React.ReactNode;
};

export default function ErrorToken({ children }: ErrorTokenProps): React.ReactElement {
    return <span className={cn("error")}>{children}</span>;
}
