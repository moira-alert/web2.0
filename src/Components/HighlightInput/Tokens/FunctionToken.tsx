import React from "react";
import classNames from "classnames/bind";

import styles from "./Tokens.less";

const cn = classNames.bind(styles);

type FunctionTokenProps = {
    children: React.ReactNode;
};

export default function FunctionToken({ children }: FunctionTokenProps): React.ReactElement {
    return <span className={cn("function")}>{children}</span>;
}
