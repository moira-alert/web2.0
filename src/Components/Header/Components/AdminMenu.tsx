import React, { FC } from "react";
import { DropdownMenu, MenuItem } from "@skbkontur/react-ui";
import Crown from "@skbkontur/react-icons/Crown";
import { getPageLink } from "../../../Domain/Global";
import { useGetUserQuery } from "../../../services/UserApi";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { EUserRoles } from "../../../Domain/User";
import classNames from "classnames/bind";

import styles from "./AdminMenu.module.less";

const cn = classNames.bind(styles);

export const AdminMenu: FC = () => {
    const { data: user, isLoading: isUserLoading } = useGetUserQuery();

    const isAdminMenuEnabled = user?.auth_enabled && user.role === EUserRoles.Admin;

    if (isUserLoading) {
        return <Spinner type={"mini"} dimmed caption="" />;
    }

    if (!isAdminMenuEnabled) {
        return null;
    }

    return (
        <DropdownMenu
            caption={
                <>
                    <Crown />
                    &nbsp;
                    <button className={cn("admin-button")}>Admin</button>
                </>
            }
        >
            <MenuItem href={getPageLink("systemSubscriptions")}>System Subscriptions</MenuItem>
            <MenuItem href={getPageLink("allTeams")}>All Teams</MenuItem>
            <MenuItem href={getPageLink("noisiness")}>Noisiness</MenuItem>
            <MenuItem href={getPageLink("contacts")}>Contacts</MenuItem>
            <MenuItem href={getPageLink("patterns")}>Patterns</MenuItem>
            <MenuItem href={getPageLink("notifications")}>Notifier</MenuItem>
            <MenuItem href={getPageLink("tags")}>Tags</MenuItem>
        </DropdownMenu>
    );
};
