import { parseExpression } from "./tokenizer";

export const formatQuery = (input: string | Iterable<string>) => {
    const inputString = input.toString().trim();
    let output = "";
    let indentLevel = 0;
    const tokens = parseExpression(inputString);
    for (const token of tokens) {
        if (token.value === "(" || token.value === "{") {
            output += token.value + "\n" + "  ".repeat(indentLevel + 1);
            indentLevel++;
        } else if (token.value === "|") {
            output += token.value + "\n";
        } else if (token.value === ")" || token.value === "}") {
            indentLevel = Math.max(indentLevel - 1, 0); // Prevent negative indentLevel
            output = output.trimEnd() + "\n" + "  ".repeat(indentLevel) + token.value;
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
