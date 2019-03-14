// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../../Api/MoiraApi";
import { withMoiraApi } from "../../Api/MoiraApiInjection";

type Props = ContextRouter & { moiraApi: IMoiraApi };

type State = {
    loading: boolean,
};

class CollectionPage extends React.Component<Props, State> {
    state: State = {
        loading: true,
    };

    componentDidMount() {
        document.title = "Moira - Collection";
    }

    render() {
        const { loading } = this.state;
        const { view: TriggerListView } = this.props;

        return loading ? <div>Loading...</div> : <TriggerListView />;
    }
}

export default withMoiraApi(CollectionPage);
