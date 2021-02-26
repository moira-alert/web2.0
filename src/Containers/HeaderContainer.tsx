import * as React from "react";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Bar from "../Components/Bar/Bar";
import Header from "../Components/Header/Header";
import MoiraServiceStates from "../Domain/MoiraServiceStates";

type Props = {
    moiraApi: MoiraApi;
    className: string;
};

type State = {
    notifierStateMessage?: string;
};

class HeaderContainer extends React.Component<Props, State> {
    state: State = {};

    componentDidMount() {
        this.getData();
    }

    render(): React.ReactElement {
        const { notifierStateMessage } = this.state;
        const { className } = this.props;
        return (
            <div className={className}>
                {notifierStateMessage && <Bar message={notifierStateMessage} />}
                <Header />
            </div>
        );
    }

    async getData() {
        const { moiraApi } = this.props;
        try {
            const { state, message } = await moiraApi.getNotifierState();
            switch (state) {
                case MoiraServiceStates.OK:
                    this.setState({ notifierStateMessage: undefined });
                    break;
                case MoiraServiceStates.ERROR:
                    this.setState({ notifierStateMessage: message });
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
            // ToDo: do something with this error
        }
    }
}

export default withMoiraApi(HeaderContainer);
