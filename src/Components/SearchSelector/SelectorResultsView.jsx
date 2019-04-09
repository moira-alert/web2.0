// @flow
import * as React from "react";
import Token from "../Token/Token";
import cn from "./SearchSelector.less";

function SelectorResultsView({
    tokens,
    onSelect,
}: {
    tokens: string[],
    onSelect: string => void,
}): React.Node {
    return (
        <React.Fragment>
            {tokens.length === 0 ? (
                <p className={cn("help-search")}>
                    There are no tags for your request. Press{" "}
                    <span className={cn("keyboard-key")}>Enter</span> for full text search
                </p>
            ) : (
                <React.Fragment>
                    <p className={cn("help-search")}>
                        Press <span className={cn("keyboard-key")}>Enter</span> for full text search
                        or select a tag from list with mouse click
                    </p>
                    <ul className={cn("token-list")}>
                        {tokens.map(token => (
                            <li className={cn("token-list-item")} key={token}>
                                <Token type="selectable" onClick={onSelect}>
                                    {token}
                                </Token>
                            </li>
                        ))}
                    </ul>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}

export { SelectorResultsView as default };
