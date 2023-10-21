import React, { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { graphiteLanguage } from "../../TriggerGrammar/graphiteLanguage";
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

const GraphiteHighlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.function(t.variableName), color: TargetQueryEntityColors.functionName },
        { tag: t.variableName, color: TargetQueryEntityColors.variableName },
        { tag: t.string, color: TargetQueryEntityColors.string },
        { tag: t.number, color: TargetQueryEntityColors.number },
    ])
);

const GraphiteTheme = EditorView.theme({
    ".cm-content": {
        whiteSpace: "break-spaces",
        wordBreak: "break-all",
    },
});

const ShowModeTheme = EditorView.theme({
    ".cm-gutters": {
        display: "none",
    },

    ".cm-activeLine": {
        backgroundColor: "transparent",
    },
});

export const CodeEditor = React.forwardRef<HTMLDivElement, Props>(function CodeEditor(
    { value, triggerSource, problemTree, error, warning, disabled, onBlur, onValueChange },
    validationRef
) {
    const editorRef = useRef<HTMLDivElement | null>(null);

    const isPromQl = triggerSource === TriggerSource.PROMETHEUS_REMOTE;

    const promQL = new PromQLExtension();

    const languageToUse = isPromQl ? promQL.asExtension() : graphiteLanguage();

    const transactionFilter = EditorState.transactionFilter.of((tr) => {
        const newTr: TransactionSpec[] = [];

        if (tr.isUserEvent("input.paste")) {
            const currentState = tr.startState;

            tr.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
                const newText = formatQuery(inserted);

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

    const GraphiteExtensions = [
        GraphiteTheme,
        basicSetup,
        keymap.of([...defaultKeymap]),
        indentOnInput(),
        EditorView.updateListener.of((update) => {
            if (onValueChange && update.docChanged) {
                onValueChange(update.state.doc.toString().replace(/\s+/g, ""));
            }
        }),
        GraphiteHighlightStyle,
        invalidTokensHighlightExtension(problemTree),
        transactionFilter,
        languageToUse,
    ];

    const ShowModeExtensions = [
        basicSetup,
        languageToUse,
        EditorView.editable.of(!disabled),
        ShowModeTheme,
    ];

    if (!isPromQl) {
        ShowModeExtensions.push(GraphiteHighlightStyle);
    }

    const PrometeusExtensions = [
        basicSetup,
        keymap.of([...defaultKeymap]),
        EditorView.updateListener.of((update) => {
            if (onValueChange && update.docChanged) {
                onValueChange(update.state.doc.toString());
            }
        }),
        languageToUse,
        EditorView.lineWrapping,
    ];

    const extensionsToUse = () => {
        if (disabled) {
            return ShowModeExtensions;
        }
        return isPromQl ? PrometeusExtensions : GraphiteExtensions;
    };

    const shellFormat = () => {
        return isPromQl ? value : formatQuery(value);
    };

    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                doc: shellFormat(),
                extensions: extensionsToUse(),
            });

            const view = new EditorView({
                state,
                parent: editorRef.current,
            });

            return () => {
                view.destroy();
            };
        }
    }, [problemTree, triggerSource]);

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
