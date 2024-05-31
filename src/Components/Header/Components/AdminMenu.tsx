import React, { FC } from "react";
import { DropdownMenu } from "@skbkontur/react-ui";
import Crown from "@skbkontur/react-icons/Crown";
import { LinkMenuItem } from "../../TriggerInfo/Components/LinkMenuItem";
import { getPageLink } from "../../../Domain/Global";
import { useGetUserQuery } from "../../../services/UserApi";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { UserRoles } from "../../../Domain/User";
import classNames from "classnames/bind";

import styles from "./AdminMenu.less";

const cn = classNames.bind(styles);

export const AdminMenu: FC = () => {
    const { data: user, isLoading: isUserLoading } = useGetUserQuery();

    const isAdminMenuEnabled = user?.auth_enabled && user.role === UserRoles.Admin;

    return (
        <>
            {isUserLoading ? (
                <Spinner type={"mini"} dimmed caption="" />
            ) : (
                isAdminMenuEnabled && (
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
                        <LinkMenuItem link={getPageLink("notifications")}>Notifier</LinkMenuItem>
                        <LinkMenuItem link={getPageLink("tags")}>Tags</LinkMenuItem>
                    </DropdownMenu>
                )
            )}
        </>
    );
};
