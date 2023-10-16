import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { TriggerTargetProblem } from "./Trigger";
import { isEmptyString } from "../helpers/isEmptyString";

export const functionLabels = [
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
    "asPercent",
    "averageAbove",
    "averageBelow",
    "averageOutsidePercentile",
    "averageSeries",
    "averageSeriesWithWildcards",
    "cactiStyle",
    "changed",
    "color",
    "compressPeriodicGaps",
    "consolidateBy",
    "constantLine",
    "countSeries",
    "cumulative",
    "currentAbove",
    "currentBelow",
    "dashed",
    "delay",
    "derivative",
    "diffSeries",
    "diffSeriesLists",
    "divideSeries",
    "divideSeriesLists",
    "drawAsInfinite",
    "events",
    "exclude",
    "exp",
    "exponentialMovingAverage",
    "fallbackSeries",
    "filterSeries",
    "grep",
    "group",
    "groupByNode",
    "groupByNodes",
    "groupByTags",
    "highest",
    "highestAverage",
    "highestCurrent",
    "highestMax",
    "hitcount",
    "holtWintersAberration",
    "holtWintersConfidenceArea",
    "holtWintersConfidenceBands",
    "holtWintersForecast",
    "identity",
    "integral",
    "integralByInterval",
    "interpolate",
    "invert",
    "isNonNull",
    "keepLastValue",
    "legendValue",
    "limit",
    "lineWidth",
    "linearRegression",
    "logarithm",
    "logit",
    "lowest",
    "lowestAverage",
    "lowestCurrent",
    "mapSeries",
    "maxSeries",
    "maximumAbove",
    "maximumBelow",
    "minMax",
    "minSeries",
    "minimumAbove",
    "minimumBelow",
    "mostDeviant",
    "movingAverage",
    "movingMax",
    "movingMedian",
    "movingMin",
    "movingSum",
    "movingWindow",
    "multiplySeries",
    "multiplySeriesLists",
    "multiplySeriesWithWildcards",
    "nPercentile",
    "nonNegativeDerivative",
    "offset",
    "offsetToZero",
    "perSecond",
    "percentileOfSeries",
    "pieAverage",
    "pieMaximum",
    "pieMinimum",
    "pow",
    "powSeries",
    "randomWalkFunction",
    "rangeOfSeries",
    "reduceSeries",
    "removeAbovePercentile",
    "removeAboveValue",
    "removeBelowPercentile",
    "removeBelowValue",
    "removeBetweenPercentile",
    "removeEmptySeries",
    "roundFunction",
    "scale",
    "scaleToSeconds",
    "secondYAxis",
    "seriesByTag",
    "setXFilesFactor",
    "sigmoid",
    "sinFunction",
    "smartSummarize",
    "sortBy",
    "sortByMaxima",
    "sortByMinima",
    "sortByName",
    "sortByTotal",
    "squareRoot",
    "stacked",
    "stddevSeries",
    "stdev",
    "substr",
    "sumSeries",
    "sumSeriesLists",
    "sumSeriesWithWildcards",
    "summarize",
    "threshold",
    "timeFunction",
    "timeShift",
    "timeSlice",
    "timeStack",
    "toLowerCase",
    "toUpperCase",
    "transformNull",
    "unique",
    "useSeriesAbove",
    "verticalLine",
    "weightedAverage",
];

export function getProblemMessage(
    problemTree: TriggerTargetProblem
): { error?: string; warning?: string } {
    if (problemTree.type === "bad") {
        return { error: `${problemTree.argument}: ${problemTree.description}` };
    }

    let errorMessage: string | undefined = undefined;
    let warningMessage =
        problemTree.type === "warn"
            ? `${problemTree.argument}: ${problemTree.description}`
            : undefined;

    problemTree.problems?.forEach((problem) => {
        if (errorMessage) {
            return;
        }
        const { error, warning } = getProblemMessage(problem);
        if (error) {
            errorMessage = error;
        }
        if (!errorMessage && warningMessage) {
            warningMessage = warning;
        }
    });

    return { error: errorMessage, warning: warningMessage };
}

export function validateQuery(
    value: string,
    warningMessage?: string,
    errorMessage?: string
): ValidationInfo | null {
    if (isEmptyString(value)) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }

    if (errorMessage && warningMessage) {
        return {
            type: "lostfocus",
            level: "error",
            message: null,
        };
    }

    const level = errorMessage ? "error" : warningMessage ? "warning" : null;
    return level
        ? {
              type: "lostfocus",
              level: level,
              message: null,
          }
        : null;
}
