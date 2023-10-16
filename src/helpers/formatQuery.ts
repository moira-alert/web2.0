export const formatQuery = (input: string) => {
    let output = "";
    let indentLevel = 0;
    for (const char of input) {
        if (char === "(") {
            output += char + "\n" + "  ".repeat(indentLevel + 1);
            indentLevel++;
        } else if (char === ")") {
            output = output.trimEnd() + "\n" + "  ".repeat(indentLevel - 1) + char;
            indentLevel--;
        } else if (char === ",") {
            output += char + "\n" + "  ".repeat(indentLevel);
        } else {
            output += char;
        }
    }
    return output;
};
