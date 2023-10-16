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
import { tooltip, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { validateQuery } from "../../Domain/Target";
import { ValidatedDiv } from "./ValidatedDiv";

interface Props {
    value: string;
    width?: string;
    problemTree?: TriggerTargetProblem;
    errorMessage?: string;
    warningMessage?: string;
    onBlur?: () => void;
    onValueChange: (value: string) => void;
}

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.function(t.variableName), color: "#6D6BDE" },
        { tag: t.variableName, color: "#208013" },
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
                    EditorView.theme({
                        "&": {
                            width: width || "100%",
                        },
                    }),
                    basicSetup,
                    keymap.of([...defaultKeymap]),
                    triggerLanguage(),
                    indentOnInput(),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
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
        <ValidationWrapper
            validationInfo={validateQuery(value, warningMessage, errorMessage)}
            renderMessage={tooltip("right middle")}
        >
            <ValidatedDiv ref={editorRef} onBlur={onBlur} />
        </ValidationWrapper>
    );
};
