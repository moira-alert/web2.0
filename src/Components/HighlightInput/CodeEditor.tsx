import React, { useEffect, useRef } from "react";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput, foldAll } from "@codemirror/language";
import { graphiteLanguage } from "../../TriggerGrammar/graphiteLanguage";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { invalidTokensHighlightExtension } from "./invalidTokensHighlightExtension";
import TriggerSource, { TriggerTargetProblem } from "../../Domain/Trigger";
import { formatQuery } from "./formatQuery";
import { TargetQueryEntityColors } from "../../Domain/Target";
import { PromQLExtension } from "@skbkontur-moira/codemirror-metricsql";
import { basicSetup, EditorView } from "codemirror";
import { TransactionSpec, EditorSelection, EditorState } from "@codemirror/state";
import { useTheme, TTheme } from "../../Themes";
import classNames from "classnames/bind";

import styles from "./HighlightInput.module.less";

const cn = classNames.bind(styles);

interface Props {
    value: string;
    triggerSource?: TriggerSource;
    problemTree?: TriggerTargetProblem;
    error?: boolean;
    warning?: boolean;
    disabled?: boolean;
    "data-tid": string;
    onBlur?: () => void;
    onValueChange?: (value: string) => void;
}

const PromQLHighlightStyle = (theme: TTheme) =>
    syntaxHighlighting(
        HighlightStyle.define([
            { tag: t.labelName, color: theme.promQLLabelName },
            { tag: t.string, color: theme.promQLString },
            { tag: t.modifier, color: theme.promQLModifier },
            { tag: t.operatorKeyword, color: theme.promQLOperatorKeyword },
            { tag: t.number, color: theme.promQLNumber },
        ])
    );

const GraphiteHighlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.function(t.variableName), color: TargetQueryEntityColors.functionName },
        { tag: t.variableName, color: TargetQueryEntityColors.variableName },
        { tag: t.string, color: TargetQueryEntityColors.string },
        { tag: t.number, color: TargetQueryEntityColors.number },
    ])
);

const GraphiteTheme = (theme: TTheme) =>
    EditorView.theme({
        ".cm-content": {
            whiteSpace: "break-spaces",
            wordBreak: "break-all",
            flexShrink: "1",
        },
        ".cm-gutters": {
            borderRight: `1px solid ${theme.cmGutterBorder}`,
            backgroundColor: `${theme.cmGutterColor}`,
            color: `${theme.cmLineNumberColor}`,
        },
        ".cm-cursor ": {
            borderLeft: `1px solid ${theme.textColorDefault}`,
        },
        ".cm-tooltip": {
            backgroundColor: `${theme.appBgColorSecondary}`,
        },
        "&.cm-focused": {
            outline: `1px dotted ${theme.appBgColorTertiary}`,
        },
        ".cm-activeLineGutter": {
            backgroundColor: `${theme.cmActiveLineGutter}`,
        },
        ".cm-activeLine": {
            backgroundColor: `${theme.cmActiveLine}`,
        },
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
            backgroundColor: `${theme.cmActiveLine}`,
        },
    });

const ShowModeTheme = (theme: TTheme) =>
    EditorView.theme({
        ".cm-gutters": {
            borderRight: "none",
            backgroundColor: "transparent",
        },

        ".cm-content": {
            whiteSpace: "break-spaces",
            wordBreak: "break-all",
            flexShrink: "1",
        },

        ".cm-lineNumbers ": {
            display: "none !important",
        },

        ".cm-activeLineGutter": {
            backgroundColor: "transparent",
        },

        ".cm-activeLine": {
            backgroundColor: "transparent",
        },
        ".cm-selectionBackground": {
            backgroundColor: `${theme.cmActiveLine}`,
        },
    });

const quadrupleClickCopy = EditorView.mouseSelectionStyle.of((view, event) => {
    if (event.detail !== 4 || event.button !== 0) return null;
    return {
        get() {
            const range = EditorSelection.range(0, view.state.doc.length);
            return EditorSelection.create([range]);
        },
        update() {
            return true;
        },
    };
});

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

export const CodeEditor = React.forwardRef<HTMLDivElement, Props>(function CodeEditor(
    {
        value,
        triggerSource,
        problemTree,
        error,
        warning,
        disabled,
        "data-tid": dataTid,
        onBlur,
        onValueChange,
    },
    validationRef
) {
    const theme = useTheme();
    const editorRef = useRef<HTMLDivElement | null>(null);

    const isPromQl = triggerSource === TriggerSource.PROMETHEUS_REMOTE;

    const promQL = new PromQLExtension();

    const languageToUse = isPromQl ? promQL.asExtension() : graphiteLanguage();

    const GraphiteExtensions = [
        GraphiteTheme(theme),
        basicSetup,
        keymap.of([...defaultKeymap]),
        indentOnInput(),
        EditorView.updateListener.of((update) => {
            if (onValueChange && update.docChanged) {
                onValueChange(update.state.doc.toString().replace(/\n\s*/g, ""));
            }
        }),
        GraphiteHighlightStyle,
        invalidTokensHighlightExtension(problemTree),
        transactionFilter,
        languageToUse,
        quadrupleClickCopy,
    ];

    const ShowModeExtensions = [
        basicSetup,
        languageToUse,
        EditorView.editable.of(!disabled),
        ShowModeTheme(theme),
        quadrupleClickCopy,
    ];

    const PrometeusExtensions = [
        GraphiteTheme(theme),
        basicSetup,
        keymap.of([...defaultKeymap]),
        EditorView.updateListener.of((update) => {
            if (onValueChange && update.docChanged) {
                onValueChange(update.state.doc.toString());
            }
        }),
        languageToUse,
        EditorView.lineWrapping,
        PromQLHighlightStyle(theme),
    ];

    ShowModeExtensions.push(isPromQl ? PrometeusExtensions : GraphiteHighlightStyle);

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
        if (!editorRef.current) {
            return;
        }
        const state = EditorState.create({
            doc: shellFormat(),
            extensions: extensionsToUse(),
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        disabled && foldAll(view);

        return () => {
            view.destroy();
        };
    }, [problemTree, triggerSource]);

    return (
        <div ref={validationRef}>
            <div
                data-tid={dataTid}
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
