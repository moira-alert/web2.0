// @flow
import * as React from "react";
import type { IMoiraApi } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Bar from "../Components/Bar/Bar";
import Header from "../Components/Header/Header";
import { MoiraServiceStates } from "../Domain/MoiraServiceStates";

type Props = {
    moiraApi: IMoiraApi,
    className: string,
};

type State = {
    notifierStateMessage: ?string,
};

class HeaderContainer extends React.Component<Props, State> {
    state: State = {
        notifierStateMessage: null,
    };

    async getData() {
        const { moiraApi } = this.props;
        try {
            const { state, message } = await moiraApi.getNotifierState();
            switch (state) {
                case MoiraServiceStates.OK:
                    this.setState({ notifierStateMessage: null });
                    break;
                case MoiraServiceStates.ERROR:
                    this.setState({ notifierStateMessage: message });
                    break;
                default:
                    break;
            }
        } catch (error) {
            // ToDo: do something with this error
        }
    }

    componentDidMount() {
        this.getData();
    }

    render(): React.Node {
        const { notifierStateMessage } = this.state;
        return (
            <div className={this.props.className}>
                {notifierStateMessage && <Bar message={notifierStateMessage} />}
                <Header />
            </div>
        );
    }
}

export default withMoiraApi(HeaderContainer);
