import React, { ReactElement, ReactNode } from "react";
import styles from "./Grid.module.less";

export interface GridProps {
    columns?: string;
    gap?: string;
    align?: string;
    justifyItems?: string;
    margin?: string;
    children: ReactNode;
}

export function Grid(props: GridProps): ReactElement {
    const style = {
        gridTemplateColumns: props.columns,
        gridGap: props.gap,
        justifyItems: props.justifyItems,
        alignItems: props.align,
        margin: props.margin,
    };

    return (
        <div className={styles.grid} style={style}>
            {props.children}
        </div>
    );
}
