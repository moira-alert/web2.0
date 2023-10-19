// export const formatQuery = (input: string | Iterable<string>) => {
//     const inputString = input.toString().replace(/\s+/g, " ");
//     let output = "";
//     let indentLevel = 0;
//     let comma = false;
//     for (let i = 0; i < inputString.length; i++) {
//         if (inputString[i] === "(" || inputString[i] === "{") {
//             output += inputString[i] + "\n" + "  ".repeat(indentLevel + 1);
//             indentLevel++;
//         } else if (inputString[i] === ")" || inputString[i] === "}") {
//             output = output.trimEnd() + "\n" + "  ".repeat(indentLevel - 1) + inputString[i];
//             indentLevel--;
//         } else if (inputString[i] === ",") {
//             output += inputString[i] + "\n" + "  ".repeat(indentLevel);
//         } else if (inputString[i] === " " && inputString[i - 1] === ",") {
//             continue;
//         } else {
//             output += inputString[i];
//         }
//     }
//     return output;
// };

export const formatQuery = (input: string | Iterable<string>) => {
    const inputString = input.toString().replace(/\s+/g, " ");
    let output = "";
    let indentLevel = 0;
    for (let i = 0; i < inputString.length; i++) {
        if (inputString[i] === "(" || inputString[i] === "{") {
            const nextTokenIndex = inputString.indexOf(")", i + 1);
            const isOpeningBracketFollowedBySingleToken =
                nextTokenIndex > -1 && !inputString.slice(i + 1, nextTokenIndex).includes(",");
            if (!isOpeningBracketFollowedBySingleToken) {
                output += inputString[i] + "\n";
                output += "  ".repeat(indentLevel + 1);
            } else {
                output += inputString[i];
            }
            indentLevel++;
        } else if (inputString[i] === ")" || inputString[i] === "}") {
            indentLevel--;
            const prevTokenIndex = inputString.lastIndexOf("(", i - 1);
            const isClosingBracketPrecededBySingleToken =
                prevTokenIndex > -1 && !inputString.slice(i + 1, prevTokenIndex).includes(",");
            if (isClosingBracketPrecededBySingleToken) {
                output = output.trimEnd() + "\n" + "  ".repeat(indentLevel);
            }
            output += inputString[i];
        } else if (inputString[i] === ",") {
            output += inputString[i] + "\n" + "  ".repeat(indentLevel);
        } else if (inputString[i] === " " && inputString[i - 1] === ",") {
            continue;
        } else {
            output += inputString[i];
        }
    }
    return output;
};
