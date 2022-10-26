import React, { ReactElement } from "react";
import { action } from "@storybook/addon-actions";
import range from "lodash/range";
import TagDropdownSelect from "../Components/TagDropdownSelect/TagDropdownSelect";

export default {
    title: "TagDropdownSelect",
    component: TagDropdownSelect,
};

type Props = {
    allowCreateNewTags?: boolean;
    availableTags: Array<string>;
};

type State = {
    tags: Array<string>;
};

class TagDropdownSelectContainer extends React.Component<Props, State> {
    state: State = {
        tags: [],
    };

    render(): ReactElement {
        const { availableTags, allowCreateNewTags = false } = this.props;
        const { tags } = this.state;
        return (
            <TagDropdownSelect
                width={500}
                allowCreateNewTags={allowCreateNewTags}
                value={tags}
                onChange={(x) => this.setState({ tags: x })}
                availableTags={availableTags}
            />
        );
    }
}

export const Default = () => (
    <TagDropdownSelect
        width={500}
        value={[]}
        onChange={action("onChange")}
        availableTags={["tag1", "tag2"]}
    />
);

export const Statefull = () => <TagDropdownSelectContainer availableTags={["tag1", "tag2"]} />;

export const AllowCreateNewTags = () => (
    <TagDropdownSelectContainer allowCreateNewTags availableTags={["tag1", "tag2"]} />
);

export const StatefullManyTags = () => (
    <TagDropdownSelectContainer
        availableTags={[
            "tag1",
            "tag2",
            ...range(0, 10).map((x) => `'a-tag${x}'`),
            ...range(0, 10).map((x) => `'b-tag${x}'`),
            ...range(0, 10).map((x) => `'c-tag${x}'`),
            ...range(0, 10).map((x) => `'d-tag${x}'`),
            ...range(0, 10).map((x) => `'e-tag${x}'`),
            ...range(0, 10).map((x) => `'z-tag${x}'`),
        ]}
    />
);

export const StatefullAnomalyManyTags = () => (
    <TagDropdownSelectContainer
        availableTags={[
            "tag1",
            "tag2",
            ...range(0, 50).map((x) => `'a-tag${x}'`),
            ...range(0, 50).map((x) => `'b-tag${x}'`),
            ...range(0, 50).map((x) => `'c-tag${x}'`),
            ...range(0, 50).map((x) => `'d-tag${x}'`),
            ...range(0, 50).map((x) => `'e-tag${x}'`),
            ...range(0, 50).map((x) => `'z-tag${x}'`),
        ]}
    />
);

export const ManySelectedTags = () => (
    <TagDropdownSelect
        width={500}
        value={[...range(0, 30).map((x) => `'a-tag${x}'`)]}
        onChange={action("onChange")}
        availableTags={[...range(0, 50).map((x) => `'a-tag${x}'`)]}
    />
);
