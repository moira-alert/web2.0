import React from "react";
import classNames from "classnames/bind";

import styles from "./Form.less";

const cn = classNames.bind(styles);

interface IFormProps {
    children: React.ReactNode;
}

export function Form({ children }: IFormProps): React.ReactElement {
    return <div className={cn("form")}>{children}</div>;
}

interface IFormRowProps {
    label?: string;
    useTopAlignForLabel?: boolean;
    singleLineControlGroup?: boolean;
    style?: {
        [key: string]: number | string;
    };
    children: React.ReactNode;
}

export function FormRow({
    label,
    useTopAlignForLabel,
    singleLineControlGroup,
    children,
    style,
}: IFormRowProps): React.ReactElement {
    const labelElement = label && (
        <div className={cn("label", { "label-for-group": useTopAlignForLabel })}>{label}</div>
    );

    return (
        <div className={cn("row")}>
            {labelElement}
            <div className={cn("control")}>
                <div style={style} className={cn({ group: singleLineControlGroup })}>
                    {children}
                </div>
            </div>
        </div>
    );
}
