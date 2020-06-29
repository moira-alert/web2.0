// @flow
import * as React from "react";
import Token from "../Token/Token";
import cn from "./SearchSelector.less";

function SelectorInitialView({
    tokens,
    onSelect,
}: {
    tokens: string[],
    onSelect: (token: string) => void,
}): React.Node {
    return (
        <React.Fragment>
            <p className={cn("help-search")}>
                Input query then press <span className={cn("keyboard-key")}>Enter</span> for full
                text search or select tag from list with mouse click
            </p>
            {tokens.length > 0 && (
                <React.Fragment>
                    <p className={cn("token-list-label")}>Tags from your subscriptions</p>
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

export { SelectorInitialView as default };
