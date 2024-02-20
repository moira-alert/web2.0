import * as React from "react";
import { action } from "@storybook/addon-actions";
import { SearchSelector } from "../Components/SearchSelector/SearchSelector";

const allTags = ["subscribed", "remaining"];

export default {
    title: "SearchSelector",
};

export const Default = {
    render: () => (
        <SearchSelector
            search=""
            allTags={allTags}
            loading={false}
            selectedTokens={[]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onChange={action("onChange")}
            onSearch={action("onSearch")}
        />
    ),

    name: "default",
};

export const WithSelected = {
    render: () => (
        <SearchSelector
            search=""
            allTags={allTags}
            loading={false}
            selectedTokens={["subscribed"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onChange={action("onSearch")}
            onSearch={action("onSearch")}
        />
    ),

    name: "with selected",
};

export const WithSearchQuery = {
    render: () => (
        <SearchSelector
            search="remaining"
            allTags={allTags}
            loading={false}
            selectedTokens={["subscribed"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ),

    name: "with search query",
};

export const NoTagForResult = {
    render: () => (
        <SearchSelector
            search="trolo-lo-lo"
            allTags={allTags}
            loading={false}
            selectedTokens={["subscribed", "does_not_exist"]}
            subscribedTokens={["subscribed"]}
            remainingTokens={["remaining"]}
            onSearch={action("onSearch")}
            onChange={action("onSearch")}
        />
    ),

    name: "no tag for result",
};
