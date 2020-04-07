// @flow
import * as React from "react";
import { Loader } from "@skbkontur/react-ui";
import cn from "./MobileEmptyContentLoading.less";

export default function MobileEmptyContentLoading(): React.Node {
    return (
        <div className={cn("empty-list-loading")}>
            <Loader type="big" caption="" active />
        </div>
    );
}
