const storybookHost = "http://localhost:9001";

export const getStoryURL = (storyId: string, theme?: "Light" | "Dark") => {
    const base = `${storybookHost}/iframe.html?id=${storyId}`;
    if (theme) {
        return `${base}&globals=theme:${theme}`;
    }
    return base;
};
