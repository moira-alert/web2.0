import type { ReactElement } from "react";
import { Link } from "react-router";
import { Link as LinkUI } from "@skbkontur/react-ui/components/Link";
import { IconBookClosedHelpRegular16 } from "@skbkontur/icons/IconBookClosedHelpRegular16";
import { IconPeople3Regular16 } from "@skbkontur/icons/IconPeople3Regular16";
import { IconSettingsGearRegular16 } from "@skbkontur/icons/IconSettingsGearRegular16";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import svgLogo from "./moira-logo.svg";
import { AdminMenu } from "./Components/AdminMenu";
import { useSelector } from "react-redux";
import { selectPlatform } from "../../store/Reducers/ConfigReducer.slice";
import { useGetConfigQuery } from "../../services/BaseApi";
import { Platform } from "../../Domain/Config";
import { ChristmasHatSVG } from "./Components/ChristmasHat";
import { ChristmasMoodToggle } from "../ChristmasMoodToggle/ChristmasMoodToggle";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { UISettingsModal } from "../UISettingsModal/UISettingsModal";
import { useTheme } from "../../Themes";
import { useGetUserTeamsQuery } from "../../services/TeamsApi";
import { getSettingsLink } from "../../helpers/getSettingsLink";
import classNames from "classnames/bind";

import styles from "./Header.module.less";

const cn = classNames.bind(styles);

export default function Header(): ReactElement {
    const platform = useSelector(selectPlatform);
    const { isLoading } = useGetConfigQuery();
    const theme = useTheme();
    const { isChristmasMood } = useAppSelector(UIState);
    const { data: teams } = useGetUserTeamsQuery();

    return (
        <header
            className={cn("header", {
                isLoading,
                "dev-background": platform === Platform.DEV,
                "staging-background": platform === Platform.STAGING,
            })}
            style={{ backgroundColor: theme.appBgColorSecondary }}
        >
            <div className={cn("container")}>
                <Link to={getPageLink("index")} className={cn("logo-link")}>
                    {isChristmasMood && <ChristmasHatSVG className={cn("christmas-hat")} />}
                    <img className={cn("logo-img")} src={svgLogo} alt="Moira" />
                </Link>
                <nav className={cn("menu")}>
                    <ChristmasMoodToggle />
                    <UISettingsModal />
                    <AdminMenu />
                    <RouterLink to={getPageLink("teams")} icon={<IconPeople3Regular16 />}>
                        Teams
                    </RouterLink>
                    <RouterLink to={getSettingsLink(teams)} icon={<IconSettingsGearRegular16 />}>
                        Notifications
                    </RouterLink>
                    <LinkUI href={getPageLink("docs")} icon={<IconBookClosedHelpRegular16 />}>
                        Help
                    </LinkUI>
                </nav>
            </div>
        </header>
    );
}
