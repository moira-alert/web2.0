import React, { ComponentType } from "react";
import { useRoutes } from "react-router-dom";
import MobileErrorContainer from "./Containers/MobileErrorContainer";
import { getPagePath } from "./Domain/Global";
import TriggerList, { TriggerListProps } from "./pages/trigger-list/trigger-list";
import TriggerListMobile, {
    TriggerListMobileProps,
} from "./pages/trigger-list/trigger-list.mobile";
import Trigger, { TriggerProps } from "./pages/trigger/trigger";
import TriggerMobile, { TriggerMobileProps } from "./pages/trigger/trigger.mobile";
import { MobileSettingsPage } from "./Components/Mobile/MobileSettingsPage/MobileSettingsPage";
import { TeamSettingsPrivateRoute } from "./PrivateRoutes/TeamSettingsPrivateRoute";

type ResponsiveRouteProps = {
    container: ComponentType<TriggerListProps> | ComponentType<TriggerProps>;
    view: ComponentType<TriggerListMobileProps> | ComponentType<TriggerMobileProps>;
};

function ResponsiveRoute({ container: Container, view: View }: ResponsiveRouteProps) {
    // @ts-ignore problem with typing view
    return <Container view={View} />;
}

function Mobile(): React.ReactElement | null {
    const routing = useRoutes([
        {
            path: getPagePath("index"),
            element: <ResponsiveRoute container={TriggerList} view={TriggerListMobile} />,
        },
        {
            path: getPagePath("trigger"),
            element: <ResponsiveRoute container={Trigger} view={TriggerMobile} />,
        },
        {
            path: getPagePath("settings"),
            element: <MobileSettingsPage />,
        },
        {
            path: getPagePath("teamSettings"),
            element: <TeamSettingsPrivateRoute Component={MobileSettingsPage} />,
        },
        {
            path: "*",
            element: <MobileErrorContainer />,
        },
    ]);

    return routing;
}

export default Mobile;
