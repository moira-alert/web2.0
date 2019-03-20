// @flow
import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Switch, Route } from "react-router-dom";
import MobileErrorContainer from "./Containers/MobileErrorContainer";
import { getPagePath } from "./Domain/Global";

import TriggerList from "./pages/trigger-list/trigger-list";
import TriggerListMobile from "./pages/trigger-list/trigger-list.mobile";

import Trigger from "./pages/trigger/trigger";
import TriggerMobile from "./pages/trigger/trigger.mobile";

const ResponsiveRoute = ({ container: Container, view: View, component: Component, ...rest }) => (
    <Route {...rest} render={props => <Container {...props} view={View} />} />
);

function Mobile() {
    return (
        <Switch>
            <ResponsiveRoute
                exact
                path={getPagePath("index")}
                container={TriggerList}
                view={TriggerListMobile}
            />
            <ResponsiveRoute
                exact
                path={getPagePath("trigger")}
                container={Trigger}
                view={TriggerMobile}
            />
            <Route component={MobileErrorContainer} />
        </Switch>
    );
}

export default hot(Mobile);
