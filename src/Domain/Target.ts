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
    "removeAboveValue",
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
    node: TriggerTargetProblem
): { error?: string; warning?: string } {
    let error: string | undefined = undefined;
    let warning: string | undefined = undefined;

    if (node.type === "bad") {
        error = `${node.argument}: ${node.description}`;
    } else if (node.type === "warn") {
        warning = `${node.argument}: ${node.description}`;
    }

    if (node.problems) {
        for (const problem of node.problems) {
            const message = getProblemMessage(problem);
            if (message.error) {
                error = message.error;
                break;
            }

            if (!error && message.warning) {
                warning = message.warning;
            }
        }
    }

    return { error, warning };
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
            type: "immediate",
            level: "error",
            message: null,
        };
    }

    const level = errorMessage ? "error" : warningMessage ? "warning" : null;
    return level
        ? {
              type: "immediate",
              level: level,
              message: null,
          }
        : null;
}

export enum TargetQueryEntityColors {
    functionName = "#6D6BDE",
    variableName = "#208013",
    string = "#3cb371",
    number = "#b86721",
}

export const BadFunctionStyles = {
    ".redFunction": {
        backgroundColor: "#fcb6b1",
        borderRadius: "2px",
    },
    ".yellowFunction": {
        backgroundColor: "#fce56f",
        borderRadius: "2px",
    },
    ".unmatchedBracket": {
        backgroundColor: "#fcb6b1",
        borderRadius: "2px",
    },
};
