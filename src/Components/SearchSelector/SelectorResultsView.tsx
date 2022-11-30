import * as React from "react";
import { Token } from "../Token/Token";
import { TokenType } from "../../helpers/TokenType";
import cn from "./SearchSelector.less";

function SelectorResultsView({
    tokens,
    onSelect,
}: {
    tokens: string[];
    onSelect: (token: string) => void;
}): React.ReactElement {
    return (
        <>
            {tokens.length === 0 ? (
                <p className={cn("help-search")}>
                    There are no tags for your request. Press{" "}
                    <span className={cn("keyboard-key")}>Enter</span> for full text search
                </p>
            ) : (
                <>
                    <p className={cn("help-search")}>
                        Press <span className={cn("keyboard-key")}>Enter</span> for full text search
                        or select a tag from list with mouse click
                    </p>
                    <ul className={cn("token-list")}>
                        {tokens.map((token) => (
                            <li className={cn("token-list-item")} key={token}>
                                <Token type={TokenType.SELECTABLE} onClick={onSelect}>
                                    {token}
                                </Token>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}

export { SelectorResultsView as default };
