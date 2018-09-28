// @flow
export const PagesPaths = {
    index: "/",
    trigger: "/trigger/:id",
    triggerEdit: "/trigger/:id/edit",
    triggerDuplicate: "/trigger/:id/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
};

export const PagesLinks = {
    index: "/",
    trigger: "/trigger/_id_",
    triggerEdit: "/trigger/_id_/edit",
    triggerDuplicate: "/trigger/_id_/duplicate",
    triggerAdd: "/trigger/new",
    settings: "/settings",
    notifications: "/notifications",
    tags: "/tags",
    patterns: "/patterns",
    docs: "//moira.readthedocs.org/",
};

export type PagePath = $Keys<typeof PagesPaths>;

export type PageLink = $Keys<typeof PagesLinks>;

export function getPagePath(page: PagePath): string {
    return PagesPaths[page];
}

export function getPageLink(page: PageLink, id?: string): string {
    return id ? PagesLinks[page].replace("_id_", id) : PagesLinks[page];
}
