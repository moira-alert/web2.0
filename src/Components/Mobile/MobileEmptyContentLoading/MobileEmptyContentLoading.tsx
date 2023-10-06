import * as React from "react";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import classNames from "classnames/bind";

import styles from "./MobileEmptyContentLoading.less";

const cn = classNames.bind(styles);

export default function MobileEmptyContentLoading(): React.ReactElement {
    return (
        <div className={cn("empty-list-loading")}>
            <Loader type="big" caption="" active />
        </div>
    );
}
