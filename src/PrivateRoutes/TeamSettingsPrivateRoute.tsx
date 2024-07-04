import React, { ComponentType } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { getPagePath } from "../Domain/Global";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import { ISettingsContainerProps } from "../Containers/SettingsContainer";
import { useTeamSettingsAvailable } from "../hooks/useTeamSettingsAvailable";
import classNames from "classnames/bind";

import styles from "../../local_modules/styles/mixins.less";

const cn = classNames.bind(styles);

type PrivateRouteProps = {
    component: ComponentType<ISettingsContainerProps>;
    exact?: boolean;
    path: string;
};

export const TeamSettingsPrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const location = useLocation();
    const teamId = location.pathname.split("/").pop() || "";

    const { isAuthorizing, isTeamAvailable, isTeamMember } = useTeamSettingsAvailable(teamId);

    if (isAuthorizing) {
        return <Loader className={cn("loader")} active={isAuthorizing} caption="Authorization" />;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                isTeamAvailable ? (
                    <Component isTeamMember={!!isTeamMember} {...props} />
                ) : (
                    <Redirect to={{ pathname: getPagePath("index") }} />
                )
            }
        />
    );
};
