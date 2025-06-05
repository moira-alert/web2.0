import React, { ComponentType } from "react";
import { useRoutes } from "react-router-dom";
import { HeaderContainer } from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import TriggerEditContainer from "./Containers/TriggerEditContainer";
import TriggerDuplicateContainer from "./Containers/TriggerDuplicateContainer";
import TriggerAddContainer from "./Containers/TriggerAddContainer";
import SettingsContainer from "./Containers/SettingsContainer";
import NotificationListContainer from "./Containers/NotificationListContainer";
import ContactsContainer from "./Containers/ContactsContainer";
import TagListContainer from "./Containers/TagListContainer";
import PatternListContainer from "./Containers/PatternListContainer";
import ErrorContainer from "./Containers/ErrorContainer";
import { getPagePath } from "./Domain/Global";
import classNames from "classnames/bind";
import TriggerList, { TriggerListProps } from "./pages/trigger-list/trigger-list";
import TriggerListDesktop, {
    TriggerListDesktopProps,
} from "./pages/trigger-list/trigger-list.desktop";
import Trigger, { TriggerProps } from "./pages/trigger/trigger";
import TriggerDesktop, { TriggerDesktopProps } from "./pages/trigger/trigger.desktop";
import { AdminRoute } from "./PrivateRoutes/AdminRoute";
import TeamsContainer from "./Containers/TeamsContainer";
import { TeamSettingsPrivateRoute } from "./PrivateRoutes/TeamSettingsPrivateRoute";
import AllTeamsContainer from "./Containers/AllTeamsContainer/AllTeamsContainer";
import { ChristmasLights } from "./Components/ChristmasLights/ChristmasLights";
import { useAppSelector } from "./store/hooks";
import { NoisinessContainer } from "./Containers/NoisinessContainer/NosinessContainer";
import { UIState } from "./store/selectors";

import styles from "./desktop.less";

const cn = classNames.bind(styles);

type ResponsiveRouteProps = {
    container: ComponentType<TriggerListProps> | ComponentType<TriggerProps>;
    view: ComponentType<TriggerListDesktopProps> | ComponentType<TriggerDesktopProps>;
};

function ResponsiveRoute({ container: Container, view: View }: ResponsiveRouteProps) {
    // @ts-ignore problem with typing view
    return <Container view={View} />;
}

function Desktop() {
    const { isChristmasMood } = useAppSelector(UIState);

    const routes = useRoutes([
        {
            path: getPagePath("index"),
            element: <ResponsiveRoute container={TriggerList} view={TriggerListDesktop} />,
        },
        {
            path: getPagePath("triggerAdd"),
            element: <TriggerAddContainer />,
        },
        {
            path: getPagePath("triggerDuplicate"),
            element: <TriggerDuplicateContainer />,
        },
        {
            path: getPagePath("triggerEdit"),
            element: <TriggerEditContainer />,
        },
        {
            path: getPagePath("trigger"),
            element: <ResponsiveRoute container={Trigger} view={TriggerDesktop} />,
        },
        {
            path: getPagePath("teamSettings"),
            element: <TeamSettingsPrivateRoute Component={SettingsContainer} />,
        },
        {
            path: getPagePath("settings"),
            element: <SettingsContainer />,
        },
        {
            path: getPagePath("teams"),
            element: <TeamsContainer />,
        },
        {
            path: getPagePath("allTeams"),
            element: (
                <AdminRoute>
                    <AllTeamsContainer />
                </AdminRoute>
            ),
        },
        {
            path: getPagePath("notifications"),
            element: (
                <AdminRoute>
                    <NotificationListContainer />
                </AdminRoute>
            ),
        },
        {
            path: getPagePath("tags"),
            element: (
                <AdminRoute>
                    <TagListContainer />
                </AdminRoute>
            ),
        },
        {
            path: getPagePath("patterns"),
            element: (
                <AdminRoute>
                    <PatternListContainer />
                </AdminRoute>
            ),
        },
        {
            path: getPagePath("contacts"),
            element: (
                <AdminRoute>
                    <ContactsContainer />
                </AdminRoute>
            ),
        },
        {
            path: getPagePath("noisiness"),
            element: (
                <AdminRoute>
                    <NoisinessContainer />
                </AdminRoute>
            ),
        },
        {
            path: "*",
            element: <ErrorContainer />,
        },
    ]);

    return (
        <div className={cn("layout")}>
            <HeaderContainer className={cn("header")} />
            {isChristmasMood && <ChristmasLights />}
            {routes}
            <Footer className={cn("footer")} />
        </div>
    );
}

export default Desktop;
