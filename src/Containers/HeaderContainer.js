// @flow
import * as React from "react";
import type { IMoiraApi } from "../Api/MoiraAPI";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Bar from "../Components/Bar/Bar";
import Header from "../Components/Header/Header";
import { MoiraServiceStates } from "../Domain/MoiraServiceStates";

type Props = {
    moiraApi: IMoiraApi,
    className: string,
};

type State = {
    moiraStatusMessage: ?string,
};

class HeaderContainer extends React.Component<Props, State> {
    state: State = {
        moiraStatusMessage: null,
    };

    async getData(): Promise<void> {
        const { moiraApi } = this.props;
        try {
            const { state, message } = await moiraApi.getMoiraStatus();
            switch (state) {
                case MoiraServiceStates.OK:
                    this.setState({ moiraStatusMessage: null });
                    break;
                case MoiraServiceStates.ERROR:
                    this.setState({ moiraStatusMessage: message });
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
        const { moiraStatusMessage } = this.state;
        return (
            <div className={this.props.className}>
                {moiraStatusMessage && <Bar message={moiraStatusMessage} />}
                <Header />
            </div>
        );
    }
}

export default withMoiraApi(HeaderContainer);
