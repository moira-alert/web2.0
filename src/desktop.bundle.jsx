// @flow
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import HeaderContainer from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import TriggerEditContainer from "./Containers/TriggerEditContainer";
import TriggerDuplicateContainer from "./Containers/TriggerDuplicateContainer";
import TriggerAddContainer from "./Containers/TriggerAddContainer";
import SettingsContainer from "./Containers/SettingsContainer";
import NotificationListContainer from "./Containers/NotificationListContainer";
import TagListContainer from "./Containers/TagListContainer";
import PatternListContainer from "./Containers/PatternListContainer";
import ErrorContainer from "./Containers/ErrorContainer";
import { getPagePath } from "./Domain/Global";
import cn from "./desktop.less";

import TriggerList from "./pages/trigger-list/trigger-list";
import TriggerListDesktop from "./pages/trigger-list/trigger-list.desktop";

import Trigger from "./pages/trigger/trigger";
import TriggerDesktop from "./pages/trigger/trigger.desktop";

const ResponsiveRoute = ({ container: Container, view: View, component: Component, ...rest }) => (
    <Route {...rest} render={props => <Container {...props} view={View} />} />
);

function Desktop() {
    return (
        <div className={cn("layout")}>
            <HeaderContainer className={cn("header")} />
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
                <Route exact path={getPagePath("settings")} component={SettingsContainer} />
                <Route
                    exact
                    path={getPagePath("notifications")}
                    component={NotificationListContainer}
                />
                <Route exact path={getPagePath("tags")} component={TagListContainer} />
                <Route exact path={getPagePath("patterns")} component={PatternListContainer} />
                <Route component={ErrorContainer} />
            </Switch>
            <Footer className={cn("footer")} />
        </div>
    );
}

export default hot(Desktop);
