import * as React from "react";
import { useTheme } from "../../shared/themes";
import classNames from "classnames/bind";

import styles from "./CodeRef.less";

const cn = classNames.bind(styles);

export default function CodeRef({ children }: { children: React.ReactNode }): React.ReactElement {
    const theme = useTheme();
    return (
        <span style={{ backgroundColor: theme.codeRef }} className={cn("code-ref")}>
            {children}
        </span>
    );
}
