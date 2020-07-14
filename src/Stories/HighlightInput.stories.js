// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import HighlightInput from "../Components/HighlightInput/HighlightInput";

function Container({ defaultValue, children }) {
    const [value, setValue] = useState(defaultValue);

    return <div style={{ margin: "30px" }}>{children(value, setValue)}</div>;
}

storiesOf("HighlightInput", module)
    .add("Highlight errors", () => (
        <Container defaultValue="func (first, secondFn)">
            {(value, setValue) => (
                <HighlightInput
                    value={value}
                    onValueChange={setValue}
                    validate={{
                        syntax_ok: true,
                        tree_of_problems: {
                            argument: "func",
                            description:
                                "This function is unstable: it can return different historical values with each evaluation. Moira will show unexpected values that you don't see on your graphs.",
                            position: 0,
                            type: "warn",
                            problems: [
                                { argument: "first", position: 0 },
                                {
                                    argument: "secondFn",
                                    position: 1,
                                    type: "bad",
                                    description:
                                        "The function summarize has a time sampling parameter 13week larger than allowed by the config:3h0m0s",
                                },
                            ],
                        },
                    }}
                />
            )}
        </Container>
    ))
    .add("With syntax fail", () => (
        <HighlightInput
            value="func (first, secondFn)"
            onValueChange={action("onValueChange")}
            validate={{
                syntax_ok: false,
            }}
        />
    ));
