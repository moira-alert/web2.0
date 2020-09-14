import * as React from "react";
import { Link } from "react-router-dom";
import { Link as LinkUI } from "@skbkontur/react-ui/components/Link";
import SettingsIcon from "@skbkontur/react-icons/Settings";
import HelpBookIcon from "@skbkontur/react-icons/HelpBook";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import svgLogo from "./moira-logo.svg";
import cn from "./Header.less";

export default function Header(): React.ReactElement {
    return (
        <header className={cn("header")}>
            <div className={cn("container")}>
                <Link to={getPageLink("index")} className={cn("logo-link")}>
                    <img className={cn("logo-img")} src={svgLogo} alt="Moira" />
                </Link>
                <nav className={cn("menu")}>
                    <RouterLink to={getPageLink("settings")} icon={<SettingsIcon />}>
                        Notifications
                    </RouterLink>
                    <LinkUI href={getPageLink("docs")} icon={<HelpBookIcon />}>
                        Help
                    </LinkUI>
                </nav>
            </div>
        </header>
    );
}
