import React from "react";
import { Token } from "./parser/parseExpression";
import BracketHighlightToken from "./Tokens/BracketHighlightToken";
import ErrorToken from "./Tokens/ErrorToken";
import FunctionToken from "./Tokens/FunctionToken";

type ViewToken = Token & { render?: React.ReactNode };

export function renderToken(token: ViewToken): React.ReactNode {
    return token.render || token.value;
}

export function highlightTokens(tokens: Token[], caret?: number): ViewToken[] {
    const brackets: Array<Token> = [];
    let isFound = false;

    tokens.forEach((token) => {
        if (token.value === "(") {
            brackets.push(token);
            return;
        }

        if (token.value === ")") {
            const bracket = brackets.pop();

            if (bracket) {
                if (isFound || caret === undefined) {
                    return;
                }
                const isNearCaret =
                    caret === token.startPosition ||
                    caret === token.startPosition + 1 ||
                    caret === bracket.startPosition ||
                    caret === bracket.startPosition + 1;

                if (isNearCaret) {
                    token.render = <BracketHighlightToken>{token.value}</BracketHighlightToken>;
                    bracket.render = <BracketHighlightToken>{bracket.value}</BracketHighlightToken>;
                    isFound = true;
                }
            } else {
                token.render = <ErrorToken>{token.value}</ErrorToken>;
            }
        }

        if (token.type === "fnName") {
            token.render = <FunctionToken>{token.value}</FunctionToken>;
        }
    });

    brackets.forEach((bracket) => {
        bracket.render = <ErrorToken>{bracket.value}</ErrorToken>;
    });

    return tokens;
}
