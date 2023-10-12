import { Extension, Range } from "@codemirror/state";
import { DecorationSet, Decoration, EditorView, ViewUpdate, ViewPlugin } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { TriggerTargetProblem } from "../../Domain/Trigger";
import { hoverTooltip } from "@codemirror/view";
interface DefineFunction {
    type: TriggerTargetProblem["type"];
    argument: TriggerTargetProblem["argument"];
    description?: TriggerTargetProblem["description"];
}

export const badFunctionTooltip = (problemTree?: TriggerTargetProblem) => {
    if (!problemTree) {
        return null;
    }

    return hoverTooltip((view, pos) => {
        const doc = view.state.doc.toString();
        const syntax = syntaxTree(view.state);
        const node = syntax.resolve(pos);

        if (node.name !== "FunctionName") {
            return null;
        }

        const from = node.from;
        const to = node.to;
        const elementString = doc.substring(from, to);
        const badFunction = defineFunction(elementString, problemTree);

        if (!badFunction) {
            return null;
        }

        const text = badFunction?.description || "No description provided";

        return {
            pos: from,
            end: to,
            above: true,
            create() {
                let dom = document.createElement("div");
                dom.textContent = text;
                return { dom };
            },
        };
    });
};

const defineFunction = (
    functionName: string,
    problemTree?: TriggerTargetProblem
): DefineFunction | null => {
    if (!problemTree || !problemTree.type) {
        return null;
    }
    if (problemTree.argument === functionName) {
        return {
            type: problemTree.type,
            argument: problemTree.argument,
            description: problemTree.description,
        };
    }

    if (problemTree.problems) {
        for (const problem of problemTree.problems) {
            const result = defineFunction(functionName, problem);
            if (result) {
                return result;
            }
        }
    }
    return null;
};

const showBadFunctions = (problemTree?: TriggerTargetProblem) =>
    ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            constructor(view: EditorView) {
                this.decorations = highlightInvalidTokens(view, problemTree);
            }

            update(update: ViewUpdate) {
                if (update.docChanged || update.viewportChanged) {
                    this.decorations = highlightInvalidTokens(update.view, problemTree);
                }
            }
        },
        {
            decorations: (v) => {
                return v.decorations;
            },
        }
    );

function highlightInvalidTokens(view: EditorView, problemTree?: TriggerTargetProblem) {
    const doc = view.state.doc.toString();
    const syntax = syntaxTree(view.state);
    const marks: Range<Decoration>[] = [];
    const stack: number[] = [];
    syntax.iterate({
        enter(node) {
            const from = node.from;
            const to = node.to;
            const elementString = doc.substring(from, to);

            if (node.name === "FunctionName" && problemTree) {
                const badFunction = defineFunction(elementString, problemTree);
                if (!badFunction) {
                    return;
                }
                const mark = Decoration.mark({
                    inclusiveEnd: true,
                    class: badFunction?.type === "bad" ? "redFunction" : "yellowFunction",
                }).range(from, to);

                marks.push(mark);
                return false;
            }

            if (node.name === "(") {
                stack.push(node.from);
            }

            if (node.name === ")") {
                if (stack.length > 0) {
                    stack.pop();
                } else {
                    const mark = Decoration.mark({
                        inclusiveEnd: true,
                        class: "unmatchedBracket",
                    }).range(from, to);
                    marks.push(mark);
                }
                return false;
            }
        },
    });
    for (const openingBracketPos of stack) {
        const mark = Decoration.mark({
            inclusiveEnd: true,
            class: "unmatchedBracket",
        }).range(openingBracketPos, openingBracketPos + 1);
        marks.push(mark);
    }
    marks.sort((a, b) => a.from - b.from);
    return Decoration.set(marks);
}

export const badFunctionHighlightExtension: (problemTree?: TriggerTargetProblem) => Extension = (
    problemTree
) => {
    const extensions = [
        showBadFunctions(problemTree),
        EditorView.theme({
            ".redFunction": {
                backgroundColor: "#fcb6b1",
                borderRadius: "2px",
            },
            ".yellowFunction": {
                backgroundColor: "#fce56f",
                borderRadius: "2px",
            },
            ".unmatchedBracket": {
                backgroundColor: "#fcb6b1",
                borderRadius: "2px",
            },
        }),
    ];

    const tooltipExtension = badFunctionTooltip(problemTree);
    if (tooltipExtension) {
        extensions.push(tooltipExtension);
    }

    return extensions;
};
