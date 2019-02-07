// @noflow
/* eslint-disable */
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import HeaderContainer from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import TriggerListContainer from "./Containers/TriggerListContainer";
import TriggerContainer from "./Containers/TriggerContainer";
import TriggerEditContainer from "./Containers/TriggerEditContainer";
import TriggerDuplicateContainer from "./Containers/TriggerDuplicateContainer";
import TriggerAddContainer from "./Containers/TriggerAddContainer";
import SettingsContainer from "./Containers/SettingsContainer";
import NotificationListContainer from "./Containers/NotificationListContainer";
import TagListContainer from "./Containers/TagListContainer";
import PatternListContainer from "./Containers/PatternListContainer";
import { getPagePath } from "./Domain/Global";
import cn from "./App.less";

class Desktop extends React.Component {
    render() {
        return (
            <div className={cn("layout")}>
                <HeaderContainer className={cn("header")} />
                <Switch>
                    <Route exact path={getPagePath("index")} component={TriggerListContainer} />
                    <Route exact path={getPagePath("triggerAdd")} component={TriggerAddContainer} />
                    <Route
                        exact
                        path={getPagePath("triggerDuplicate")}
                        component={TriggerDuplicateContainer}
                    />
                    <Route
                        exact
                        path={getPagePath("triggerEdit")}
                        component={TriggerEditContainer}
                    />
                    <Route exact path={getPagePath("trigger")} component={TriggerContainer} />
                    <Route exact path={getPagePath("settings")} component={SettingsContainer} />
                    <Route
                        exact
                        path={getPagePath("notifications")}
                        component={NotificationListContainer}
                    />
                    <Route exact path={getPagePath("tags")} component={TagListContainer} />
                    <Route exact path={getPagePath("patterns")} component={PatternListContainer} />
                    <Route render={() => <p>404. Page not found</p>} />
                </Switch>
                <Footer className={cn("footer")} />
            </div>
        );
    }
}

export { Desktop };
