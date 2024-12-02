import * as React from "react";
import { useTheme } from "../../Themes";
import classNames from "classnames/bind";

import styles from "./CodeRef.less";

const cn = classNames.bind(styles);

export default function CodeRef({ children }: { children: React.ReactNode }): React.ReactElement {
    const theme = useTheme();
    return (
        <span style={{ backgroundColor: theme.appBgColorTertiary }} className={cn("code-ref")}>
            {children}
        </span>
    );
}
