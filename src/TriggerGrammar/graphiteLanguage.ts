import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { parser } from "./parser";
import { foldNodeProp, foldInside, indentNodeProp, delimitedIndent } from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";
import { functionLabels } from "../Domain/Target";

const initLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                Variable: t.variableName,
                FunctionName: t.function(t.variableName),
                String: t.string,
                Number: t.number,
            }),
            indentNodeProp.add({
                FunctionCall: delimitedIndent({ closing: ")", align: false }),
            }),

            foldNodeProp.add({
                ArgumentList: foldInside,
            }),
        ],
    }),
    languageData: {
        indentOnInput: /^\s*(\)|})$/,
        commentTokens: { line: "//" },
        closeBrackets: { brackets: ["(", "[", "{", '"', "'"] },
    },
});

const functionCompletion = functionLabels.map((label) => ({ label, type: "function" }));

const autoCompletion = initLanguage.data.of({
    autocomplete: completeFromList([...functionCompletion]),
});

export const graphiteLanguage = () => {
    //@ts-ignore LRLanguage is not assigned to Language
    return new LanguageSupport(initLanguage, [autoCompletion]);
};
