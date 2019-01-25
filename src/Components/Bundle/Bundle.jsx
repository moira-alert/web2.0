// @flow
import * as React from "react";

type Props<T> = {|
    load: (complete: (T) => void) => Promise<T>,
    children: T => React.Node,
|};

type State<T> = {
    mod: ?T,
};

export default class Bundle<T> extends React.Component<Props<T>, State<T>> {
    props: Props<T>;

    state: State<T> = {
        mod: null,
    };

    componentWillMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps: Props<T>) {
        const { load } = this.props;
        if (nextProps.load !== load) {
            this.load(nextProps);
        }
    }

    render(): React.Node {
        const { children } = this.props;
        const { mod } = this.state;
        return mod != null ? children(mod) : null;
    }

    load(props: Props<T>) {
        this.setState({
            mod: null,
        });
        props.load((mod: any) => {
            this.setState({
                mod: mod.default ? mod.default : mod,
            });
        });
    }
}
