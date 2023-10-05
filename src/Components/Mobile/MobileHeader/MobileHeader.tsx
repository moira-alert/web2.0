import * as React from "react";
import { Link } from "react-router-dom";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import classNames from "classnames/bind";

import styles from "./MobileHeader.less";

const cn = classNames.bind(styles);

type Props = {
    color?: string;
    children: React.ReactNode;
};

export default function MobileHeader({ color, children }: Props): React.ReactElement {
    return (
        <div style={{ backgroundColor: color }} className={cn("root")}>
            {children}
        </div>
    );
}

type LeftButtonProps = {
    icon: React.ReactElement;
    linkTo?: string;
    onClick?: () => void;
};

MobileHeader.LeftButton = function LeftButton(props: LeftButtonProps): React.ReactElement {
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
    icon: React.ReactElement;
    onClick?: () => void;
};

MobileHeader.RightButton = function RightButton({
    icon,
    onClick,
}: RightButtonProps): React.ReactElement {
    return (
        <button type="button" onClick={onClick} className={cn("filter-button")}>
            {icon}
        </button>
    );
};

type TitleProps = {
    children: React.ReactNode;
};

MobileHeader.Title = function Title({ children }: TitleProps): React.ReactElement {
    return <div className={cn("title")}>{children}</div>;
};

type HeaderInputProps = {
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
    onClear: () => void;
};

MobileHeader.HeaderInput = function HeaderInput({
    placeholder,
    value,
    onChange,
    onClear,
}: HeaderInputProps): React.ReactElement {
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
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
};

type HeaderBlockProps = {
    color?: string;
    children: React.ReactNode;
};

MobileHeader.HeaderBlock = function HeaderBlock({
    color,
    children,
}: HeaderBlockProps): React.ReactElement {
    return (
        <div style={{ backgroundColor: color }} className={cn("header")}>
            {children}
        </div>
    );
};

type DetailsBlockProps = {
    children: React.ReactNode;
};

MobileHeader.DetailsBlock = function DetailsBlock({
    children,
}: DetailsBlockProps): React.ReactElement {
    return <div className={cn("details")}>{children}</div>;
};
