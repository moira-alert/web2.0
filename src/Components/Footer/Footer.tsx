import type { ReactElement } from "react";
import classNames from "classnames/bind";

import styles from "./Footer.module.less";

const cn = classNames.bind(styles);

type Props = {
    className?: string;
};

export default function Footer(props: Props): ReactElement {
    const { className } = props;

    return (
        <footer className={cn("footer", className)}>
            <div className={cn("container")}>© SKB Kontur</div>
        </footer>
    );
}
