import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { parser } from "./parser";
import { foldNodeProp, foldInside, indentNodeProp, delimitedIndent } from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";

const exampleLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                // ArgumentList: t.variableName,
                FunctionName: t.function(t.variableName),
                String: t.string,
                Number: t.number,
                "( )": t.paren,
                "[ ]": t.squareBracket,
                "{ }": t.brace,
            }),
            indentNodeProp.add({
                FunctionCall: delimitedIndent({ closing: ")", align: false }),
            }),

            foldNodeProp.add({
                FunctionCall: foldInside,
            }),
        ],
    }),
    languageData: {
        indentOnInput: /^\s*(\)|})$/,
        commentTokens: { line: "//" },
        closeBrackets: { brackets: ["(", "[", "{", '"', "'"] },
    },
});

const functionLabels = [
    "defun",
    "defvar",
    "let",
    "absolute",
    "add",
    "aggregate",
    "aggregateLine",
    "average",
    "avg",
    "avg_zero",
    "median",
    "sum",
    "total",
    "min",
    "max",
    "diff",
    "stddev",
    "count",
    "range",
    "rangeOf",
    "multiply",
    "last",
    "current",
    "aggregateSeriesLists",
    "aggregateWithWildcards",
    "alias",
    "aliasByMetric",
    "aliasByNode",
    "aliasByTags",
    "aliasQuery",
    "aliasSub",
    "alpha",
    "applyByNode",
    "areaBetween",
];

const functionCompletion = functionLabels.map((label) => ({ label, type: "function" }));

const exampleCompletion = exampleLanguage.data.of({
    autocomplete: completeFromList([...functionCompletion]),
});

export const triggerLanguage = () => {
    return new LanguageSupport(exampleLanguage, [exampleCompletion]);
};
