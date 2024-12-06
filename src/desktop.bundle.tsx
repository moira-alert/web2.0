import React, { ComponentType } from "react";
import { Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";
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
import { TeamContainer } from "./Containers/TeamContainer";
import { TeamSettingsPrivateRoute } from "./PrivateRoutes/TeamSettingsPrivateRoute";
import AllTeamsContainer from "./Containers/AllTeamsContainer/AllTeamsContainer";
import { ChristmasLights } from "./Components/ChristmasLights/ChristmasLights";
import { useAppSelector } from "./store/hooks";
import { UIState } from "./store/selectors";

import styles from "./desktop.less";

const cn = classNames.bind(styles);

type ResponsiveRouteProps = {
    exact?: boolean;
    path: string;
    container: ComponentType<TriggerListProps> | ComponentType<TriggerProps>;
    view: ComponentType<TriggerListDesktopProps> | ComponentType<TriggerDesktopProps>;
};

function ResponsiveRoute({ container: Container, view: View, ...rest }: ResponsiveRouteProps) {
    // @ts-ignore problem with typing view
    return <Route {...rest} render={(props) => <Container {...props} view={View} />} />;
}

function Desktop() {
    const { isChristmasMood } = useAppSelector(UIState);

    return (
        <div className={cn("layout")}>
            <HeaderContainer className={cn("header")} />
            {isChristmasMood && <ChristmasLights />}
            <Switch>
                <ResponsiveRoute
                    exact
                    path={getPagePath("index")}
                    container={TriggerList}
                    view={TriggerListDesktop}
                />
                <Route exact path={getPagePath("triggerAdd")} component={TriggerAddContainer} />
                <Route
                    exact
                    path={getPagePath("triggerDuplicate")}
                    component={TriggerDuplicateContainer}
                />
                <Route exact path={getPagePath("triggerEdit")} component={TriggerEditContainer} />
                <ResponsiveRoute
                    exact
                    path={getPagePath("trigger")}
                    container={Trigger}
                    view={TriggerDesktop}
                />
                <TeamSettingsPrivateRoute
                    exact
                    path={getPagePath("teamSettings")}
                    component={SettingsContainer}
                />
                <Route exact path={getPagePath("settings")} component={SettingsContainer} />
                <Route exact path={getPagePath("teams")} component={TeamsContainer} />
                <AdminRoute exact path={getPagePath("allTeams")} component={AllTeamsContainer} />
                <AdminRoute exact path={getPagePath("team")} component={TeamContainer} />
                <AdminRoute
                    exact
                    path={getPagePath("notifications")}
                    component={NotificationListContainer}
                />
                <AdminRoute exact path={getPagePath("tags")} component={TagListContainer} />
                <AdminRoute exact path={getPagePath("patterns")} component={PatternListContainer} />
                <AdminRoute exact path={getPagePath("contacts")} component={ContactsContainer} />
                <Route component={ErrorContainer} />
            </Switch>
            <Footer className={cn("footer")} />
        </div>
    );
}

export default hot(Desktop);
