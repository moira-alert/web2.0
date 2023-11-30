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
import { Platform, getPlatformSettings } from "./helpers/common";

import "./style.less";

const initSentry = () => {
    if (process.env.SENTRY_DSN_KEY !== undefined) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN_KEY,
            debug: getPlatformSettings().platform === Platform.LOCAL,
            environment: getPlatformSettings().platform,
            enabled:
                getPlatformSettings().platform !== Platform.LOCAL &&
                process.env.SENTRY_DSN_KEY !== undefined,
            tracesSampleRate: 1.0,
        });
    }
};

initSentry();

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
