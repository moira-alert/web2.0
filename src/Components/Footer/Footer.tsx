import * as React from "react";
import { useTheme } from "../../shared/themes";
import classNames from "classnames/bind";

import styles from "./Footer.less";

const cn = classNames.bind(styles);

type Props = {
    className?: string;
};

export default function Footer(props: Props): React.ReactElement {
    const { className } = props;
    const theme = useTheme();

    return (
        <footer
            style={{ backgroundColor: theme.appBgColorSecondary }}
            className={cn("footer", className)}
        >
            <div className={cn("container")}>© SKB Kontur</div>
        </footer>
    );
}
