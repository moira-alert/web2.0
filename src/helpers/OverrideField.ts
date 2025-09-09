export type OverrideField<T, K extends keyof T, P> = {
    [Key in keyof T]: Key extends K ? P : T[Key];
};
