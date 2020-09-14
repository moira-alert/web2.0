import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import SearchSelector from "../Components/SearchSelector/SearchSelector";

const subscribed = new Array(5).fill("subscribed").map((v, i) => `${v} ${i}`);
const remaining = [...subscribed, ...new Array(20).fill("remaining").map((v, i) => `${v} ${i}`)];

storiesOf("SearchSelector", module)
    .add("default", () => (
        <SearchSelector
            search=""
            selectedTokens={[]}
            subscribedTokens={subscribed}
            remainingTokens={remaining}
            onChange={action("onChange")}
            onSearch={action("onSearch")}
        />
    ))
    .add("with selected", () => (
        <SearchSelector
            search=""
            selectedTokens={["selected"]}
            subscribedTokens={subscribed}
            remainingTokens={remaining}
            onChange={action("onSearch")}
            onSearch={action("onSearch")}
        />
    ))
    .add("with search query", () => (
        <SearchSelector
            search="remaining"
            selectedTokens={["selected"]}
            subscribedTokens={subscribed}
            remainingTokens={remaining}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ))
    .add("no tag for result", () => (
        <SearchSelector
            search="trolo-lo-lo"
            selectedTokens={["selected"]}
            subscribedTokens={subscribed}
            remainingTokens={remaining}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ));
