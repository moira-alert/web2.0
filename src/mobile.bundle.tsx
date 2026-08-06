import type { ReactElement } from "react";
import { ComponentType, Suspense, lazy } from "react";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { useRoutes } from "react-router";
import MobileErrorContainer from "./Containers/MobileErrorContainer";
import { getPagePath } from "./Domain/Global";
import { TriggerListProps } from "./pages/trigger-list/trigger-list";
import TriggerListMobile, {
    TriggerListMobileProps,
} from "./pages/trigger-list/trigger-list.mobile";
import { TriggerProps } from "./pages/trigger/trigger";
import TriggerMobile, { TriggerMobileProps } from "./pages/trigger/trigger.mobile";
import { MobileSettingsPage } from "./Components/Mobile/MobileSettingsPage/MobileSettingsPage";
import { TeamSettingsPrivateRoute } from "./PrivateRoutes/TeamSettingsPrivateRoute";

const TriggerList = lazy(() => import("./pages/trigger-list/trigger-list"));
const Trigger = lazy(() => import("./pages/trigger/trigger"));

type ResponsiveRouteProps = {
    container: ComponentType<TriggerListProps> | ComponentType<TriggerProps>;
    view: ComponentType<TriggerListMobileProps> | ComponentType<TriggerMobileProps>;
};

function ResponsiveRoute({ container: Container, view: View }: ResponsiveRouteProps) {
    return (
        <Suspense fallback={<Spinner caption="Loading" />}>
            {/* @ts-ignore problem with typing view */}
            <Container view={View} />
        </Suspense>
    );
}

function Mobile(): ReactElement | null {
    const routing = useRoutes([
        {
            path: getPagePath("index"),
            element: <ResponsiveRoute container={TriggerList} view={TriggerListMobile} />,
        },
        {
            path: getPagePath("trigger"),
            element: <ResponsiveRoute container={Trigger} view={TriggerMobile} />,
        },
        {
            path: getPagePath("settings"),
            element: <MobileSettingsPage />,
        },
        {
            path: getPagePath("teamSettings"),
            element: <TeamSettingsPrivateRoute Component={MobileSettingsPage} />,
        },
        {
            path: "*",
            element: <MobileErrorContainer />,
        },
    ]);

    return routing;
}

export default Mobile;
