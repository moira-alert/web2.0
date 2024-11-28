import React from "react";
import MoiraApi from "../Api/MoiraApi";
import { ApiProvider } from "../Api/MoiraApiInjection";
import { Provider } from "react-redux";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { store } from "../store/store";
import { AppThemeProvider } from "./AppThemeProvider";

const moiraApi = new MoiraApi("/api");

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
            <Provider store={store}>
                <ApiProvider value={moiraApi}>
                    <AppThemeProvider>{children} </AppThemeProvider>
                </ApiProvider>
            </Provider>
        </LocaleContext.Provider>
    );
};
