// @flow
import * as React from "react";

const ApiContext = React.createContext();

export const ApiProvider = ApiContext.Provider;

export function withMoiraApi(Component) {
    class WrapperComponent extends React.Component {
        static displayName = `withApi(${Component.displayName || Component.name || "Component"})`;
        render() {
            return <Component moiraApi={this.context} {...this.props} />;
        }
    }
    WrapperComponent.contextType = ApiContext;
    return WrapperComponent;
}
