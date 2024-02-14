import React, { ComponentType } from "react";
import { hot } from "react-hot-loader/root";
import { Switch, Route } from "react-router-dom";
import MobileErrorContainer from "./Containers/MobileErrorContainer";
import { getPageLink, getPagePath } from "./Domain/Global";
import ArrowChevronLeftIcon from "@skbkontur/react-icons/ArrowChevronLeft";
import TriggerList, { TriggerListProps } from "./pages/trigger-list/trigger-list";
import TriggerListMobile, {
    TriggerListMobileProps,
} from "./pages/trigger-list/trigger-list.mobile";
import Trigger, { TriggerProps } from "./pages/trigger/trigger";
import TriggerMobile, { TriggerMobileProps } from "./pages/trigger/trigger.mobile";
import SettingsContainer from "./Containers/SettingsContainer";
import MobileHeader from "./Components/Mobile/MobileHeader/MobileHeader";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";

type ResponsiveRouteProps = {
    exact?: boolean;
    path: string;
    container:
        | ComponentType<Omit<TriggerListProps, "moiraApi">>
        | ComponentType<Omit<TriggerProps, "moiraApi">>;
    view: ComponentType<TriggerListMobileProps> | ComponentType<TriggerMobileProps>;
};

function ResponsiveRoute({ container: Container, view: View, ...rest }: ResponsiveRouteProps) {
    // @ts-ignore problem with typing view
    return <Route {...rest} render={(props) => <Container {...props} view={View} />} />;
}

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

            <>
                <MobileHeader>
                    <Sticky side="top">
                        <MobileHeader.HeaderBlock>
                            <MobileHeader.LeftButton
                                icon={<ArrowChevronLeftIcon />}
                                linkTo={getPageLink("index")}
                            />
                            <MobileHeader.Title>Moira: Settings</MobileHeader.Title>
                        </MobileHeader.HeaderBlock>
                    </Sticky>
                </MobileHeader>
                <Route exact path={getPagePath("settings")} component={SettingsContainer} />
            </>

            <Route component={MobileErrorContainer} />
        </Switch>
    );
}

export default hot(Mobile);
