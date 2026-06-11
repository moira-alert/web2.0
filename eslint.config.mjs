import storybook from "eslint-plugin-storybook";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
    {
        ignores: [
            "dist/",
            "node_modules/",
            "src/TriggerGrammar/parser.ts",
            "src/TriggerGrammar/parser.terms.ts",
            "*.config.*",
            "src/types/htmlLegendPlugin.d.ts",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactPlugin.configs.flat.recommended,
    {
        settings: {
            react: {
                version: "detect",
                runtime: "automatic",
            },
        },
    },
    {
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/require-default-props": "off",
        },
    },
    {
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "off",
        },
    },
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaFeatures: { jsx: true },
            },
        },
        rules: {
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    args: "all",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/ban-ts-comment": [
                "error",
                { "ts-ignore": "allow-with-description" },
            ],
        },
    },
    prettierConfig,
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            "prettier/prettier": "error",
        },
    },
    {
        languageOptions: {
            globals: {
                window: "readonly",
                document: "readonly",
                process: "readonly",
                jest: "readonly",
            },
        },
    },
    ...storybook.configs["flat/recommended"],
];
