// @flow

export type Token = {
    value: string,
    type: "bracket" | "fnName" | "empty" | "variable",
    startPosition: number,
};

const isEmptyString = (str: string) => str.trim().length === 0;
export function makeTokens(expression: string[]): Token[] {
    const result: Token[] = [];

    let startPosition = 0;
    let variableIndex: undefined | number;

    for (let k = 0; k < expression.length; k += 1) {
        const current = expression[k];
        const isEmpty = isEmptyString(current);

        result[k] = {
            value: current,
            type: "variable",
            startPosition,
        };

        if (isEmpty) {
            result[k].type = "empty";
        } else if (current === "(") {
            result[k].type = "bracket";

            if (variableIndex !== undefined) {
                result[variableIndex].type = "fnName";
                variableIndex = undefined;
            }
        } else if (current === ")") {
            result[k].type = "bracket";
            if (variableIndex !== undefined) {
                variableIndex = undefined;
            }
        } else if (variableIndex !== undefined) {
            variableIndex = k;
        } else {
            variableIndex = k;
        }
        startPosition += current.length;
    }

    return result;
}

export function splitFunction(expression: string): string[] {
    const tokens: string[] = [];
    let tokenSeparator: "'" | '"' | " " | undefined;

    let tokenStart = 0;

    for (let i = 0; i < expression.length; i += 1) {
        const symbol = expression[i];
        if (tokenSeparator === " ") {
            if (symbol !== " ") {
                tokens.push(expression.slice(tokenStart, i));
                tokenSeparator = symbol === '"' || symbol === "'" ? symbol : undefined;
                tokenStart = i;

                if (symbol === "(" || symbol === ")" || symbol === ",") {
                    tokens.push(symbol);
                    tokenStart += 1;
                }
            }
        } else if (tokenSeparator === `"`) {
            if (symbol === `"` && expression[i - 1] !== `\\`) {
                tokens.push(expression.slice(tokenStart, i + 1));
                tokenStart = i + 1;
                tokenSeparator = undefined;
            }
        } else if (tokenSeparator === `'`) {
            if (symbol === `'` && expression[i - 1] !== `\\`) {
                tokens.push(expression.slice(tokenStart, i + 1));
                tokenStart = i + 1;
                tokenSeparator = undefined;
            }
        } else if (symbol === `"` || symbol === `'` || symbol === " ") {
            if (tokenStart < i) {
                tokens.push(expression.slice(tokenStart, i));
            }
            tokenSeparator = symbol;
            tokenStart = i;
        } else if (symbol === "(" || symbol === ")" || symbol === ",") {
            if (tokenStart < i) {
                tokens.push(expression.slice(tokenStart, i));
            }
            tokens.push(symbol);
            tokenStart = i + 1;
        }
    }
    if (tokenStart < expression.length) {
        tokens.push(expression.slice(tokenStart));
    }

    return tokens;
}

export default function parseExpression(expression: string): Token[] {
    return makeTokens(splitFunction(expression));
}
