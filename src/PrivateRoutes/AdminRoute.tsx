import React from "react";
import { Navigate } from "react-router-dom";
import { getPagePath } from "../Domain/Global";
import { useGetUserQuery } from "../services/UserApi";
import { EUserRoles } from "../Domain/User";
import { Loader } from "@skbkontur/react-ui/components/Loader";

import styles from "~styles/mixins.module.less";

type AdminRouteProps = {
    children: React.ReactNode;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { data: user, isLoading } = useGetUserQuery();

    if (isLoading) {
        return <Loader className={styles.loader} active={isLoading} caption="Authorization" />;
    }

    if (!user?.auth_enabled || user.role === EUserRoles.Admin) {
        return <>{children}</>;
    }

    return <Navigate to={getPagePath("index")} replace />;
};
