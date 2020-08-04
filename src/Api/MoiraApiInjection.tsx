import { $Diff } from "utility-types";

import * as React from "react";
import { IMoiraApi } from "./MoiraApi";

const ApiContext = React.createContext<IMoiraApi | void>();

export const ApiProvider = ApiContext.Provider;

export function withMoiraApi<Config extends {}>(Component: React.AbstractComponent<Config>): React.AbstractComponent<$Diff<Config, {moiraApi: IMoiraApi | void;}>> {
  return class extends React.Component<$Diff<Config, {moiraApi: IMoiraApi | void;}>> {

    context: IMoiraApi;

    static displayName = `withApi(${Component.displayName || Component.name || "Component"})`;

    render(): React.ReactElement<typeof Component> {
      return <Component moiraApi={this.context} {...this.props} />;
    }

    static contextType = ApiContext;
  };
}