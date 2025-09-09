export type RequireKeys<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
