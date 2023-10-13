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
import { tooltip, ValidationInfo, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { isEmptyString } from "./parser/parseExpression";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";

const cn = classNames.bind(styles);
interface Props {
    value: string;
    width?: string;
    problemTree?: TriggerTargetProblem;
    errorMessage?: string;
    warningMessage?: string;
    onBlur?: () => void;
    onSubmit?: () => void;
    onValueChange: (value: string) => void;
}

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.variableName, color: "#6D6BDE" },
        { tag: t.string, color: "#3cb371" },
        { tag: t.number, color: "#b86721" },
    ])
);

function validateInput(value: string, error?: string, warning?: string): ValidationInfo | null {
    if (isEmptyString(value)) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }
    if (error || warning) {
        return {
            type: "lostfocus",
            level: error ? "error" : "warning",
            message: null,
        };
    }

    return null;
}

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
    errorMessage,
    warningMessage,
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

            view.contentDOM.onblur = () => {
                if (onBlur) {
                    onBlur();
                }
            };

            return () => {
                view.destroy();
            };
        }
    }, []);

    return (
        <ValidationWrapperV1
            validationInfo={validateInput(value, errorMessage, warningMessage)}
            renderMessage={tooltip("right middle")}
        >
            <div
                className={cn({ warning: warningMessage && !errorMessage, error: errorMessage })}
                ref={editorRef}
            />
        </ValidationWrapperV1>
    );
};
