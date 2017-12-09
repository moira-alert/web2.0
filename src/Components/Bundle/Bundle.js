// @flow
import * as React from "react";

export class Bundle extends React.Component {
    state = {
        mod: null,
    };

    componentWillMount() {
        this.load(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps);
        }
    }

    load(props) {
        this.setState({
            mod: null,
        });
        props.load(mod => {
            this.setState({
                mod: mod.default ? mod.default : mod,
            });
        });
    }

    render(): React.Node {
        return this.state.mod ? this.props.children(this.state.mod) : null;
    }
}

