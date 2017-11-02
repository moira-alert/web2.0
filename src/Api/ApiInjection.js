// @flow
/* eslint-disable */
import React, { PropTypes } from 'react';

type FunctionComponent<P> = (props: P) => ?React$Element<any>;
type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;

export type WithApiWrapper<TApiProps> = <P, S>(Comp: ClassComponent<void, P, S> | FunctionComponent<P>) => ClassComponent<void, $Diff<P, TApiProps>, S>;

function createWithApiWrapperImpl<TApiProps>(key: string): WithApiWrapper<TApiProps> {
    var result: any = function(Comp: *) {
        return class WrapperClass extends React.Component {
            static displayName = `withApi(${Comp.displayName})`
            static contextTypes = {
                [key]: React.PropTypes.object
            };

            constructor(props, context) {
                super(props, context)

                if (!context[key]) {
                    throw Error(
                        `No api was found in context. Wrap your component with ApiProvider`
                    )
                }
            }

            render(): React.Element<*> {
                return (
                    <Comp
                        { ...{ [key]: this.context[key] } }
                        {...this.props}
                    />
                );
            }
        }
    }
    return result;
}

export const createWithApiWrapper: <T: {}>(z: string, u: ?T) => WithApiWrapper<T> = (createWithApiWrapperImpl: any);

function merge(x, y) {
    return { ...x, ...y };
}

export type ApiProviderBase<TApiProps> = Class<React.Component<void, TApiProps & { children?: React.Element<*> }, void>>

export function createApiProvider<TProps: {}>(propsToContextNames: string[]): ApiProviderBase<TProps> {
    return class ApiProvider extends React.Component {
        props: TProps & { children?: any };

        static childContextTypes =
            propsToContextNames
                .map(x => ({ [x]: PropTypes.any }))
                .reduce(merge);

        getChildContext(): $Diff<TProps, { children?: any }> {
            const { children, ...restProps } = this.props;
            return restProps;
        }

        render(): ?React.Element<*> {
            const { children } = this.props;
            return children;
        }
    }
}
