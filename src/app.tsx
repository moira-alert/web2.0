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
import { Providers } from "./Providers/Providers";
import SentryInitializer from "./Components/SentryInitializer/SentryInitializer";

import "./style.less";

const moiraApi = new MoiraApi("/api");

const root = document.getElementById("root");

const render = (Component: ComponentType) => {
    if (root !== null) {
        ReactDOM.render(
            <BrowserRouter>
                <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
                    <Sentry.ErrorBoundary
                        fallback={({ error, componentStack }) => (
                            <ErrorContainer title={error.toString()} message={componentStack} />
                        )}
                    >
                        <ApiProvider value={moiraApi}>
                            <Providers>
                                <SentryInitializer />
                                <Component />
                            </Providers>
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
