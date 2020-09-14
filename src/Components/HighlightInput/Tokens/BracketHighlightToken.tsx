import React from "react";
import cn from "./Tokens.less";

type BracketHighlightTokenProps = {
    children: React.ReactNode;
};

export default function BracketHighlightToken({
    children,
}: BracketHighlightTokenProps): React.ReactElement {
    return <span className={cn("bracketHighlight")}>{children}</span>;
}
