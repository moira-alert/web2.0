import React from "react";
import classNames from "classnames/bind";

import styles from "./Tokens.less";

const cn = classNames.bind(styles);

type BracketHighlightTokenProps = {
    children: React.ReactNode;
};

export default function BracketHighlightToken({
    children,
}: BracketHighlightTokenProps): React.ReactElement {
    return <span className={cn("bracketHighlight")}>{children}</span>;
}
