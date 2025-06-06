import React from "react";
import { Navigate } from "react-router-dom";
import { getPagePath } from "../Domain/Global";
import { useGetUserQuery } from "../services/UserApi";
import { EUserRoles } from "../Domain/User";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import classNames from "classnames/bind";

import styles from "../../local_modules/styles/mixins.less";

const cn = classNames.bind(styles);

type AdminRouteProps = {
    children: React.ReactNode;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { data: user, isLoading } = useGetUserQuery();

    if (isLoading) {
        return <Loader className={cn("loader")} active caption="Authorization" />;
    }

    if (!user?.auth_enabled || user.role === EUserRoles.Admin) {
        return <>{children}</>;
    }

    return <Navigate to={getPagePath("index")} replace />;
};
