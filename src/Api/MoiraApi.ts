import * as queryString from "query-string";
import { Config } from "../Domain/Config";
import { EventList } from "../Domain/Event";
import { Trigger, TriggerList, TriggerState, ValidateTriggerResult } from "../Domain/Trigger";
import { Settings } from "../Domain/Settings";
import { TagStat } from "../Domain/Tag";
import { PatternList } from "../Domain/Pattern";
import { NotificationList } from "../Domain/Notification";
import { Contact, ContactList } from "../Domain/Contact";
import { ContactCreateInfo } from "../Domain/ContactCreateInfo";
import { Subscription } from "../Domain/Subscription";
import { Schedule } from "../Domain/Schedule";
import { NotifierState } from "../Domain/MoiraServiceStates";
import { Team } from "../Domain/Team";

export type SubscriptionCreateInfo = {
    sched: Schedule;
    tags: Array<string>;
    throttling: boolean;
    contacts: Array<string>;
    enabled: boolean;
    any_tags: boolean;
    user?: string;
    id?: string;
    ignore_recoverings: boolean;
    ignore_warnings: boolean;
    plotting?: {
        enabled: boolean;
        theme: "light" | "dark";
    };
};

export type TagList = {
    list: Array<string>;
};

export type TagStatList = {
    list: Array<TagStat>;
};

export class ApiError extends Error {
    status: number;

    constructor({ message, status }: { message: string; status: number }) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const statusCode = {
    NOT_FOUND: 404,
};

export { statusCode };

export default class MoiraApi {
    apiUrl: string;

    config?: Config;

    triggerListPageSize = 20;

    eventHistoryPageSize = 100;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    static async checkStatus(response: Response): Promise<void> {
        if (!(response.status >= 200 && response.status < 300)) {
            const serverResponse = await response.json();

            throw new ApiError({
                message: serverResponse
                    ? serverResponse.status +
                      (serverResponse.error ? `: ${serverResponse.error}` : "")
                    : serverResponse.error,
                status: response.status,
            });
        }
    }

