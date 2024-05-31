import React, { ComponentType } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
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
import classNames from "classnames/bind";
import TriggerList, { TriggerListProps } from "./pages/trigger-list/trigger-list";
import TriggerListDesktop, {
    TriggerListDesktopProps,
} from "./pages/trigger-list/trigger-list.desktop";
import Trigger, { TriggerProps } from "./pages/trigger/trigger";
import TriggerDesktop, { TriggerDesktopProps } from "./pages/trigger/trigger.desktop";
import TeamsContainer from "./Containers/TeamsContainer";
import { useGetUserQuery } from "./services/UserApi";
import { Loader } from "@skbkontur/react-ui/components/Loader";

import styles from "./desktop.less";

const cn = classNames.bind(styles);

type ResponsiveRouteProps = {
    exact?: boolean;
    path: string;
    container:
        | ComponentType<Omit<TriggerListProps, "moiraApi">>
        | ComponentType<Omit<TriggerProps, "moiraApi">>;
    view: ComponentType<TriggerListDesktopProps> | ComponentType<TriggerDesktopProps>;
};

function ResponsiveRoute({ container: Container, view: View, ...rest }: ResponsiveRouteProps) {
    // @ts-ignore problem with typing view
    return <Route {...rest} render={(props) => <Container {...props} view={View} />} />;
}
interface PrivateRouteProps {
    children: React.ReactNode;
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, ...rest }) => {
    const { data: user, isLoading } = useGetUserQuery();

    if (isLoading) {
        return <Loader className={cn("loader")} active={isLoading} caption="Authorization" />;
    }

    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (!user?.auth_enabled) {
                    return children;
                }

                return user.role === "admin" ? (
                    children
                ) : (
                    <Redirect to={{ pathname: getPagePath("index"), state: { from: location } }} />
                );
            }}
        />
    );
};

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
                <Route exact path={getPagePath("teams")} component={TeamsContainer} />
                <PrivateRoute>
                    <Route
                        exact
                        path={getPagePath("notifications")}
                        component={NotificationListContainer}
                    />
                    <Route exact path={getPagePath("tags")} component={TagListContainer} />
                    <Route exact path={getPagePath("patterns")} component={PatternListContainer} />
                </PrivateRoute>
                <Route component={ErrorContainer} />
            </Switch>
            <Footer className={cn("footer")} />
        </div>
    );
}

export default hot(Desktop);
