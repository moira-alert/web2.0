// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { LangCodes } from "@skbkontur/react-ui/lib/locale";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import MoiraApi from "./Api/MoiraApi";
import { ApiProvider } from "./Api/MoiraApiInjection";
import mobile from "./mobile.bundle";
import desktop from "./desktop.bundle";
import checkMobile from "./helpers/check-mobile";
import "./style.less";

const root = document.getElementById("root");

const moiraApi = new MoiraApi("/api");

const render = Component => {
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

const load = () => {
    if (isMobile) {
        /*
            bundle-loader заменяет экспорт на свой. Вместо ожидаемого React.Component импортируется функция,
            возвращающая промис и принимающая коллбек, который будет вызван, когда промис зарезолвится.
            Из-за этого Флоу кидает ошибку. Специальный комментарий её отключает
        */
        // $FlowFixMe
        mobile(bundle => render(bundle.default));
    } else {
        // $FlowFixMe
        desktop(bundle => render(bundle.default));
    }
};

export { load as default };
