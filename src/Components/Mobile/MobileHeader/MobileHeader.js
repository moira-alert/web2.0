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
|};

MobileHeader.LeftButton = function LeftButton({ icon, linkTo }: LeftButtonProps): React.Node {
    if (linkTo != null) {
        return (
            <Link className={cn("menu-button")} to={linkTo}>
                <Icon name={icon} />
            </Link>
        );
    }
    return (
        <div className={cn("menu-button")}>
            <Icon name={icon} />
        </div>
    );
};

type RightButtonProps = {||};

MobileHeader.RightButton = function RightButton(props: RightButtonProps): React.Node {
    return (
        <div className={cn("filter-button")}>
            <Icon name="Filter" />
        </div>
    );
};

type TitleProps = {|
    children: React.Node,
|};

MobileHeader.Title = function Title({ children }: TitleProps): React.Node {
    return <div className={cn("title")}>{children}</div>;
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
