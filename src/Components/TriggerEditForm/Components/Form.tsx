import type { ReactNode, ReactElement } from "react";
import classNames from "classnames/bind";

import styles from "./Form.module.less";

const cn = classNames.bind(styles);

interface IFormProps {
    children: ReactNode;
}

export function Form({ children }: IFormProps): ReactElement {
    return <div className={cn("form")}>{children}</div>;
}

interface IFormRowProps {
    label?: string;
    useTopAlignForLabel?: boolean;
    singleLineControlGroup?: boolean;
    style?: {
        [key: string]: number | string;
    };
    children: ReactNode;
}

export function FormRow({
    label,
    useTopAlignForLabel,
    singleLineControlGroup,
    children,
    style,
}: IFormRowProps): ReactElement {
    const labelElement = label && (
        <div className={cn("label", { "label-for-group": useTopAlignForLabel })}>{label}</div>
    );

    return (
        <div className={cn("row")}>
            {labelElement}
            <div style={style} className={cn("control", { group: singleLineControlGroup })}>
                {children}
            </div>
        </div>
    );
}
