// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import { getPageLink } from "../../Domain/Global";
import LinkUI from "retail-ui/components/Link";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./Header.less";
import svgLogo from "./moira-logo.svg";
import {withMoiraApi} from "../../Api/MoiraApiInjection";
import {IMoiraApi} from "../../Api/MoiraAPI";
import type { ContextRouter } from "react-router-dom";
import {flattenDeep, intersection, uniq} from "lodash";
import {Config} from "../../Domain/Config";
import {TriggerList} from "../../Domain/Trigger";
import Icon from "retail-ui/components/Icon";

type Props = ContextRouter & {
    className?: string,
    moiraApi: IMoiraApi
};
type State = {
    error: ?string
};

class Header extends React.Component<Props, State> {
    state: State = {
        error: null
    };

    async getData(): Promise<void> {
        const { moiraApi } = this.props;

        try {
            const { state } = await moiraApi.getGlobalStatus();
            if (state && state === 'OK') {
                this.setState({error: false});
            }
            if (state && state !== 'OK') {
                this.setState({error: true});
            }
        } catch (error) {
            // error
        }
    }

    componentDidMount() {
        this.getData();
    }

    render(): React.Node {
        return (
            <header className={cn("header", this.state.error ? "header_error" : '', this.props.className)}>
                <div className={cn("container")}>
                    <Link to={getPageLink("index")} className={cn("logo-link")}>
                        <img className={cn("logo-img")} src={svgLogo} alt="Moira"/>
                    </Link>
                    <nav className={cn("menu")}>
                        <RouterLink to={getPageLink("settings")} icon="Settings">
                            Notifications
                        </RouterLink>
                        <LinkUI href={getPageLink("docs")} icon="HelpBook">
                            Help
                        </LinkUI>
                    </nav>
                </div>
                {this.state.error && <div className={cn('error-container')}>
                    <Icon name="Warning" /> Something unexpected happened with Moira, so we temporarily turned off the notification mailing. We are already working on the problem and will fix it in the near future.
                </div>}
            </header>
        );
    }
}

export default withMoiraApi(Header);
