// @flow
import React from "react";
import cn from "./Tokens.less";

type BracketHighlightTokenProps = {
    children: ReactNode,
};

export default function BracketHighlightToken({ children }: BracketHighlightTokenProps) {
    return <span className={cn("bracketHighlight")}>{children}</span>;
}
