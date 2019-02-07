// @noflow
/* eslint-disable */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import MobileTriggerListContainer from "./Containers/MobileTriggerListContainer";
import MobileTriggerContainer from "./Containers/MobileTriggerContainer";
import { getPagePath } from "./Domain/Global";

class Mobile extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path={getPagePath("index")} component={MobileTriggerListContainer} />
                <Route exact path={getPagePath("trigger")} component={MobileTriggerContainer} />
                <Route render={() => <p>404. Page not found</p>} />
            </Switch>
        );
    }
}

export { Mobile };
