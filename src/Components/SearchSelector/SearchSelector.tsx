import React, { useState, useEffect, ReactElement } from "react";
import Selector from "../Selector/Selector";
import { Token } from "../Token/Token";
import SelectorInitialView from "./SelectorInitialView";
import SelectorResultsView from "./SelectorResultsView";
import { clearInput } from "../../helpers/common";
import { getTokenType, searchTokens } from "../../helpers/trigger-search";
import classNames from "classnames/bind";

import styles from "./SearchSelector.module.less";

const cn = classNames.bind(styles);

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

const renderToken = (
    token: string,
    allTags: string[],
    loading: boolean,
    handleTokenRemove: (token: string) => void
): ReactElement => (
    <Token type={getTokenType(token, allTags, loading)} onRemove={handleTokenRemove}>
        {token}
    </Token>
);

export const SearchSelector: React.FC<Props> = ({
    search = "",
    allTags,
    loading,
    selectedTokens,
    subscribedTokens,
    remainingTokens,
    onChange,
    onSearch,
}) => {
    const [searchText, setSearchText] = useState(search);
    const [clearedSearchValue, setClearedSearchValue] = useState(clearInput(search));

    useEffect(() => {
        setClearedSearchValue(clearInput(searchText));
    }, [searchText]);

    const handleInputChange = (value: string): void => {
        setSearchText(value);
    };

    const handleEnterKeyDown = (): void => {
        onSearch(clearedSearchValue);
    };

    const handleTokenSelect = (token: string): void => {
        onChange([...selectedTokens, token], "");
        setSearchText("");
        setClearedSearchValue("");
    };

    const handleTokenRemove = (token: string): void => {
        const index = selectedTokens.indexOf(token);
        if (index === -1) return;

        onChange(
            [...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)],
            clearedSearchValue
        );
    };

    const onRemoveLastToken = (): void => {
        if (!selectedTokens.length) return;
        const index = selectedTokens.length - 1;

        onChange(
            [...selectedTokens.slice(0, index), ...selectedTokens.slice(index + 1)],
            clearedSearchValue
        );
    };

    const resultTokens = searchTokens(clearedSearchValue, remainingTokens);

    return (
        <Selector
            search={searchText}
            tokens={selectedTokens}
            renderToken={(token) => renderToken(token, allTags, loading, handleTokenRemove)}
            onEnterKeyDown={handleEnterKeyDown}
            onBackspaceKeyDown={onRemoveLastToken}
            onInputChange={handleInputChange}
        >
            <div className={cn("container")}>
                {clearedSearchValue === "" ? (
                    <SelectorInitialView tokens={subscribedTokens} onSelect={handleTokenSelect} />
                ) : (
                    <SelectorResultsView tokens={resultTokens} onSelect={handleTokenSelect} />
                )}
            </div>
        </Selector>
    );
};
