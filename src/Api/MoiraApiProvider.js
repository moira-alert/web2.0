// @flow
import React from 'react';
import PropTypes from 'prop-types';

type Props = {
    children: React.Element<*>;
    [apiKey: string]: string;
};

export default function createApiProvider(apiKey: string): Class<React.Component<void, { children: any }, void>> {
    return class ApiProvider extends React.Component {
        static childContextTypes = {
            [apiKey]: PropTypes.object,
        };

        static propTypes = {
            children: PropTypes.element.isRequired,
        };

        props: Props;

        getChildContext(): { [apiKey: string]: {} } {
            return {
                [apiKey]: this.props[apiKey],
            };
        }

        render(): React.Element<*> {
            const { children } = this.props;
            return children;
        }
    };
}
