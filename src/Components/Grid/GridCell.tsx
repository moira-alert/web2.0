import React, { ReactElement, ReactNode } from "react";

interface GridCellProps {
    margin?: string;
    align?: string;
    children: ReactNode;
}

export function GridCell(props: GridCellProps): ReactElement {
    const style = {
        margin: props.margin,
        alignSelf: props.align,
    };

    return <div style={style}>{props.children}</div>;
}
