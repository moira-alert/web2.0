import React, { useEffect, useRef } from "react";
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, indentSelection } from "@codemirror/commands";
import { indentNodeProp, LanguageSupport } from "@codemirror/language";
import { indentOnInput } from "@codemirror/language";
import { triggerLanguage } from "../../TriggerGrammar/triggerLanguage";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { syntaxTree } from "@codemirror/language";
import { linter, Diagnostic } from "@codemirror/lint";

const highlightStyle = syntaxHighlighting(
    HighlightStyle.define([
        { tag: t.variableName, color: "#6D6BDE" },
        { tag: t.string, color: "#3cb371" },
        { tag: t.number, color: "#b86721" },
    ])
);

interface Props {
    value: string;
    onValueChange: (value: string) => void;
}

export const CodeEditor: React.FC<Props> = ({ value, onValueChange }) => {
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

    // console.log(
    //     parser
    //         .parse(
    //             `aliasByTags(movingSum(seriesByTag('project=EDI' 'subproject=Transport' 'environment=Staging2' 'application=Catalogue_EDI_FtpAvailabilityChecker' 'name=FileTransferFailures') '5min') 'Host' 'Port' 'Encryption' 'Mode')`
    //         )
    //         .toString()
    // );

    const regexpLinter = linter((view) => {
        let diagnostics: Diagnostic[] = [];
        syntaxTree(view.state)
            .cursor()
            .iterate((node) => {
                if (node.name == "String")
                    diagnostics.push({
                        from: node.from,
                        to: node.to,
                        severity: "warning",
                        message: "Regular expressions are FORBIDDEN",
                        actions: [
                            {
                                name: "Remove",
                                apply(view, from, to) {
                                    view.dispatch({ changes: { from, to } });
                                },
                            },
                        ],
                    });
            });
        return diagnostics;
    });
    useEffect(() => {
        if (editorRef.current) {
            const state = EditorState.create({
                doc: formatQuery(value),
                extensions: [
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
                    regexpLinter,
                    EditorState.transactionFilter.of((tr) => {
                        const newTr = [];
                        if (tr.isUserEvent("input.paste")) {
                            tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
                                const newText = formatQuery(inserted.toString().replace(/\s/g, ""));
                                console.log(newText);
                                console.log(inserted);
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
