// @flow
import * as React from "react";
import cn from "./HeaderContainer.less";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import { IMoiraApi } from "../../Api/MoiraAPI";
import type { ContextRouter } from "react-router-dom";
import Bar from "../Bar/Bar";
import Header from "../Header/Header";
import { Statuses } from "../../Domain/Status";

type Props = ContextRouter & {
    className?: string,
    moiraApi: IMoiraApi,
};
type State = {
    barMessage: ?string,
};

class HeaderContainer extends React.Component<Props, State> {
    state: State = {
        barMessage: null,
    };

    async getData(): Promise<void> {
        const { moiraApi } = this.props;

        try {
            const { state, message } = await moiraApi.getGlobalStatus();

            switch (state) {
                case Statuses.OK:
                    this.setState({ barMessage: "" });
                    break;
                case Statuses.ERROR:
                    this.setState({ barMessage: message });
                    break;
                default:
                    break;
            }
        } catch (error) {
            // error
        }
    }

    componentDidMount() {
        this.getData();
    }

    render(): React.Node {
        const { className } = this.props;
        const { barMessage } = this.state;
        return (
            <div className={cn(className)}>
                <Header className={cn("header")} />
                {barMessage && <Bar message={barMessage} />}
            </div>
        );
    }
}

export default withMoiraApi(HeaderContainer);
