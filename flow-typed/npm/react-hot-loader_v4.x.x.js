// flow-typed signature: 3193712ae4ddd5385f359c7b985ac6fd
// flow-typed version: 1517003b23/react-hot-loader_v4.x.x/flow_>=v0.53.0

declare module "react-hot-loader/root" {
    declare type AppContainerProps = {
        errorBoundary?: boolean,
        errorReporter?: React$ComponentType<{
            error: Error,
            errorInfo: { componentStack: string },
        }>,
    };

    declare export function hot(
        Component: React$ComponentType<any>,
        props?: AppContainerProps
    ): React$ComponentType<any>;
}
