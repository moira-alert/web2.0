import type { ReactNode, ReactElement } from "react";
import classNames from "classnames/bind";

import styles from "./CodeRef.module.less";

const cn = classNames.bind(styles);

export default function CodeRef({ children }: { children: ReactNode }): ReactElement {
    return <span className={cn("code-ref")}>{children}</span>;
}
