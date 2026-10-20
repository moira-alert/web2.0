import type { CSSProperties } from "react";
import { Hint } from "@skbkontur/react-ui";
import cn from "classnames";
import GrafanaIcon from "../../assets/GrafanaIcon.svg?react";

import styles from "./GrafanaIconButton.module.less";

interface GrafanaIconButtonProps {
    link?: string | null;
    style?: CSSProperties;
    hintText: string;
    className?: string;
}

export const GrafanaIconButton = ({ link, style, hintText, className }: GrafanaIconButtonProps) => {
    const disabled = !link;

    return (
        <Hint
            text={disabled ? "Cluster is not selected or Grafana url is not configured" : hintText}
            pos="top center"
        >
            <a
                href={link || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(styles.link, {
                    [styles.disabled]: disabled,
                })}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : undefined}
            >
                <GrafanaIcon className={cn(styles.grafanaIcon, className)} style={style} />
            </a>
        </Hint>
    );
};
