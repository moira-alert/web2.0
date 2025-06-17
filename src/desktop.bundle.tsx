import React, { ComponentType, Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { HeaderContainer } from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import ErrorContainer from "./Containers/ErrorContainer";
import { getPagePath } from "./Domain/Global";
import { TriggerListProps } from "./pages/trigger-list/trigger-list";
import { TriggerListDesktopProps } from "./pages/trigger-list/trigger-list.desktop";
import { TriggerProps } from "./pages/trigger/trigger";
import { TriggerDesktopProps } from "./pages/trigger/trigger.desktop";
import { AdminRoute } from "./PrivateRoutes/AdminRoute";
import { TeamSettingsPrivateRoute } from "./PrivateRoutes/TeamSettingsPrivateRoute";
import { ChristmasLights } from "./Components/ChristmasLights/ChristmasLights";
import { useAppSelector } from "./store/hooks";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { UIState } from "./store/selectors";

const NoisinessContainer = lazy(() => import("./Containers/NoisinessContainer/NosinessContainer"));
const TriggerEditContainer = lazy(() => import("./Containers/TriggerEditContainer"));
const TriggerDuplicateContainer = lazy(() => import("./Containers/TriggerDuplicateContainer"));
const TriggerAddContainer = lazy(() => import("./Containers/TriggerAddContainer"));
const SettingsContainer = lazy(() => import("./Containers/SettingsContainer"));
const NotificationListContainer = lazy(() => import("./Containers/NotificationListContainer"));
const ContactsContainer = lazy(() => import("./Containers/ContactsContainer"));
const TagListContainer = lazy(() => import("./Containers/TagListContainer"));
const PatternListContainer = lazy(() => import("./Containers/PatternListContainer"));
const TriggerList = lazy(() => import("./pages/trigger-list/trigger-list"));
const AllTeamsContainer = lazy(() => import("./Containers/AllTeamsContainer/AllTeamsContainer"));
const TriggerListDesktop = lazy(() => import("./pages/trigger-list/trigger-list.desktop"));
const SystemSubscriptionsContainer = lazy(() =>
    import("./Containers/SystemSubscriptionsContainer")
);
const TeamsContainer = lazy(() => import("./Containers/TeamsContainer"));
const TriggerDesktop = lazy(() => import("./pages/trigger/trigger.desktop"));
const Trigger = lazy(() => import("./pages/trigger/trigger"));

import styles from "./desktop.module.less";

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
            path: getPagePath("systemSubscriptions"),
            element: (
                <AdminRoute>
                    <SystemSubscriptionsContainer />
                </AdminRoute>
            ),
        },
        {
            path: "*",
            element: <ErrorContainer />,
        },
    ]);

    return (
        <div className={styles.layout}>
            <HeaderContainer className={styles.header} />
            {isChristmasMood && <ChristmasLights />}
            <Suspense fallback={<Spinner className={styles.spinner} caption="Loading" />}>
                {routes}
            </Suspense>
            <Footer className={styles.footer} />
        </div>
    );
}

export default Desktop;
