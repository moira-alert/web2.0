import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { SearchSelector } from "../Components/SearchSelector/SearchSelector";

const allTags = ["subscribed", "remaining"];

storiesOf("SearchSelector", module)
    .add("default", () => (
        <SearchSelector
            search=""
            allTags={allTags}
            selectedTokens={[]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onChange={action("onChange")}
            onSearch={action("onSearch")}
        />
    ))
    .add("with selected", () => (
        <SearchSelector
            search=""
            allTags={allTags}
            selectedTokens={["subscribed"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onChange={action("onSearch")}
            onSearch={action("onSearch")}
        />
    ))
    .add("with search query", () => (
        <SearchSelector
            search="remaining"
            allTags={allTags}
            selectedTokens={["subscribed"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ))
    .add("no tag for result", () => (
        <SearchSelector
            search="trolo-lo-lo"
            allTags={allTags}
            selectedTokens={["subscribed", "does_not_exist"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ));
