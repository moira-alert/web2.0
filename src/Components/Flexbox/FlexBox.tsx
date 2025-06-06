import React, { ReactNode, HTMLProps, CSSProperties } from "react";

interface IProps extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
    gap?: number;
    width?: number | string;
    height?: number | string;
    direction?: "row" | "row-reverse" | "column" | "column-reverse";
    align?: string;
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    justify?: string;
    margin?: string;
    style?: CSSProperties;
    className?: string;
    onClick?: (...args: never) => void;
}

export const Flexbox = ({
    gap = 0,
    direction = "column",
    align = "stretch",
    justify = "flex-start",
    children,
    width = "auto",
    height,
    wrap = "nowrap",
    margin = "0 0 0 0",
    style,
    className,
    onClick,
}: IProps) => {
    const FlexboxStyles: CSSProperties = {
        display: "flex",
        gap,
        width: typeof width === "number" ? width + "px" : width,
        flexDirection: direction,
        alignItems: align,
        flexWrap: wrap,
        justifyContent: justify,
        margin,
        height,
    };

    return (
        <div style={{ ...FlexboxStyles, ...style }} className={className} onClick={onClick}>
            {children}
        </div>
    );
};
