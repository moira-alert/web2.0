import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import MoiraApi from "./Api/MoiraApi";
import { ApiProvider } from "./Api/MoiraApiInjection";
import checkMobile from "./helpers/check-mobile";

import "./style.less";

const root = document.getElementById("root");

const moiraApi = new MoiraApi("/api");

const render = (Component: ComponentType) => {
    if (root !== null) {
        ReactDOM.render(
            <BrowserRouter>
                <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
                    <ApiProvider value={moiraApi}>
                        <Component />
                    </ApiProvider>
                </LocaleContext.Provider>
            </BrowserRouter>,
            root
        );
    }
};

const isMobile = checkMobile(window.navigator.userAgent);

const load = (): void => {
    if (isMobile) {
        import("./mobile.bundle").then((mobile) => render(mobile.default));
    } else {
        import("./desktop.bundle").then((desktop) => render(desktop.default));
    }
};

export { load as default };
