import * as React from "react";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import cn from "./MobileEmptyContentLoading.less";

export default function MobileEmptyContentLoading(): React.ReactElement {
    return (
        <div className={cn("empty-list-loading")}>
            <Loader type="big" caption="" active />
        </div>
    );
}
