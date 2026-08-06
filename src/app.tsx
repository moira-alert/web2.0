import { ComponentType, FC } from "react";
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
import { injectKonturColors } from "./helpers/injectKonturColors";
import { useSetColorsAttributes } from "./hooks/useSetColorsAttributes";
import { useAppTheme } from "./hooks/themes/useAppThemeDetector";

import "./style.less";

const rootElement = document.getElementById("root");
const root = rootElement ? createRoot(rootElement) : null;

const onUpdate = () => {
    store.dispatch(updateServiceWorker());
};

injectKonturColors();

const AppRoot: FC<{ Component: ComponentType }> = ({ Component }) => {
    const theme = useAppTheme();
    useSetColorsAttributes(theme.name);

    return (
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
    );
};

const render = (Component: ComponentType) => {
    if (!root) return;

    root.render(
        <BrowserRouter>
            <Providers>
                <SingleToast />
                <AppRoot Component={Component} />
            </Providers>
        </BrowserRouter>
    );
};

const isMobile = checkMobile(window.navigator.userAgent);

// Vite/rolldown merges the mobile/desktop dynamic imports below into a single
// preload call whose deps only cover one branch, dropping the other branch's
// CSS (see inject-entry-css-map in vite.config.ts). Load the correct CSS for
// the branch we're actually taking before triggering its dynamic import.
const loadEntryCss = (entry: "mobile" | "desktop") => {
    const entryCss = (window as unknown as { __ENTRY_CSS__?: Record<string, string[]> })
        .__ENTRY_CSS__;
    for (const file of entryCss?.[entry] ?? []) {
        const href = `/${file}`;
        if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) continue;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }
};

const load = (): void => {
    if (isMobile) {
        loadEntryCss("mobile");
        import("./mobile.bundle").then((mobile) => render(mobile.default));
    } else {
        loadEntryCss("desktop");
        import("./desktop.bundle").then((desktop) => render(desktop.default));
    }
};

serviceWorkerRegistration.register(onUpdate);

export { load as default };
