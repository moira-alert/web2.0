// @flow
import * as React from "react";
import { hot } from "react-hot-loader/root";
import { Switch, Route } from "react-router-dom";
import MobileTriggerListContainer from "./Containers/MobileTriggerListContainer";
import MobileTriggerContainer from "./Containers/MobileTriggerContainer";
import { getPagePath } from "./Domain/Global";

function Mobile() {
    return (
        <Switch>
            <Route exact path={getPagePath("index")} component={MobileTriggerListContainer} />
            <Route exact path={getPagePath("trigger")} component={MobileTriggerContainer} />
            <Route render={() => <p>404. Page not found</p>} />
        </Switch>
    );
}

export default hot(Mobile);
