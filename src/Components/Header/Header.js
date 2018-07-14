// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import { getPageLink } from "../../Domain/Global";
import LinkUI from "retail-ui/components/Link";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./Header.less";
import svgLogo from "./moira-logo.svg";
import type { ContextRouter } from "react-router-dom";

type Props = ContextRouter & {
    className?: string,
};

export default function Header(props: Props): React.Node {
    return (
        <header className={cn("header", props.className)}>
            <div className={cn("container")}>
                <Link to={getPageLink("index")} className={cn("logo-link")}>
                    <img className={cn("logo-img")} src={svgLogo} alt="Moira" />
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
        </header>
    );
}
