import React, { ComponentType } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { getPagePath } from "../Domain/Global";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import { ISettingsContainerProps } from "../Containers/SettingsContainer";
import { useTeamSettingsAvailable } from "../hooks/useTeamSettingsAvailable";
import classNames from "classnames/bind";

import styles from "../../local_modules/styles/mixins.less";

const cn = classNames.bind(styles);

type TeamSettingsPrivateRouteProps = {
    Component: ComponentType<ISettingsContainerProps>;
};

export const TeamSettingsPrivateRoute = ({ Component }: TeamSettingsPrivateRouteProps) => {
    const location = useLocation();
    const teamId = location.pathname.split("/").pop() || "";

    const { isAuthorizing, isTeamAvailable, isTeamMember } = useTeamSettingsAvailable(teamId);

    if (isAuthorizing) {
        return <Loader className={cn("loader")} active caption="Authorization" />;
    }

    if (!isTeamAvailable) {
        return <Navigate to={getPagePath("index")} replace />;
    }

    return <Component isTeamMember={!!isTeamMember} />;
};
