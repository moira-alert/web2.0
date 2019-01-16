// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import MoiraApi from "./Api/MoiraAPI";
import { ApiProvider } from "./Api/MoiraApiInjection";
import App from "./App";

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

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        render(App);
    });
}
