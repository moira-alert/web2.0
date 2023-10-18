import React, { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { triggerLanguage } from "../../TriggerGrammar/triggerLanguage";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { invalidTokensHighlightExtension } from "./invalidTokensHighlightExtension";
import TriggerSource, { TriggerTargetProblem } from "../../Domain/Trigger";
import { formatQuery } from "../../helpers/formatQuery";
import { TargetQueryEntityColors } from "../../Domain/Target";
import { PromQLExtension } from "@prometheus-io/codemirror-promql";
import { TransactionSpec } from "@codemirror/state";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";

const cn = classNames.bind(styles);

interface Props {
    value: string;
    triggerSource?: TriggerSource;
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
    const newTr: TransactionSpec[] = [];
    if (tr.isUserEvent("input.paste")) {
        const currentState = tr.startState;
        //@ts-ignore not working without from-to args
        tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
            const newText = formatQuery(inserted.toString().replace(/\s+/g, " "));

            const { ranges } = currentState.selection;

            if (ranges.length > 0) {
                const tr = currentState.replaceSelection(newText);
                newTr.push(tr);
            }
        });
        return newTr;
    }
    return tr;
});
export const CodeEditor = React.forwardRef<HTMLDivElement, Props>(function CodeEditor(
    { value, triggerSource, problemTree, error, warning, disabled, onBlur, onValueChange },
    validationRef
) {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const promQL = new PromQLExtension();

    const languageToUse =
        triggerSource === TriggerSource.PROMETHEUS_REMOTE
            ? promQL.asExtension()
            : triggerLanguage();

    const extensions = [
        EditorState.readOnly.of(disabled || false),
        basicSetup,
        keymap.of([...defaultKeymap]),
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
        languageToUse,
    ];

    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                doc: formatQuery(value),
                extensions: extensions,
            });

            const view = new EditorView({
                state,
                parent: editorRef.current,
            });

            return () => {
                view.destroy();
            };
        }
    }, [problemTree]);

    return (
        <div ref={validationRef}>
            <div
                className={cn({
                    warning: warning,
                    error: error,
                })}
                ref={editorRef}
                onBlur={onBlur}
            />
        </div>
    );
});
