import { Hint } from "@skbkontur/react-ui";
import cn from "classnames";
import GrafanaIcon from "../../assets/GrafanaIcon.svg?react";

import styles from "./GrafanaIconButton.module.less";

export const GrafanaIconButton = ({
    link,
    style,
    hintText,
    className,
}: {
    link?: string | null;
    style?: React.CSSProperties;
    hintText: string;
    className?: string;
}) => {
    if (!link) {
        return null;
    }

    return (
        <Hint text={hintText} pos="top center">
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <GrafanaIcon className={cn(styles.grafanaIcon, className)} style={style} />
            </a>
        </Hint>
    );
};
