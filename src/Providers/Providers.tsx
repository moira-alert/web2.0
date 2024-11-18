import React from "react";
import { Provider } from "react-redux";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { store } from "../store/store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <LocaleContext.Provider value={{ langCode: LangCodes.en_GB }}>
            <Provider store={store}>{children}</Provider>
        </LocaleContext.Provider>
    );
};
