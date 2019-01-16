// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ApiContext } from "./Api/MoiraApiInjection";
import MoiraApi from "./Api/MoiraAPI";
import App from "./App";

import "./style.less";

const moiraApi = new MoiraApi("/api");

const render = Component => {
    ReactDOM.render(
        <BrowserRouter>
            <ApiContext.Provider value={moiraApi}>
                <Component />
            </ApiContext.Provider>
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
