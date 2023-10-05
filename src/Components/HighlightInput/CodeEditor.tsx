import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { triggerLanguage } from "../../TriggerGrammar/triggerLanguage";
import { EditorState, EditorStateConfig, Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { parser } from "../../TriggerGrammar/parser";
import React from "react";

const myTheme = createTheme({
    theme: "light",
    settings: {
        selection: "#8a91991a",
        lineHighlight: "#8a91991a",
    },
    styles: [
        { tag: t.variableName, color: "#6D6BDE" },
        { tag: t.string, color: "#3cb371" },
        { tag: t.number, color: "#b86721" },
    ],
});

console.log(
    parser
        .parse(
            "aliasByNode(movingSum(sumSeriesWithWildcards(nonNegativeDerivative(exclude(Billy.SqlErrorsClassified.*.TarifficationService.*.*.*.ErrorsCount.Total-Times,'Billy.SqlErrorsClassified.*.TarifficationService.*.TransactionTimelineHandler_proxy_TryUpdateWriteTicksAsync*.*.ErrorsCount.Total-Times')), 2), '1h'), 2, 3, 4, 5)"
        )
        .toString()
);
interface Props {
    value: string;
    onValueChange: (value: string) => void;
}
export const CodeEditor: React.FC<Props> = ({ value, onValueChange }) => {
    return (
        <CodeMirror
            style={{ borderRadius: "4px" }}
            value={
                "aliasByNode(movingSum(sumSeriesWithWildcards(nonNegativeDerivative(exclude(Billy.SqlErrorsClassified.*.TarifficationService.*.*.*.ErrorsCount.Total-Times,'Billy.SqlErrorsClassified.*.TarifficationService.*.TransactionTimelineHandler_proxy_TryUpdateWriteTicksAsync*.*.ErrorsCount.Total-Times')), 2), '1h'), 2, 3, 4, 5)"
            }
            extensions={[triggerLanguage(), EditorView.lineWrapping]}
            theme={myTheme}
            onChange={onValueChange}
        />
    );
};
