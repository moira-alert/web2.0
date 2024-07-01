import React, { ComponentType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import type { TPatternListContainerProps } from "../Containers/PatternListContainer";
import { getPagePath } from "../Domain/Global";
import { useGetUserQuery } from "../services/UserApi";
import { EUserRoles } from "../Domain/User";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import classNames from "classnames/bind";

import styles from "../../local_modules/styles/mixins.less";

const cn = classNames.bind(styles);

type PrivateRouteProps = RouteProps & {
    component: ComponentType<TPatternListContainerProps | object>;
    exact?: boolean;
    path: string;
};

export const AdminRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const { data: user, isLoading } = useGetUserQuery();

    if (isLoading) {
        return <Loader className={cn("loader")} active={isLoading} caption="Authorization" />;
    }

    if (!user?.auth_enabled) {
        return <Route {...rest} render={(props) => <Component {...props} />} />;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                user && user.role === EUserRoles.Admin ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: getPagePath("index") }} />
                )
            }
        />
    );
};
