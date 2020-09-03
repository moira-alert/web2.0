export function notUndefined<T>(x?: T): x is T {
    return x !== undefined;
}
