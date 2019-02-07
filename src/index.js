// @noflow
/* eslint-disable */
import { load } from "./app";

load();

if (module.hot) {
    module.hot.accept("./app.js", function() {
        load();
    });
}
