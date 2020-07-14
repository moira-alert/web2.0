// @flow
import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "@skbkontur/react-ui";
import cn from "./Tokens.less";

type BadFunctionTokenProps = {
    type: "bad" | "warn",
    message: string,
    children: string,
};

export default function BadFunctionToken({ children, message, type }: BadFunctionTokenProps) {
    const [showTooltip, setShowTooltip] = useState(false);
    const textEl = useRef(null);

    useEffect(() => {
        const handleMouseMove = event => {
            if (!textEl.current) {
                return;
            }
            const { top, bottom, left, right } = textEl.current.getBoundingClientRect();
            const { clientX, clientY } = event;

            const inside =
                clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

            setShowTooltip(inside);
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <Tooltip
            pos="top center"
            trigger={showTooltip ? "opened" : "hover"}
            useWrapper={false}
            closeButton={false}
            render={() => <div className={cn("tooltip")}>{message}</div>}
        >
            <span
                ref={textEl}
                className={cn("badFunction", {
                    error: type === "bad",
                    warning: type === "warn",
                })}
            >
                {children}
            </span>
        </Tooltip>
    );
}
