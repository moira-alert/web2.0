import difference from "lodash/difference";

export const handleBackspace = (
    caret: number,
    value: string[],
    onChange: (tags: string[]) => void
) => {
    if (caret === 0 && value.length) {
        onChange(difference(value, [value[value.length - 1]]));
    }
};

export const handleArrowUp = (
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>,
    allowCreateNewTags: boolean | undefined,
    filteredTagsLength: number
) => {
    setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : allowCreateNewTags ? filteredTagsLength + 1 : filteredTagsLength
    );
};

export const handleArrowDown = (
    setFocusedIndex: React.Dispatch<React.SetStateAction<number>>,
    allowCreateNewTags: boolean | undefined,
    filteredTagsLength: number,
    tagExists: (name: string) => boolean,
    inputValue: string
) => {
    setFocusedIndex((prev) =>
        allowCreateNewTags && !tagExists(inputValue)
            ? prev < filteredTagsLength + 1
                ? prev + 1
                : 0
            : prev < filteredTagsLength
            ? prev + 1
            : 0
    );
};

export const handleEnter = ({
    inputValue,
    focusedIndex,
    allowCreateNewTags,
    tagExists,
    filteredTags,
    selectTag,
    setInputValue,
}: {
    inputValue: string;
    focusedIndex: number;
    allowCreateNewTags?: boolean;
    tagExists: (name: string) => boolean;
    filteredTags: string[];
    selectTag: (tag: string) => void;
    setInputValue: (value: string) => void;
}) => {
    if (inputValue.trim() === "") return;

    if (focusedIndex !== 0) {
        if (
            allowCreateNewTags &&
            !tagExists(inputValue) &&
            focusedIndex === filteredTags.length + 1
        ) {
            selectTag(inputValue.trim());
        } else {
            selectTag(filteredTags[focusedIndex - 1]);
        }
    } else {
        if (allowCreateNewTags && !tagExists(inputValue)) {
            selectTag(inputValue.trim());
        } else if (filteredTags.length) {
            selectTag(filteredTags[filteredTags.length - 1]);
        }
    }

    setInputValue("");
};
