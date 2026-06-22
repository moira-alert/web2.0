import { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import checkMobile from "./helpers/check-mobile";
import * as Sentry from "@sentry/react";
import { Providers } from "./Providers/Providers";
import SentryInitializer, {
    newStaticErrorText,
    notValidMimeTypeError,
} from "./Components/SentryInitializer/SentryInitializer";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { updateServiceWorker } from "./store/Reducers/UIReducer.slice";
import { store } from "./store/store";
import { SingleToast } from "@skbkontur/react-ui";
import Favicon from "./Components/Favicon/Favicon";

import "./style.less";

const rootElement = document.getElementById("root");
const root = rootElement ? createRoot(rootElement) : null;

const onUpdate = () => {
    store.dispatch(updateServiceWorker());
};

const render = (Component: ComponentType) => {
    if (!root) return;

    root.render(
        <BrowserRouter>
            <Providers>
                <SingleToast />
                <Sentry.ErrorBoundary
                    onError={(error: unknown) => {
                        const message = error instanceof Error ? error.message : String(error);

                        if (
                            error instanceof Error &&
                            (message.includes(newStaticErrorText) ||
                                message.includes(notValidMimeTypeError))
                        ) {
                            window.location.reload();
                            return;
                        }

                        setTimeout(() => {
                            SingleToast.push(message);
                        }, 0);
                    }}
                    fallback={() => <Component />}
                >
                    <SentryInitializer />
                    <Favicon />
                    <Component />
                </Sentry.ErrorBoundary>
            </Providers>
        </BrowserRouter>
    );
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
