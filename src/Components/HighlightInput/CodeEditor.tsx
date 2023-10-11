import React, { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { triggerLanguage } from "../../TriggerGrammar/triggerLanguage";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { badFunctionHighlightExtension } from "./badFunctionHighlightExtension";
import { TriggerTargetProblem } from "../../Domain/Trigger";

interface Props {
    value: string;
    width?: string;
    func?: string;
    position?: number;
    problemTree?: TriggerTargetProblem;
    onValueChange: (value: string) => void;
}

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.variableName, color: "#6D6BDE" },
        { tag: t.string, color: "#3cb371" },
        { tag: t.number, color: "#b86721" },
    ])
);

export const CodeEditor: React.FC<Props> = ({ value, problemTree, width, onValueChange }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    function formatQuery(input: string) {
        let output = "";
        let indentLevel = 0;
        for (let char of input) {
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
    }

    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                doc: formatQuery(value),
                extensions: [
                    EditorView.theme({
                        "&": {
                            width: width || "100%",
                        },
                    }),
                    basicSetup,
                    keymap.of([...defaultKeymap]),
                    EditorState.allowMultipleSelections.of(true),
                    triggerLanguage(),
                    indentOnInput(),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            onValueChange(update.state.doc.toString());
                        }
                    }),
                    EditorView.lineWrapping,
                    highlightStyle,
                    badFunctionHighlightExtension(problemTree),
                    EditorState.transactionFilter.of((tr) => {
                        const newTr = [];
                        if (tr.isUserEvent("input.paste")) {
                            tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
                                const newText = formatQuery(inserted.toString().replace(/\s/g, ""));

                                newTr.push({
                                    changes: {
                                        from: fromA,
                                        toA: toA,
                                        fromB: fromB,
                                        toB: toB,
                                        insert: newText,
                                    },
                                });
                            });
                            return newTr;
                        }
                        return tr;
                    }),
                ],
            });

            const view = new EditorView({
                state,
                parent: editorRef.current,
            });

            return () => {
                view.destroy();
            };
        }
    }, []);

    return <div ref={editorRef} />;
};
