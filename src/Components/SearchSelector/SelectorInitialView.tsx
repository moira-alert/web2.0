import * as React from "react";
import { Token } from "../Token/Token";
import { TokenType } from "../../helpers/TokenType";
import classNames from "classnames/bind";

import styles from "./SearchSelector.module.less";

const cn = classNames.bind(styles);

function SelectorInitialView({
    tokens,
    onSelect,
}: {
    tokens: string[];
    onSelect: (token: string) => void;
}): React.ReactElement {
    return (
        <>
            <p className={cn("help-search")}>
                Input query then press <span className={cn("keyboard-key")}>Enter</span> for full
                text search or select tag from list with mouse click
            </p>
            {tokens.length > 0 && (
                <>
                    <p className={cn("token-list-label")}>Tags from your subscriptions</p>
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

export { SelectorInitialView as default };
