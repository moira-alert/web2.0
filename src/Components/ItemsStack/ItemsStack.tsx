// ToDo перевести на @skbkontur/react-stack-layout
import React, { ReactNode, CSSProperties } from "react";
import classNames from "classnames/bind";

import styles from "./ItemsStacks.module.less";

const cn = classNames.bind(styles);

type VerticalAlign = "top" | "bottom" | "center" | "baseline" | "stretch";

type RowStackProps = {
    tag?: keyof JSX.IntrinsicElements;
    children?: React.ReactNode;
    id?: string;
    block?: boolean;
    inline?: boolean;
    baseline?: boolean;
    verticalAlign?: VerticalAlign;
    className?: string;
    style?: {
        [key: string]: string | number;
    };
    gap?: number;
};

export class RowStack extends React.Component<RowStackProps> {
    render(): React.ReactNode {
        const {
            tag,
            children,
            block,
            inline,
            baseline,
            verticalAlign,
            className,
            style = {},
            gap = 0,
            id,
        } = this.props;
        const TagComponent = tag || "div";

        if (block === true && inline === true) {
            throw new Error("Only one of block or inline property should be specified");
        }
        return (
            <TagComponent
                id={id}
                className={cn("row-stack", `gap-${gap.toString()}`, { block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(verticalAlign, baseline || false),
                }}
            >
                {children}
            </TagComponent>
        );
    }

    static verticalAlignMap = {
        top: "flex-start",
        bottom: "flex-end",
        center: "center",
        baseline: "baseline",
        stretch: "stretch",
    };

    getFlexBoxAlignItems(horizontalAlign: VerticalAlign | undefined, baseline: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "top";
        if (baseline) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "baseline";
        }
        return RowStack.verticalAlignMap[resultHorizontalAlign];
    }
}

type HorizontalAlign = "left" | "right" | "center" | "stretch";

type ColumnStackProps = {
    tag?: keyof JSX.IntrinsicElements;
    children?: React.ReactNode;
    block?: boolean;
    inline?: boolean;
    stretch?: boolean;
    horizontalAlign?: HorizontalAlign;
    className?: string;
    style?: {
        [key: string]: string | number;
    };
    gap?: number;
};

export class ColumnStack extends React.Component<ColumnStackProps> {
    render(): React.ReactNode {
        const {
            tag,
            children,
            block,
            inline,
            stretch,
            horizontalAlign,
            className = "",
            style = {},
            gap = 0,
        } = this.props;

        if (block === true && inline === true) {
            throw new Error("Only one of block or inline property should be specified");
        }

        const TagComponent = tag || "div";
        return (
            <TagComponent
                className={cn("column-stack", `gap-${gap.toString()}`, { block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(horizontalAlign, stretch || false),
                }}
            >
                {children}
            </TagComponent>
        );
    }

    static alignMap = {
        left: "flex-start",
        right: "flex-end",
        center: "center",
        stretch: "stretch",
    };

    getFlexBoxAlignItems(horizontalAlign: HorizontalAlign | undefined, stretch: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "left";
        if (stretch) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "stretch";
        }
        return ColumnStack.alignMap[resultHorizontalAlign];
    }
}

type FitProps = {
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

export function Fit({ tag, className, children, ...rest }: FitProps): React.ReactElement {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn(className, "fit")} {...rest}>
            {children}
        </TagComponent>
    );
}

type FillProps = {
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
};

export function Fill({ tag, children, className, ...rest }: FillProps): React.ReactElement {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn("fill", className)} {...rest}>
            {children}
        </TagComponent>
    );
}

type FixedProps = {
    tag?: keyof JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
    style?: {
        [key: string]: string | number;
    };
    width: number;
    allowWrap?: boolean;
    "data-tid"?: string;
};

export function Fixed({
    tag,
    children,
    width,
    className,
    style,
    allowWrap,
    ...rest
}: FixedProps): React.ReactElement {
    const TagComponent = tag || "div";
    return (
        <TagComponent
            className={cn("fixed", { "no-overflow": !allowWrap }, className)}
            style={{ ...style, width }}
            {...rest}
        >
            {children}
        </TagComponent>
    );
}
