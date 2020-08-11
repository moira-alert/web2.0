import * as React from "react";
import MoiraApi, { IMoiraApi } from "./MoiraApi";

const ApiContext = React.createContext<IMoiraApi>(new MoiraApi("/api"));

export const ApiProvider = ApiContext.Provider;

export function withMoiraApi<ComponentProps extends { moiraApi: IMoiraApi }>(
    Component: React.ComponentType<ComponentProps>
): React.ComponentType<Omit<ComponentProps, "moiraApi">> {
    function ComponentWithApi(props: Omit<ComponentProps, "moiraApi">) {
        const moiraApi = React.useContext(ApiContext);
        return <Component {...props as ComponentProps} moiraApi={moiraApi} />;
    }

    ComponentWithApi.displayName = `withApi(${Component.displayName ||
        Component.name ||
        "Component"})`;
    return ComponentWithApi;
}
