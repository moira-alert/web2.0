import React from "react";
import { Link } from "react-router-dom";
import { Link as LinkUI } from "@skbkontur/react-ui/components/Link";
import SettingsIcon from "@skbkontur/react-icons/Settings";
import HelpBookIcon from "@skbkontur/react-icons/HelpBook";
import PeopleIcon from "@skbkontur/react-icons/People";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import svgLogo from "./moira-logo.svg";
import { AdminMenu } from "./Components/AdminMenu";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { useGetConfigQuery } from "../../services/BaseApi";
import { Platform } from "../../Domain/Config";
import classNames from "classnames/bind";

import styles from "./Header.less";

const cn = classNames.bind(styles);

export default function Header(): React.ReactElement {
    const platform = useSelector(selectPlatform);
    const { isLoading } = useGetConfigQuery();

    return (
        <header
            className={cn("header", {
                isLoading,
                "dev-background": platform === Platform.DEV,
                "staging-background": platform === Platform.STAGING,
            })}
        >
            <div className={cn("container")}>
                <Link to={getPageLink("index")} className={cn("logo-link")}>
                    <img className={cn("logo-img")} src={svgLogo} alt="Moira" />
                </Link>
                <nav className={cn("menu")}>
                    <AdminMenu />
                    <RouterLink to={getPageLink("teams")} icon={<PeopleIcon />}>
                        Teams
                    </RouterLink>
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
