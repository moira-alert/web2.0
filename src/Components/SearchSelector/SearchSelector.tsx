import * as React from "react";
import Selector from "../Selector/Selector";
import Token from "../Token/Token";
import SelectorInitialView from "./SelectorInitialView";
import SelectorResultsView from "./SelectorResultsView";
import { clearInput } from "../../helpers/common";
import cn from "./SearchSelector.less";

// ToDo вынести в хелперы
const searchTokens = (query: string, items: string[]): string[] => {
    const topMatchItems: string[] = [];
    const otherItems: string[] = [];
    const sort = (a: string, b: string) => a.length - b.length;

    const queryLowerCase = query.toLowerCase();

    items.forEach((item) => {
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

    return [...topMatchItems.sort(sort), ...otherItems.sort(sort)];
};

type Props = {
    search: string;
    allTags: string[];
    loading: boolean;
    selectedTokens: string[];
    subscribedTokens: string[];
    remainingTokens: string[];
    onChange: (tags: string[], searchString: string) => void;
    onSearch: (query: string) => void;
};

type State = {
    searchText: string;
    clearedSearchValue: string;
};

export class SearchSelector extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);

        const { search = "" } = props;

        this.state = {
            searchText: search,
            clearedSearchValue: clearInput(search),
        };
    }

    render(): React.ReactElement {
        const { selectedTokens, subscribedTokens, remainingTokens } = this.props;
        const { clearedSearchValue, searchText } = this.state;

        const resultTokens = searchTokens(clearedSearchValue, remainingTokens);

        return (
            <Selector
                search={searchText}
                tokens={selectedTokens}
                renderToken={this.renderToken}
                onEnterKeyDown={this.handleEnterKeyDown}
                onBackspaceKeyDown={this.onRemoveLastToken}
                onInputChange={this.handleInputChange}
            >
                <div className={cn("container")}>
                    {clearedSearchValue === "" ? (
                        <SelectorInitialView
                            tokens={subscribedTokens}
                            onSelect={this.handleTokenSelect}
                        />
                    ) : (
                        <SelectorResultsView
                            tokens={resultTokens}
                            onSelect={this.handleTokenSelect}
                        />
                    )}
                </div>
            </Selector>
        );
    }

    onRemoveLastToken = (): void => {
        const { selectedTokens, onChange } = this.props;
        const { clearedSearchValue } = this.state;

        if (!selectedTokens.length) return;
        const index = selectedTokens.length - 1;

        onChange(
            [...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)],
            clearedSearchValue
        );
    };

    handleInputChange = (value: string): void => {
        this.setState({ clearedSearchValue: clearInput(value), searchText: value });
    };

    handleEnterKeyDown = (): void => {
        const { clearedSearchValue } = this.state;
        const { onSearch } = this.props;

        onSearch(clearedSearchValue);
    };

    handleTokenSelect = (token: string): void => {
        const { selectedTokens, onChange } = this.props;

        onChange([...selectedTokens, token], "");

        this.setState({
            searchText: "",
            clearedSearchValue: "",
        });
    };

    handleTokenRemove = (token: string): void => {
        const { selectedTokens, onChange } = this.props;
        const { clearedSearchValue } = this.state;

        const index = selectedTokens.indexOf(token);
        if (index === -1) return;

        onChange(
            [...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)],
            clearedSearchValue
        );
    };

    getTokenType = (token: string) => {
        if (this.props.loading) {
            return "removable";
        }

        return this.props.allTags.includes(token) ? "removable" : "nonexistent";
    };

    renderToken = (token: string): React.ReactElement => (
        <Token type={this.getTokenType(token)} onRemove={this.handleTokenRemove}>
            {token}
        </Token>
    );
}
