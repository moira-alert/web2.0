import React, { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { triggerLanguage } from "../../TriggerGrammar/triggerLanguage";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { invalidTokensHighlightExtension } from "./invalidTokensHighlightExtension";
import { TriggerTargetProblem } from "../../Domain/Trigger";
import { formatQuery } from "../../helpers/formatQuery";
import { TargetQueryEntityColors } from "../../Domain/Target";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";

const cn = classNames.bind(styles);

interface Props {
    value: string;
    problemTree?: TriggerTargetProblem;
    error?: boolean;
    warning?: boolean;
    disabled?: boolean;
    onBlur?: () => void;
    onValueChange?: (value: string) => void;
}

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.function(t.variableName), color: TargetQueryEntityColors.functionName },
        { tag: t.variableName, color: TargetQueryEntityColors.variableName },
        { tag: t.string, color: TargetQueryEntityColors.string },
        { tag: t.number, color: TargetQueryEntityColors.number },
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
            const newText = formatQuery(inserted.toString().replace(/\s+/g, " "));

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
export const CodeEditor = React.forwardRef<HTMLDivElement, Props>(function CodeEditor({
    value,
    problemTree,
    error,
    warning,
    disabled,
    onBlur,
    onValueChange,
}) {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const [savedProblemTree, setSavedProblemTree] = React.useState<
        TriggerTargetProblem | undefined
    >(undefined);

    if (problemTree !== undefined && savedProblemTree === undefined) {
        setSavedProblemTree(problemTree);
    }

    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                doc: formatQuery(value),
                extensions: [
                    EditorState.readOnly.of(disabled || false),
                    basicSetup,
                    keymap.of([...defaultKeymap]),
                    triggerLanguage(),
                    indentOnInput(),
                    EditorView.updateListener.of((update) => {
                        if (!disabled && onValueChange && update.docChanged) {
                            onValueChange(update.state.doc.toString().replace(/\s+/g, " "));
                        }
                    }),
                    EditorView.lineWrapping,
                    highlightStyle,
                    invalidTokensHighlightExtension(problemTree),
                    transactionFilter,
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
    }, [savedProblemTree]);

    return (
        <div
            className={cn({
                warning: warning,
                error: error,
            })}
            ref={editorRef}
            onBlur={onBlur}
        />
    );
});
