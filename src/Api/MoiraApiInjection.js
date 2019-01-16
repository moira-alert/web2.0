// @flow
import * as React from "react";

const ApiContext = React.createContext<>();

function withMoiraApi(Component) {
    return class extends React.Component {
        static displayName = `withApi(${Component.displayName || Component.name || "Component"})`;
        render() {
            return (
                <ApiContext.Consumer>
                    {moiraApi => <Component moiraApi={moiraApi} {...this.props} />}
                </ApiContext.Consumer>
            );
        }
    };
}

export { ApiContext, withMoiraApi };
