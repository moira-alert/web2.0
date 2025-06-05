import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";

export const withThemeVars = (theme: Theme, keys: Array<keyof Theme>): React.CSSProperties => {
    const cssVars: Record<string, string | number> = {};

    for (const key of keys) {
        const value = theme[key];
        if (value && (typeof value === "string" || typeof value === "number")) {
            cssVars[`--${String(key)}`] = value;
        }
    }

    return cssVars;
};
