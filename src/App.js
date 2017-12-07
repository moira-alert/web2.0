// @flow
import * as React from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import TriggerListContainer from "./Containers/TriggerListContainer";
import TriggerContainer from "./Containers/TriggerContainer";
import TriggerEditContainer from "./Containers/TriggerEditContainer";
import TriggerAddContainer from "./Containers/TriggerAddContainer";
import SettingsContainer from "./Containers/SettingsContainer";
import NotificationListContainer from "./Containers/NotificationListContainer";
import TagListContainer from "./Containers/TagListContainer";
import PatternListContainer from "./Containers/PatternListContainer";
import MobileTriggerListContainer from "./Containers/MobileTriggerListContainer";
import MobileTriggerContainer from "./Containers/MobileTriggerContainer";
import { getPagePath } from "./Domain/Global";
import { Desktop } from "./Components/Responsive/Responsive";
import cn from "./App.less";

export default function App(): React.Node {
    return (
        <div className={cn("layout")}>
            <Desktop>{x => x && <Header className={cn("header")} />}</Desktop>
            <Desktop>
                {x =>
                    x ? (
                        <Switch>
                            <Route exact path={getPagePath("index")} component={TriggerListContainer} />
                            <Route exact path={getPagePath("triggerAdd")} component={TriggerAddContainer} />
                            <Route exact path={getPagePath("triggerEdit")} component={TriggerEditContainer} />
                            <Route exact path={getPagePath("trigger")} component={TriggerContainer} />
                            <Route exact path={getPagePath("settings")} component={SettingsContainer} />
                            <Route exact path={getPagePath("notifications")} component={NotificationListContainer} />
                            <Route exact path={getPagePath("tags")} component={TagListContainer} />
                            <Route exact path={getPagePath("patterns")} component={PatternListContainer} />
                            <Route render={() => <p>404. Page not found</p>} />
                        </Switch>
                    ) : (
                        <Switch>
                            <Route exact path={getPagePath("index")} component={MobileTriggerListContainer} />
                            <Route exact path={getPagePath("trigger")} component={MobileTriggerContainer} />
                            <Route render={() => <p>404. Page not found</p>} />
                        </Switch>
                    )
                }
            </Desktop>
            <Desktop>{x => x && <Footer className={cn("footer")} />}</Desktop>
        </div>
    );
}
