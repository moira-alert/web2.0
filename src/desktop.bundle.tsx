import React, { ComponentType } from "react";
import { Switch, Route, Redirect, RouteProps } from "react-router-dom";
import { hot } from "react-hot-loader/root";
import HeaderContainer from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import TriggerEditContainer from "./Containers/TriggerEditContainer";
import TriggerDuplicateContainer from "./Containers/TriggerDuplicateContainer";
import TriggerAddContainer from "./Containers/TriggerAddContainer";
import SettingsContainer from "./Containers/SettingsContainer";
import NotificationListContainer from "./Containers/NotificationListContainer";
import ContactsContainer from "./Containers/ContactsContainer";
import TagListContainer from "./Containers/TagListContainer";
import PatternListContainer, {
    TPatternListContainerProps,
} from "./Containers/PatternListContainer";
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
import { EUserRoles } from "./Domain/User";
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

type PrivateRouteProps = RouteProps & {
    component: ComponentType<TPatternListContainerProps | object>;
    exact?: boolean;
    path: string;
};

const PrivateRoute = ({ component: Component, ...rest }: PrivateRouteProps) => {
    const { data: user, isLoading } = useGetUserQuery({ handleLoadingLocally: true });

    if (isLoading) {
        return <Loader className={cn("loader")} active={isLoading} caption="Authorization" />;
    }

    return (
        <Route
            {...rest}
            render={(props) =>
                user && (!user.auth_enabled || user.role === EUserRoles.Admin) ? (
                    // @ts-ignore problem with typing props
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: getPagePath("index") }} />
                )
            }
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
                <PrivateRoute
                    exact
                    path={getPagePath("notifications")}
                    component={NotificationListContainer}
                />
                <PrivateRoute exact path={getPagePath("tags")} component={TagListContainer} />
                <PrivateRoute
                    exact
                    path={getPagePath("patterns")}
                    component={PatternListContainer}
                />
                <PrivateRoute exact path={getPagePath("contacts")} component={ContactsContainer} />
                <Route component={ErrorContainer} />
            </Switch>
            <Footer className={cn("footer")} />
        </div>
    );
}

export default hot(Desktop);
