// @flow
import * as React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import MoiraApi from "./Api/MoiraAPI";
import App from "./App";
import { ApiProvider } from "./Api/MoiraApiInjection";
import "./style.less";

const api = new MoiraApi("/api");

const render = Component => {
    const element = document.getElementById("root");
    if (element != null) {
        ReactDOM.render(
            <AppContainer>
                <BrowserRouter>
                    <ApiProvider moiraApi={api}>
                        <Component />
                    </ApiProvider>
                </BrowserRouter>
            </AppContainer>,
            element
        );
    } else {
        throw new Error("Element #root not found");
    }
};

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        render(App);
    });
}
