// @noflow
/* eslint-disable */
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
// import { hot } from "react-hot-loader/root";
import MoiraApi from "./Api/MoiraApi";
import { ApiProvider } from "./Api/MoiraApiInjection";
import mobile from "./mobile.bundle";
import desktop from "./desktop.bundle";
import checkMobile from "./Helpers/check-mobile";
import "./style.less";

const root = document.getElementById("root");

const moiraApi = new MoiraApi("/api");

const render = Component => {
    if (root !== null) {
        ReactDOM.render(
            <BrowserRouter>
                <ApiProvider value={moiraApi}>
                    <Component />
                </ApiProvider>
            </BrowserRouter>,
            root
        );
    }
};

const isMobile = checkMobile(window.navigator.userAgent);

const load = () => {
    if (isMobile) {
        mobile(({ Mobile }) => render(Mobile));
    } else {
        desktop(({ Desktop }) => render(Desktop));
    }
};

export { load };
