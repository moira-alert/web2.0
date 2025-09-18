import React, { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import ArrowChevronDown from "@skbkontur/react-icons/ArrowChevronDown";
import { ArrowChevronUp } from "@skbkontur/react-icons";
import classNames from "classnames/bind";

import styles from "./ExpandableBlock.module.less";

const cn = classNames.bind(styles);

interface IExpandableBlockProps {
    children: React.ReactNode;
    maxHeight?: number;
}

export const ExpandableBlock: React.FC<IExpandableBlockProps> = ({ children, maxHeight = 60 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [expanded, setExpanded] = useState(false);

    useLayoutEffect(() => {
        const el = ref.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight);
        }
    }, []);

    return (
        <div className={cn("expandable", { expanded })}>
            <div
                ref={ref}
                className={cn("expandable-content", { masked: !expanded && isOverflowing })}
                style={{ maxHeight: expanded ? undefined : `${maxHeight}px` }}
            >
                {children}
            </div>
            {isOverflowing && (
                <Button
                    icon={expanded ? <ArrowChevronUp /> : <ArrowChevronDown />}
                    className={cn("expand-btn")}
                    onClick={() => setExpanded((prev) => !prev)}
                >
                    {expanded ? "Hide" : "Expand"}
                </Button>
            )}
        </div>
    );
};
