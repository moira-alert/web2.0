import { makeTokens, splitFunction } from "./tokenizer";

describe("HighlightInput", () => {
    describe("splitFunction", () => {
        it("space literal", () => {
            expect(splitFunction(" a")).toEqual([" ", "a"]);
            expect(splitFunction("  a")).toEqual(["  ", "a"]);
        });
        it("space literal space", () => {
            expect(splitFunction(" a ")).toEqual([" ", "a", " "]);
        });

        it("one quotes string", () => {
            expect(splitFunction(`'(a"a ,a)'`)).toEqual([`'(a"a ,a)'`]);
        });

        it("double quotes string", () => {
            expect(splitFunction(`"(a'a ,a)"`)).toEqual([`"(a'a ,a)"`]);
        });

        it(`fn ("str", number)`, () => {
            expect(splitFunction(`fn ("str", 10)`)).toEqual([
                `fn`,
                " ",
                "(",
                `"str"`,
                ",",
                " ",
                "10",
                ")",
            ]);
        });
        it(`comma`, () => {
            expect(splitFunction(`,,`)).toEqual([",", ","]);
        });

        it(`fn(fn(arg)`, () => {
            expect(splitFunction(`fn(fn(arg))`)).toEqual(["fn", "(", "fn", "(", "arg", ")", ")"]);
        });

        it(`fn (arg)`, () => {
            expect(splitFunction(`fn (arg)`)).toEqual(["fn", " ", "(", "arg", ")"]);
        });

        it(`fn  (   arg   ,  arg2   )`, () => {
            expect(splitFunction(`fn  (   arg   ,  arg2   )`)).toEqual([
                "fn",
                "  ",
                "(",
                "   ",
                "arg",
                "   ",
                ",",
                "  ",
                "arg2",
                "   ",
                ")",
            ]);
        });
    });

    describe("makeTokens", () => {
        it(`arg`, () => {
            expect(makeTokens(["arg"])).toEqual([
                {
                    value: "arg",
                    type: "variable",
                    startPosition: 0,
                },
            ]);
        });

        it(`fn ()`, () => {
            expect(makeTokens(["fn", " ", "(", ")"])).toEqual([
                {
                    value: "fn",
                    type: "fnName",
                    startPosition: 0,
                },
                {
                    value: " ",
                    type: "empty",
                    startPosition: 2,
                },
                {
                    value: "(",
                    type: "bracket",
                    startPosition: 3,
                },
                {
                    value: ")",
                    type: "bracket",
                    startPosition: 4,
                },
            ]);
        });

        it(`arg1, arg2`, () => {
            expect(makeTokens(["arg1", ",", " ", "arg2"])).toEqual([
                {
                    value: "arg1",
                    type: "variable",
                    startPosition: 0,
                },
                {
                    value: ",",
                    type: "variable",
                    startPosition: 4,
                },
                {
                    value: " ",
                    type: "empty",
                    startPosition: 5,
                },
                {
                    value: "arg2",
                    type: "variable",
                    startPosition: 6,
                },
            ]);
        });
    });
});
