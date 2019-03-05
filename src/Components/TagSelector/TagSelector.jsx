// @flow
import * as React from "react";
import TokenInput, { TokenInputType } from "retail-ui/components/TokenInput";
import Token from "retail-ui/components/Token";

type Props = {
    allItems: string[],
    selectedItems: string[],
    allowAddTag?: boolean,
    onChange: (items: string[]) => void,
};

class TagSelector extends React.Component<Props> {
    props: Props;

    render() {
        const { selectedItems, allowAddTag, onChange } = this.props;

        return (
            <TokenInput
                type={allowAddTag ? TokenInputType.Combined : TokenInputType.WithReference}
                width="100%"
                placeholder="Select a tag"
                selectedItems={selectedItems}
                getItems={this.getItems}
                onChange={onChange}
                renderToken={(item, { isActive, onRemove }) => (
                    <Token
                        key={item.toString()}
                        colors={{
                            idle: "defaultIdle",
                            active: "defaultActive",
                        }}
                        isActive={isActive}
                        onRemove={onRemove}
                    >
                        {item}
                    </Token>
                )}
                hideMenuIfEmptyInputValue
            />
        );
    }

    getItems = query => {
        const { allItems } = this.props;

        const topMatchItems = [];
        const otherItems = [];
        const sort = (a, b) => a.length - b.length;

        const queryLowerCase = query.toLowerCase();

        allItems.forEach(item => {
            const itemLowerCase = item.toLowerCase();
            const index = itemLowerCase.indexOf(queryLowerCase);

            if (index === -1) {
                return;
            }

            if (index === 0) {
                topMatchItems.push(item);
            }

            const prevChar = itemLowerCase[index - 1];

            if (prevChar === " " || prevChar === "." || prevChar === "-") {
                otherItems.push(item);
            }
        });

        return Promise.resolve([...topMatchItems.sort(sort), ...otherItems.sort(sort)]);
    };
}

export { TagSelector as default };
