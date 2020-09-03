import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { action } from "@storybook/addon-actions";
import { CSFStory } from "creevey";
import NewTagBadge from "../Components/NewTagBadge/NewTagBadge";

export default {
    title: "NewTagBadge",
    decorators: [
        (story: () => ReactNode): ReactElement => <div style={{ padding: 5 }}>{story()}</div>,
    ],
};

export const Default: FunctionComponent = () => (
    <NewTagBadge title="ReplicaClusterError" onClick={action("onClick")} />
);
export const Focused: FunctionComponent = () => (
    <NewTagBadge title="ReplicaClusterError" focus onClick={action("onClick")} />
);
export const WithRemove: CSFStory<JSX.Element> = () => (
    <NewTagBadge
        title="ReplicaClusterError"
        onClick={action("onClick")}
        onRemove={action("onRemove")}
    />
);

WithRemove.story = {
    parameters: {
        creevey: {
            skip: "Unstable draw button angles with border-radius",
        },
    },
};
