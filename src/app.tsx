import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import MoiraApi from "./Api/MoiraApi";
import { ApiProvider } from "./Api/MoiraApiInjection";
import checkMobile from "./helpers/check-mobile";
import * as Sentry from "@sentry/react";
import ErrorContainer from "./Containers/ErrorContainer";

import "./style.less";

Sentry.init({
    dsn: "https://f15c489f9f0c4e0b9232ce8ec447bd3f@sentry.kontur.host/600",

    tracesSampleRate: 1.0,
});

const root = document.getElementById("root");

const moiraApi = new MoiraApi("/api");

const render = (Component: ComponentType) => {
    if (root !== null) {
        ReactDOM.render(
            <BrowserRouter>
                <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
                    <Sentry.ErrorBoundary fallback={ErrorContainer("Error has occured")}>
                        <ApiProvider value={moiraApi}>
                            <Component />
                        </ApiProvider>
                    </Sentry.ErrorBoundary>
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
