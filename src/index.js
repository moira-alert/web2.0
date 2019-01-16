// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import MoiraApi from "./Api/MoiraAPI";
import { ApiProvider } from "./Api/MoiraApiInjection";
import App from "./App";

import "./style.less";

const api = new MoiraApi("/api");

const render = Component => {
    ReactDOM.render(
        <BrowserRouter>
            <ApiProvider moiraApi={api}>
                <Component />
            </ApiProvider>
        </BrowserRouter>,
        document.getElementById("root")
    );
};

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        render(App);
    });
}
