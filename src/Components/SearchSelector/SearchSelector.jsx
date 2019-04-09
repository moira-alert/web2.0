// @flow
import * as React from "react";
import Selector from "../Selector/Selector";
import Token from "../Token/Token";
import SelectorInitialView from "./SelectorInitialView";
import SelectorResultsView from "./SelectorResultsView";
import cn from "./SearchSelector.less";

// ToDo вынести в хелперы
const clearInput = (input: string) => {
    let cleared = input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};

// ToDo вынести в хелперы
const searchTokens = (query, items) => {
    const topMatchItems = [];
    const otherItems = [];
    const sort = (a, b) => a.length - b.length;

    const queryLowerCase = query.toLowerCase();

    items.forEach(item => {
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

type Props = {|
    search: string,
    selectedTokens: string[],
    subscribedTokens: string[],
    remainingTokens: string[],
    onChange: (tags: string[], searchString: string) => void,
    onSearch: string => void,
|};

type State = {
    searchText: string,
    clearedSearchValue: string,
};

class SearchSelector extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);

        const { search = "" } = props;

        this.state = {
            searchText: search,
            clearedSearchValue: clearInput(search),
        };

        this.dropdownAnchorRef = React.createRef();

        this.searchInputRef = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        const { searchText } = this.state;
        if (searchText !== prevState.searchText) {
            // ToDo придумать способ по очистке поля ввода без использования componentDidUpdate
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                searchText,
                clearedSearchValue: clearInput(searchText),
            });
        }
    }

    render() {
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

    onRemoveLastToken = () => {
        const { selectedTokens, onChange } = this.props;

        if (!selectedTokens.length) return;
        const index = selectedTokens.length - 1;

        onChange([...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)], "");
    };

    handleInputChange = (value: string) => {
        this.setState({ clearedSearchValue: clearInput(value), searchText: value });
    };

    handleEnterKeyDown = () => {
        const { clearedSearchValue } = this.state;
        const { onSearch } = this.props;

        onSearch(clearedSearchValue);
    };

    handleTokenSelect = (token: string) => {
        const { selectedTokens, onChange } = this.props;

        onChange([...selectedTokens, token], "");

        this.setState({
            searchText: "",
            clearedSearchValue: "",
        });
    };

    handleTokenRemove = (token: string) => {
        const { selectedTokens, onChange } = this.props;
        const { clearedSearchValue } = this.state;

        const index = selectedTokens.indexOf(token);
        if (index === -1) return;

        onChange(
            [...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)],
            clearedSearchValue
        );
    };

    renderToken = token => (
        <Token type="removable" onRemove={this.handleTokenRemove}>
            {token}
        </Token>
    );
}

export { SearchSelector as default };
