import React, { FC } from "react";
import { DropdownMenu } from "@skbkontur/react-ui";
import Crown from "@skbkontur/react-icons/Crown";
import { LinkMenuItem } from "../../TriggerInfo/Components/LinkMenuItem";
import { getPageLink } from "../../../Domain/Global";
import { useGetSettingsQuery } from "../../../services/ReusableApi";
import classNames from "classnames/bind";

import styles from "./AdminMenu.less";

const cn = classNames.bind(styles);

export const AdminMenu: FC = () => {
    const { data: auth } = useGetSettingsQuery();

    return (
        <>
            {auth?.auth_enabled && auth.role === "admin" && (
                <DropdownMenu
                    caption={
                        <>
                            <Crown />
                            &nbsp;
                            <button className={cn("admin-button")}>Admin</button>
                        </>
                    }
                >
                    <LinkMenuItem link={getPageLink("patterns")}>Patterns</LinkMenuItem>
                    <LinkMenuItem link={getPageLink("notifications")}>Notifications</LinkMenuItem>
                    <LinkMenuItem link={getPageLink("tags")}>Tags</LinkMenuItem>
                </DropdownMenu>
            )}
        </>
    );
};
