import React from "react";
import { Link } from "@skbkontur/react-ui/components/Link";
import CodeRef from "../../../CodeRef/CodeRef";
import classNames from "classnames/bind";

import styles from "../../TriggerModeEditor.module.less";

const cn = classNames.bind(styles);

export const TooltipExpressionHelp = (): React.ReactNode => (
    <div className={cn("expression-help")}>
        <div className={cn("main-description")}>
            Expression uses{" "}
            <Link target="_blank" href="https://github.com/Knetic/govaluate/blob/master/MANUAL.md">
                govaluate
            </Link>{" "}
            with predefined constants:
        </div>
        <div>
            <CodeRef>t1</CodeRef>, <CodeRef>t2</CodeRef>, ... are values from your targets.
        </div>
        <div>
            <CodeRef>OK</CodeRef>, <CodeRef>WARN</CodeRef>, <CodeRef>ERROR</CodeRef>,{" "}
            <CodeRef>NODATA</CodeRef> are states that must be the result of evaluation.
        </div>
        <div>
            <CodeRef>PREV_STATE</CodeRef> is equal to previously set state, and allows you to
            prevent frequent state changes.
        </div>

        <div className={cn("note")}>
            NOTE: Only T1 target can resolve into multiple metrics in Advanced Mode. T2, T3, ...
            must resolve to single metrics.
        </div>
    </div>
);
