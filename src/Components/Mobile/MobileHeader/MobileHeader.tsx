import type { ReactNode, ReactElement, ChangeEvent } from "react";
import { Link } from "react-router";
import { IconXRegular16 } from "@skbkontur/icons/IconXRegular16";
import classNames from "classnames/bind";

import styles from "./MobileHeader.module.less";

const cn = classNames.bind(styles);

type Props = {
    color?: string;
    children: ReactNode;
};

export default function MobileHeader({ color, children }: Props): ReactElement {
    return (
        <div style={{ backgroundColor: color }} className={cn("root")}>
            {children}
        </div>
    );
}

type LeftButtonProps = {
    icon: ReactElement;
    linkTo?: string;
    onClick?: () => void;
};

MobileHeader.LeftButton = function LeftButton(props: LeftButtonProps): ReactElement {
    const { icon, linkTo, onClick } = props;
    if (linkTo != null) {
        return (
            <Link className={cn("menu-button")} to={linkTo}>
                {icon}
            </Link>
        );
    }
    if (onClick != null) {
        return (
            <button type="button" className={cn("menu-button")} onClick={onClick}>
                {icon}
            </button>
        );
    }
    return <div className={cn("menu-button")}>{icon}</div>;
};

type RightButtonProps = {
    icon: ReactElement;
    onClick?: () => void;
};

MobileHeader.RightButton = function RightButton({ icon, onClick }: RightButtonProps): ReactElement {
    return (
        <button type="button" onClick={onClick} className={cn("filter-button")}>
            {icon}
        </button>
    );
};

type TitleProps = {
    children: ReactNode;
};

MobileHeader.Title = function Title({ children }: TitleProps): ReactElement {
    return <div className={cn("title")}>{children}</div>;
};

type HeaderInputProps = {
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    onClear: () => void;
};

MobileHeader.HeaderInput = function HeaderInput({
    placeholder,
    value,
    onChange,
    onClear,
}: HeaderInputProps): ReactElement {
    return (
        <div className={cn("header-input")}>
            <div className={cn("header-input-wrapper")}>
                <input
                    className={cn("input")}
                    value={value}
                    onChange={(e) => onChange(e, e.target.value)}
                    placeholder={placeholder}
                />
                <button type="button" className={cn("clear-button")} onClick={onClear}>
                    <IconXRegular16 />
                </button>
            </div>
        </div>
    );
};

type HeaderBlockProps = {
    color?: string;
    children: ReactNode;
};

MobileHeader.HeaderBlock = function HeaderBlock({
    color,
    children,
}: HeaderBlockProps): ReactElement {
    return (
        <div style={{ backgroundColor: color }} className={cn("header")}>
            {children}
        </div>
    );
};

type DetailsBlockProps = {
    children: ReactNode;
};

MobileHeader.DetailsBlock = function DetailsBlock({ children }: DetailsBlockProps): ReactElement {
    return <div className={cn("details")}>{children}</div>;
};
