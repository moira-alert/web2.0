const storybookHost = "http://localhost:9001";

export const getStoryURL = (storyId: string) => {
    return `${storybookHost}/iframe.html?id=${storyId}`;
};
