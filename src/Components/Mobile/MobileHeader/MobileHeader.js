// @flow
import * as React from "react";
import Icon from "retail-ui/components/Icon";
import { Link } from "react-router-dom";

import cn from "./MobileHeader.less";

type Props = {|
    color?: string,
    children: React.Node,
|};

export default function MobileHeader({ color, children }: Props): React.Node {
    return (
        <div style={{ backgroundColor: color }} className={cn("root")}>
            {children}
        </div>
    );
}

type LeftButtonProps = {|
    icon: string,
    linkTo?: string,
    onClick?: () => void,
|};

MobileHeader.LeftButton = function LeftButton({ icon, onClick, linkTo }: LeftButtonProps): React.Node {
    if (linkTo != null) {
        return (
            <Link className={cn("menu-button")} to={linkTo}>
                <Icon name={icon} />
            </Link>
        );
    }
    if (onClick != null) {
        return (
            <a
                className={cn("menu-button")}
                href="#"
                onClick={() => {
                    onClick();
                    return false;
                }}>
                <Icon name={icon} />
            </a>
        );
    }
    return (
        <div className={cn("menu-button")}>
            <Icon name={icon} />
        </div>
    );
};

type RightButtonProps = {|
    icon: string,
    onClick?: () => void,
|};

MobileHeader.RightButton = function RightButton({ icon, onClick }: RightButtonProps): React.Node {
    return (
        <div onClick={onClick} className={cn("filter-button")}>
            <Icon name={icon} />
        </div>
    );
};

type TitleProps = {|
    children: React.Node,
|};

MobileHeader.Title = function Title({ children }: TitleProps): React.Node {
    return <div className={cn("title")}>{children}</div>;
};

type HeaderInputProps = {|
    placeholder?: ?string,
    value: string,
    onChange: (e: SyntheticKeyboardEvent<HTMLInputElement>, value: string) => void,
    onClear: () => void,
|};

MobileHeader.HeaderInput = function HeaderInput({
    placeholder,
    value,
    onChange,
    onClear,
}: HeaderInputProps): React.Node {
    return (
        <div className={cn("header-input")}>
            <div className={cn("header-input-wrapper")}>
                <input
                    className={cn("input")}
                    value={value}
                    onChange={e => onChange(e, e.target.value)}
                    placeholder={placeholder}
                />
                <div className={cn("clear-button")} onClick={onClear}>
                    <Icon name="Delete" />
                </div>
            </div>
        </div>
    );
};

type HeaderBlockProps = {|
    color?: string,
    children: React.Node,
|};

MobileHeader.HeaderBlock = function HeaderBlock({ color, children }: HeaderBlockProps): React.Node {
    return (
        <div style={{ backgroundColor: color }} className={cn("header")}>
            {children}
        </div>
    );
};

type DetailsBlockProps = {|
    children: React.Node,
|};

MobileHeader.DetailsBlock = function DetailsBlock({ children }: DetailsBlockProps): React.Node {
    return <div className={cn("details")}>{children}</div>;
};
