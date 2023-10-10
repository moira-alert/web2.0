import { StateEffect, StateField, Extension, Range } from "@codemirror/state";
import { DecorationSet, Decoration, EditorView, ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { TriggerTargetProblem } from "../../Domain/Trigger";

type BadFunctionDecoration = {
    from: number;
    to: number;
    problemTree: TriggerTargetProblem;
};

interface ApplyDecoration {
    type: TriggerTargetProblem["type"];
    argument: TriggerTargetProblem["argument"];
}

const addBackgroundDecoration = StateEffect.define<BadFunctionDecoration>();

const applyDecoration = (
    functionName: string,
    problemTree?: TriggerTargetProblem
): ApplyDecoration | null => {
    if (!problemTree || !problemTree.type) {
        return null;
    }
    if (problemTree.argument === functionName) {
        return { type: problemTree.type, argument: problemTree.argument };
    }

    if (problemTree.problems) {
        for (const problem of problemTree.problems) {
            const result = applyDecoration(functionName, problem);
            if (result) {
                return result;
            }
        }
    }

    return null;
};

const backgroundEffect = (view: ViewUpdate, problemTree?: TriggerTargetProblem): void => {
    if (!view.docChanged || !view.viewportChanged) {
        return;
    }
    const effects: StateEffect<BadFunctionDecoration>[] = [];
    const doc = view.state.doc.toString();
    const syntax = syntaxTree(view.state);

    syntax.iterate({
        enter(node) {
            if (node.name !== "FunctionName" || !problemTree) {
                return;
            }
            const from = node.from;
            const to = node.to;
            const elementString = doc.substring(from, to);

            const badFunction = applyDecoration(elementString, problemTree);

            if (!badFunction) {
                return;
            }

            effects.push(
                addBackgroundDecoration.of({
                    from,
                    to,
                    problemTree,
                })
            );
            return false;
        },
    });

    if (effects.length > 0) {
        view.view.dispatch({ effects });
    }
};

const backgroundDecorationField = (problemTree?: TriggerTargetProblem) =>
    StateField.define<DecorationSet>({
        create() {
            return Decoration.none;
        },
        update(backgroundDecoration, tr) {
            let backgroundDecorationsRangeSet = backgroundDecoration.map(tr.changes);
            const doc = tr.state.doc.toString();
            const marks: Range<Decoration>[] = [];

            tr.effects.forEach((effect) => {
                if (!effect.is(addBackgroundDecoration)) {
                    return;
                }
                const { from, to } = effect.value;
                const funcType = applyDecoration(doc.substring(from, to), problemTree)?.type;
                const mark = Decoration.mark({
                    inclusiveEnd: true,
                    class: funcType === "bad" ? "redFunction" : "yellowFunction",
                }).range(from, to);

                marks.push(mark);
            });

            backgroundDecorationsRangeSet = backgroundDecorationsRangeSet.update({
                add: marks,
                filter(from, to) {
                    const elementString = doc.substring(from, to);
                    return applyDecoration(elementString, problemTree) ? true : false;
                },
            });

            return backgroundDecorationsRangeSet;
        },
        provide: (f) => EditorView.decorations.from(f),
    });

export const badFunctionHighlightExtension: (problemTree?: TriggerTargetProblem) => Extension = (
    problemTree
) => [
    EditorView.updateListener.of((view) => backgroundEffect(view, problemTree)),
    backgroundDecorationField(problemTree),
    EditorView.theme({
        ".redFunction": {
            backgroundColor: "#fcb6b1",
            borderRadius: "2px",
        },
        ".yellowFunction": {
            backgroundColor: "#fce56f",
            borderRadius: "2px",
        },
    }),
];
