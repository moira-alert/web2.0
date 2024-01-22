export function notUndefined<T>(x?: T): x is T {
    return x !== undefined;
}

export const clearInput = (input: string | Array<string>): string => {
    let cleared = Array.isArray(input) ? input.join(" ") : input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};
