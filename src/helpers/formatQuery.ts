import { parseExpression } from "../Components/HighlightInput/tokenizer";

export const formatQuery = (input: string | Iterable<string>) => {
    const inputString = input.toString().trim();
    let output = "";
    let indentLevel = 0;
    const tokens = parseExpression(inputString);
    for (const token of tokens) {
        if (token.value === "(" || token.value === "{") {
            output += token.value + "\n" + "  ".repeat(indentLevel + 1);
            indentLevel++;
        } else if (token.value === ")" || token.value === "}") {
            output = output.trimEnd() + "\n" + "  ".repeat(indentLevel - 1) + token.value;
            indentLevel--;
        } else if (token.value === ",") {
            output += token.value + "\n" + "  ".repeat(indentLevel);
        } else if (token.type === "empty") {
            continue;
        } else {
            output += token.value;
        }
    }
    return output;
};
