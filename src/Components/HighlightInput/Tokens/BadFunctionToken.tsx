import React, { useState, useRef, useEffect } from "react";
import { Tooltip } from "@skbkontur/react-ui";
import cn from "./Tokens.less";

type BadFunctionTokenProps = {
    type: "bad" | "warn";
    message?: string;
    children: React.ReactNode;
    container: HTMLElement | null;
};

export default function BadFunctionToken({
    children,
    message,
    type,
    container,
}: BadFunctionTokenProps): React.ReactElement {
    const [showTooltip, setShowTooltip] = useState(false);
    const textEl = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!textEl.current) {
                return;
            }

            const { top, bottom, left, right } = textEl.current.getBoundingClientRect();

            const { clientX, clientY } = event;

            let inside = clientX >= left && clientX <= right && clientY >= top && clientY <= bottom;

            if (inside && container) {
                const {
                    left: containerLeft,
                    right: containerRight,
                } = container.getBoundingClientRect();
                if (right < containerLeft || left > containerRight) {
                    inside = false;
                }
            }

            setShowTooltip(inside);
        };

        document.addEventListener("mousemove", handleMouseMove);
        return () => document.removeEventListener("mousemove", handleMouseMove);
    }, [container]);

    return (
        <Tooltip
            pos="top left"
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
