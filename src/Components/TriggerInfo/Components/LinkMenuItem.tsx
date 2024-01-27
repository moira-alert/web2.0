import React from "react";
import { Link } from "@skbkontur/react-ui/components/Link";
import { MenuItem } from "@skbkontur/react-ui";

interface ILinkMenuItemProps {
    link?: string;
    icon?: React.ReactElement;
    onClick?: () => void;
    children: React.ReactElement | string;
}

export const LinkMenuItem = ({ link, icon, onClick, children }: ILinkMenuItemProps) => {
    return (
        <MenuItem
            href={link}
            component={({ href, ...rest }) => {
                return (
                    <Link
                        onClick={onClick}
                        icon={icon}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={href}
                        {...rest}
                    />
                );
            }}
        >
            {children}
        </MenuItem>
    );
};