    async get<T>(url: string, init?: RequestInit): Promise<T> {
        const fullUrl = this.apiUrl + url;
        const response = await fetch(fullUrl, {
            ...init,
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    getConfig(): Promise<Config> {
        return this.get<Config>("/config");
    }

    async getUser(): Promise<{ login: string }> {
        return this.get<{ login: string }>("/user");
    }

    async getSettings(): Promise<Settings> {
        const result = await this.get<Settings>("/user/settings");

        result.subscriptions.forEach((s) => {
            s.tags = s.tags === null ? [] : s.tags;
        });
        return result;
    }

    async getContactList(): Promise<ContactList> {
        const url = `${this.apiUrl}/contact`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    getSettingsByTeam(teamId: string): Promise<Settings> {
        return this.get<Settings>(`/teams/${encodeURI(teamId)}/settings`);
    }

    async addContact(contact: ContactCreateInfo): Promise<Contact> {
        const url = `${this.apiUrl}/contact`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(contact),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addTeamContact(contact: ContactCreateInfo, team: Team): Promise<Contact> {
        const url = `${this.apiUrl}/teams/${encodeURI(team.id)}/contacts`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(contact),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async testContact(contactId: string): Promise<void> {
        const url = `${this.apiUrl}/contact/${encodeURI(contactId)}/test`;
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async updateContact(contact: Contact): Promise<Contact> {
        const url = `${this.apiUrl}/contact/${encodeURI(contact.id)}`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(contact),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addSubscription(subscription: SubscriptionCreateInfo): Promise<Subscription> {
        const url = `${this.apiUrl}/subscription`;
        if (subscription.id != null) {
            throw new Error("InvalidProgramState: id of subscription must be null or undefined");
        }
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(subscription),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addTeamSubscription(
        subscription: SubscriptionCreateInfo,
        team: Team
    ): Promise<Subscription> {
        const url = `${this.apiUrl}/teams/${encodeURI(team.id)}/subscriptions`;
        if (subscription.id != null) {
            throw new Error("InvalidProgramState: id of subscription must be null or undefined");
        }
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(subscription),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async updateSubscription(subscription: Subscription): Promise<Subscription> {
        const url = `${this.apiUrl}/subscription/${encodeURI(subscription.id)}`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(subscription),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async testSubscription(subscriptionId: string): Promise<void> {
        const url = `${this.apiUrl}/subscription/${encodeURI(subscriptionId)}/test`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async deleteContact(contactId: string): Promise<void> {
        const url = `${this.apiUrl}/contact/${encodeURI(contactId)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getPatternList(): Promise<PatternList> {
        const url = `${this.apiUrl}/pattern`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delPattern(pattern: string): Promise<void> {
        const url = `${this.apiUrl}/pattern/${encodeURI(pattern)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getTagList(): Promise<TagList> {
        const url = `${this.apiUrl}/tag`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async getTagStats(): Promise<TagStatList> {
        const url = `${this.apiUrl}/tag/stats`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delTag(tag: string): Promise<void> {
        const url = `${this.apiUrl}/tag/${encodeURI(tag)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getTriggerList(
        page: number,
        onlyProblems: boolean,
        tags: Array<string>,
        searchText: string
    ): Promise<TriggerList> {
        const url = `${this.apiUrl}/trigger/search?${queryString.stringify(
            {
                p: page,
                size: this.triggerListPageSize,
                tags,
                onlyProblems,
                text: searchText,
            },
            { arrayFormat: "index", encode: true }
        )}`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async getTrigger(id: string, params?: { populated: boolean }): Promise<Trigger> {
        const url = `${this.apiUrl}/trigger/${encodeURI(id)}${
            params ? `?${queryString.stringify(params)}` : ""
        }`;

        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addTrigger(
        data: Partial<Trigger>
    ): Promise<{
        [key: string]: string;
    }> {
        const url = `${this.apiUrl}/trigger`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async setTrigger(
        id: string,
        data: Partial<Trigger>
    ): Promise<{
        [key: string]: string;
    }> {
        const url = `${this.apiUrl}/trigger/${encodeURI(id)}`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });

        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delTrigger(id: string): Promise<void> {
        const url = `${this.apiUrl}/trigger/${encodeURI(id)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    validateTrigger = async (trigger: Partial<Trigger>): Promise<ValidateTriggerResult> => {
        const url = `${this.apiUrl}/trigger/check`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(trigger),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    };

    async setMaintenance(
        triggerId: string,
        data: {
            trigger?: number;
            metrics?: {
                [metric: string]: number;
            };
        }
    ): Promise<void> {
        const url = `${this.apiUrl}/trigger/${encodeURI(triggerId)}/setMaintenance`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getTriggerState(id: string): Promise<TriggerState> {
        const url = `${this.apiUrl}/trigger/${encodeURI(id)}/state`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async getTriggerEvents(id: string, page: number): Promise<EventList> {
        const url = `${this.apiUrl}/event/${encodeURI(id)}?p=${page}&size=${
            this.eventHistoryPageSize
        }`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delThrottling(triggerId: string): Promise<void> {
        const url = `${this.apiUrl}/trigger/${encodeURI(triggerId)}/throttling`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async delMetric(triggerId: string, metric: string): Promise<void> {
        const url = `${this.apiUrl}/trigger/${encodeURI(
            triggerId
        )}/metrics?name=${encodeURIComponent(metric)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async delNoDataMetric(triggerId: string): Promise<void> {
        const url = `${this.apiUrl}/trigger/${encodeURI(triggerId)}/metrics/nodata`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getNotificationList(): Promise<NotificationList> {
        const url = `${this.apiUrl}/notification?start=0&end=-1`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delNotification(id: string): Promise<void> {
        const url = `${this.apiUrl}/notification?id=${encodeURI(id)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async delAllNotifications(): Promise<void> {
        const url = `${this.apiUrl}/notification/all`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async delAllNotificationEvents(): Promise<void> {
        const url = `${this.apiUrl}/event/all`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async delSubscription(subscriptionId: string): Promise<void> {
        const url = `${this.apiUrl}/subscription/${encodeURI(subscriptionId)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getNotifierState(): Promise<NotifierState> {
        const url = `${this.apiUrl}/health/notifier`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async setNotifierState(status: NotifierState): Promise<NotifierState> {
        const url = `${this.apiUrl}/health/notifier`;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(status),
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async getTeams(): Promise<{ teams: Team[] }> {
        const url = `${this.apiUrl}/teams`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addTeam(team: Partial<Team>): Promise<{ id: string }> {
        const url = `${this.apiUrl}/teams`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(team),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async updateTeam(team: Team): Promise<{ id: string }> {
        const url = `${this.apiUrl}/teams/${encodeURI(team.id)}`;
        const response = await fetch(url, {
            method: "PATCH",
            body: JSON.stringify(team),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delTeam(teamId: string): Promise<void> {
        const url = `${this.apiUrl}/teams/${encodeURI(teamId)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }

    async getUsers(teamId: string): Promise<{ usernames: string[] }> {
        const url = `${this.apiUrl}/teams/${encodeURI(teamId)}/users`;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async addUser(teamId: string, userName: string): Promise<void> {
        const url = `${this.apiUrl}/teams/${encodeURI(teamId)}/users`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ usernames: [userName] }),
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
        return response.json();
    }

    async delUser(teamId: string, userName: string): Promise<void> {
        const url = `${this.apiUrl}/teams/${encodeURI(teamId)}/users/${encodeURI(userName)}`;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await MoiraApi.checkStatus(response);
    }
}
