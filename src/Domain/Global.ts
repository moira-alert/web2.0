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
    contacts: "/contacts",
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
    contacts: "/contacts",
};

export type PagePath = keyof typeof PagesPaths;

export type PageLink = keyof typeof PagesLinks;

export function getPagePath(page: PagePath): string {
    return PagesPaths[page];
}

export function getPageLink(page: PageLink, id = ""): string {
    return PagesLinks[page].replace("%id%", id);
}

export const ConfirmModalHeaderData = {
    deleteAllNotifications: (notificationAmount: number) =>
        `Are you sure with deleting all ${notificationAmount} notifications?`,
    deleteDeliveryChannel:
        "Can't delete this delivery channel. This will disrupt the functioning of the following subscriptions:",
    deleteNotification: "Are you sure with deleting notification?",
    deleteTrigger: "Delete Trigger?",
    moiraTurnOff: "This action will turn off Moira notifications, are you sure?",
};

export enum ModalType {
    subscriptionEditModal = "subscriptionEditModal",
    newSubscriptionModal = "newSubscriptionModal",
}
