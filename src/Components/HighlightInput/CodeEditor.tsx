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
import { formatQuery } from "../../Domain/Target";
interface Props {
    value: string;
    width?: string;
    func?: string;
    position?: number;
    problemTree?: TriggerTargetProblem;
    onBlur?: () => void;
    onValueChange: (value: string) => void;
}

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.variableName, color: "#6D6BDE" },
        { tag: t.string, color: "#3cb371" },
        { tag: t.number, color: "#b86721" },
    ])
);

const transactionFilter = EditorState.transactionFilter.of((tr) => {
    const newTr: {
        changes: {
            from: number;
            toA: number;
            fromB: number;
            toB: number;
            insert: string;
        };
    }[] = [];
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
});

export const CodeEditor: React.FC<Props> = ({
    value,
    problemTree,
    width,
    onBlur,
    onValueChange,
}) => {
    const editorRef = useRef<HTMLDivElement | null>(null);

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
                    transactionFilter,
                ],
            });

            const view = new EditorView({
                state,
                parent: editorRef.current,
            });

            view.contentDOM.onblur = (event) => {
                if (onBlur) {
                    onBlur();
                }
            };

            return () => {
                view.destroy();
            };
        }
    }, []);

    return <div ref={editorRef} />;
};
