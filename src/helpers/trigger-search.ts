import { TokenType } from "./TokenType";

export const searchTokens = (query: string, items: string[]): string[] => {
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

export const getTokenType = (token: string, allTags: string[], loading: boolean): TokenType => {
    if (loading) {
        return TokenType.REMOVABLE;
    }

    return allTags.includes(token) ? TokenType.REMOVABLE : TokenType.NONEXISTENT;
};
