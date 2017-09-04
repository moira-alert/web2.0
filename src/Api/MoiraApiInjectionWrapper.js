// @flow
import React from 'react';
import PropTypes from 'prop-types';

type FunctionComponent<P> = (props: P) => ?React$Element<any>;
type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;
type WithApiWrapper = <P, S>(
    Component: ClassComponent<void, P, S> | FunctionComponent<P>
) => ClassComponent<void, P, S>;

export default function createApiInjectionWrapper(apiKey: string): WithApiWrapper {
    return (Component: *) => {
        return class Wrapper extends React.Component {
            static contextTypes = {
                [apiKey]: PropTypes.object,
            };

            render(): React.Element<*> {
                return <Component {...this.props} {...{ [apiKey]: this.context[apiKey] }} />;
            }
        };
    };
}
