export const PagesPaths = {
    index: "/",
    trigger: "/trigger/:id",
    triggerEdit: "/trigger/:id/edit",
    triggerDuplicate: "/trigger/:id/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings/:teamId?",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
    teams: "/teams",
};

export const PagesLinks = {
    index: "/",
    trigger: "/trigger/%id%",
    triggerEdit: "/trigger/%id%/edit",
    triggerDuplicate: "/trigger/%id%/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings/%id%",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
    teams: "/teams",
    docs: "//moira.readthedocs.org/",
};

export type PagePath = keyof typeof PagesPaths;

export type PageLink = keyof typeof PagesLinks;

export function getPagePath(page: PagePath): string {
    return PagesPaths[page];
}

export function getPageLink(page: PageLink, id = ""): string {
    return PagesLinks[page].replace("%id%", id);
}
