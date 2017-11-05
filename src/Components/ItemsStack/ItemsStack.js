// @flow
/* eslint-disable react/no-multi-comp */
import * as React from "react";
import cn from "./ItemsStacks.less";

type VerticalAlign = "top" | "bottom" | "center" | "baseline" | "stretch";

type RowStackProps = {
    tag?: string | React.ComponentType<*>,
    children?: any,
    id?: string,
    block?: boolean,
    inline?: boolean,
    baseline?: boolean,
    verticalAlign?: VerticalAlign,
    className?: string,
    style?: { [key: string]: any },
    gap?: number,
};

export class RowStack extends React.Component<RowStackProps> {
    props: RowStackProps;

    static verticalAlignMap = {
        top: "flex-start",
        bottom: "flex-end",
        center: "center",
        baseline: "baseline",
        stretch: "stretch",
    };

    getFlexBoxAlignItems(horizontalAlign: VerticalAlign | typeof undefined, baseline: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "top";
        if (baseline === true) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "baseline";
        }
        return RowStack.verticalAlignMap[resultHorizontalAlign];
    }

    render(): React.Node {
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
                className={cn("row-stack", "gap-" + gap.toString(), { ["block"]: block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(verticalAlign, baseline || false),
                }}>
                {children}
            </TagComponent>
        );
    }
}

type HorizontalAlign = "left" | "right" | "center" | "stretch";

type ColumnStackProps = {
    tag?: string | React.ComponentType<*>,
    children?: any,
    block?: boolean,
    inline?: boolean,
    stretch?: boolean,
    horizontalAlign?: HorizontalAlign,
    className?: string,
    style?: { [key: string]: any },
    gap?: number,
};

export class ColumnStack extends React.Component<ColumnStackProps> {
    props: ColumnStackProps;
    static alignMap = {
        left: "flex-start",
        right: "flex-end",
        center: "center",
        stretch: "stretch",
    };

    getFlexBoxAlignItems(horizontalAlign: HorizontalAlign | typeof undefined, stretch: boolean): string {
        let resultHorizontalAlign = horizontalAlign || "left";
        if (stretch === true) {
            if (horizontalAlign !== undefined) {
                throw new Error("Should be specified horizontalAlign or one of it's shorthand");
            }
            resultHorizontalAlign = "stretch";
        }
        return ColumnStack.alignMap[resultHorizontalAlign];
    }

    render(): React.Node {
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
                className={cn("column-stack", "gap-" + gap.toString(), { ["block"]: block }, className)}
                style={{
                    ...style,
                    alignItems: this.getFlexBoxAlignItems(horizontalAlign, stretch || false),
                }}>
                {children}
            </TagComponent>
        );
    }
}

type FitProps = {
    tag?: string | React.ComponentType<*>,
    className?: string,
    children?: React.Node,
};

export function Fit({ tag, className, children, ...rest }: FitProps): React.Element<any> {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn(className, "fit")} {...rest}>
            {children}
        </TagComponent>
    );
}

type FillProps = {
    tag?: string | React.ComponentType<*>,
    className?: string,
    children?: any,
};

export function Fill({ tag, children, className, ...rest }: FillProps): React.Node {
    const TagComponent = tag || "div";
    return (
        <TagComponent className={cn("fill", className)} {...rest}>
            {children}
        </TagComponent>
    );
}

type FixedProps = {|
    "data-tid"?: ?string,
    tag?: string | React.ComponentType<*>,
    className?: string,
    children?: any,
    style?: {},
    width: number,
    allowWrap?: boolean,
|};

export function Fixed({ tag, children, width, className, style, allowWrap, ...rest }: FixedProps): React.Node {
    const TagComponent = tag || "div";
    return (
        <TagComponent
            className={cn("fixed", { "no-overflow": !allowWrap }, className)}
            style={{ ...style, width: width }}
            {...rest}>
            {children}
        </TagComponent>
    );
}
