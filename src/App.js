// @flow
import * as React from "react";
import { hot } from "react-hot-loader/root";
import HeaderContainer from "./Containers/HeaderContainer";
import Footer from "./Components/Footer/Footer";
import { Bundle } from "./Components/Bundle/Bundle";
import { Desktop } from "./Components/Responsive/Responsive";
import loadDesktopApp from "./Desktop.AppRoot";
import loadMobileApp from "./Mobile.AppRoot";
import cn from "./App.less";

function App(): React.Node {
    return (
        <div className={cn("layout")}>
            <Desktop>{x => x && <HeaderContainer className={cn("header")} />}</Desktop>
            <Desktop>
                {x =>
                    x ? (
                        <Bundle load={loadDesktopApp}>{DesktopApp => <DesktopApp />}</Bundle>
                    ) : (
                        <Bundle load={loadMobileApp}>{MobileApp => <MobileApp />}</Bundle>
                    )
                }
            </Desktop>
            <Desktop>{x => x && <Footer className={cn("footer")} />}</Desktop>
        </div>
    );
}

export default hot(App);
