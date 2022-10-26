import React from "react";
import { action } from "@storybook/addon-actions";
import SearchSelector from "../Components/SearchSelector/SearchSelector";

export default {
    title: "SearchSelector",
    component: SearchSelector,
};

const subscribed = new Array(5).fill("subscribed").map((v, i) => `${v} ${i}`);
const remaining = [...subscribed, ...new Array(20).fill("remaining").map((v, i) => `${v} ${i}`)];

export const Default = () => (
    <SearchSelector
        search=""
        selectedTokens={[]}
        subscribedTokens={subscribed}
        remainingTokens={remaining}
        onChange={action("onChange")}
        onSearch={action("onSearch")}
    />
);

export const WithSelected = () => (
    <SearchSelector
        search=""
        selectedTokens={["selected"]}
        subscribedTokens={subscribed}
        remainingTokens={remaining}
        onChange={action("onSearch")}
        onSearch={action("onSearch")}
    />
);

export const WithSearchQuery = () => (
    <SearchSelector
        search="remaining"
        selectedTokens={["selected"]}
        subscribedTokens={subscribed}
        remainingTokens={remaining}
        onSearch={action("onSearch")}
        onChange={action("onSearch")}
    />
);

export const NoTagForResult = () => (
    <SearchSelector
        search="trolo-lo-lo"
        selectedTokens={["selected"]}
        subscribedTokens={subscribed}
        remainingTokens={remaining}
        onSearch={action("onSearch")}
        onChange={action("onSearch")}
    />
);
