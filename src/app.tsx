import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import checkMobile from "./helpers/check-mobile";
import * as Sentry from "@sentry/react";
import { Providers } from "./Providers/Providers";
import SentryInitializer from "./Components/SentryInitializer/SentryInitializer";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { updateServiceWorker } from "./store/Reducers/UIReducer.slice";
import { store } from "./store/store";
import { Toast } from "@skbkontur/react-ui/components/Toast";
import Favicon from "./Components/Favicon/Favicon";

import "./style.less";

const root = document.getElementById("root");

const onUpdate = () => {
    store.dispatch(updateServiceWorker());
};

const render = (Component: ComponentType) => {
    if (root !== null) {
        ReactDOM.render(
            <BrowserRouter>
                <Providers>
                    <Sentry.ErrorBoundary
                        onError={(error) => Toast.push(error.toString())}
                        fallback={() => <Component />}
                    >
                        <SentryInitializer />
                        <Favicon />
                        <Component />
                    </Sentry.ErrorBoundary>
                </Providers>
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

serviceWorkerRegistration.register(onUpdate);

export { load as default };
