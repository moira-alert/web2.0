// @flow
import queryString from "query-string";
import type { Config } from "../Domain/Config";
import type { EventList } from "../Domain/Event";
import type { Trigger, TriggerList, TriggerState } from "../Domain/Trigger";
import type { Settings } from "../Domain/Settings";
import type { TagStat } from "../Domain/Tag";
import type { PatternList } from "../Domain/Pattern";
import type { NotificationList } from "../Domain/Notification";
import type { Contact, ContactList } from "../Domain/Contact";
import type { ContactCreateInfo } from "../Domain/ContactCreateInfo";
import type { Subscription } from "../Domain/Subscription";
import type { Schedule } from "../Domain/Schedule";
import type { MoiraStatus } from "../Domain/MoiraStatus";

export type SubscriptionCreateInfo = {|
    sched: Schedule,
    tags: Array<string>,
    throttling: boolean,
    contacts: Array<string>,
    enabled: boolean,
    user: string,
    id?: string,
    ignore_recoverings: boolean,
    ignore_warnings: boolean,
|};

export type TagList = {|
    list: Array<string>,
|};

export type TagStatList = {|
    list: Array<TagStat>,
|};

export interface IMoiraApi {
    getSettings(): Promise<Settings>;
    getConfig(): Promise<Config>;
    getContactList(): Promise<ContactList>;
    addContact(contact: ContactCreateInfo): Promise<Contact>;
    updateContact(contact: Contact): Promise<Contact>;
    testContact(contactId: string): Promise<void>;
    addSubscription(subscription: SubscriptionCreateInfo): Promise<Subscription>;
    updateSubscription(subscription: Subscription): Promise<Subscription>;
    deleteSubscription(subscriptionId: string): Promise<void>;
    testSubscription(subscriptionId: string): Promise<void>;
    deleteContact(contactId: string): Promise<void>;
    getPatternList(): Promise<PatternList>;
    delPattern(pattern: string): Promise<void>;
    getTagList(): Promise<TagList>;
    getTagStats(): Promise<TagStatList>;
    delTag(tag: string): Promise<void>;
    getTriggerList(page: number, onlyProblems: boolean, tags: Array<string>): Promise<TriggerList>;
    getTrigger(id: string): Promise<Trigger>;
    addTrigger(data: $Shape<Trigger>): Promise<{ [key: string]: string }>;
    setTrigger(id: string, data: $Shape<Trigger>): Promise<{ [key: string]: string }>;
    delTrigger(id: string): Promise<void>;
    setMaintenance(triggerId: string, data: { [metric: string]: number }): Promise<void>;
    getTriggerState(id: string): Promise<TriggerState>;
    getTriggerEvents(id: string, page: number): Promise<EventList>;
    delThrottling(triggerId: string): Promise<void>;
    delMetric(triggerId: string, metric: string): Promise<void>;
    getNotificationList(): Promise<NotificationList>;
    delNotification(id: string): Promise<void>;
    delAllNotifications(): Promise<void>;
    delAllNotificationEvents(): Promise<void>;
    delSubscription(id: string): Promise<void>;
    getMoiraStatus(): Promise<MoiraStatus>;
}

export default class MoiraApi implements IMoiraApi {
    apiUrl: string;
    config: Config;
    triggerListPageSize: number = 20;
    eventHistoryPageSize: number = 100;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async checkStatus(response: Response): Promise<void> {
        if (!(response.status >= 200 && response.status < 300)) {
            const errorText = await response.text();
            let serverResponse;
            try {
                serverResponse = JSON.parse(errorText);
            } catch (error) {
                serverResponse = null;
            }
            if (serverResponse != null) {
                throw new Error(serverResponse.error);
            }
            throw new Error(errorText);
        }
    }

    async get<T>(url: string): Promise<T> {
        const fullUrl = this.apiUrl + url;
        const response = await fetch(fullUrl, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    getConfig(): Promise<Config> {
        return this.get("/config");
    }

    async getSettings(): Promise<Settings> {
        const result = await this.get("/user/settings");
        return result;
    }

    async getContactList(): Promise<ContactList> {
        const url = this.apiUrl + "/contact";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async addContact(contact: ContactCreateInfo): Promise<Contact> {
        const url = this.apiUrl + "/contact";
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(contact),
        });
        await this.checkStatus(response);
        return response.json();
    }

    async testContact(contactId: string): Promise<void> {
        const url = this.apiUrl + "/contact/" + contactId + "/test";
        const response = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async updateContact(contact: Contact): Promise<Contact> {
        const url = this.apiUrl + "/contact/" + contact.id;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(contact),
        });
        await this.checkStatus(response);
        return response.json();
    }

    async addSubscription(subscription: SubscriptionCreateInfo): Promise<Subscription> {
        const url = this.apiUrl + "/subscription";
        if (subscription.id != null) {
            throw new Error("InvalidProgramState: id of subscription must be null or undefined");
        }
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(subscription),
        });
        await this.checkStatus(response);
        return response.json();
    }

    async updateSubscription(subscription: Subscription): Promise<Subscription> {
        const url = this.apiUrl + "/subscription/" + subscription.id;
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
            body: JSON.stringify(subscription),
        });
        await this.checkStatus(response);
        return response.json();
    }

    async deleteSubscription(subscriptionId: string): Promise<void> {
        const url = this.apiUrl + "/subscription/" + subscriptionId;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async testSubscription(subscriptionId: string): Promise<void> {
        const url = this.apiUrl + "/subscription/" + subscriptionId + "/test";
        const response = await fetch(url, {
            method: "PUT",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async deleteContact(contactId: string): Promise<void> {
        const url = this.apiUrl + "/contact/" + contactId;
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getPatternList(): Promise<PatternList> {
        const url = this.apiUrl + "/pattern";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delPattern(pattern: string): Promise<void> {
        const url = this.apiUrl + "/pattern/" + encodeURI(pattern);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getTagList(): Promise<TagList> {
        const url = this.apiUrl + "/tag";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTagStats(): Promise<TagStatList> {
        const url = this.apiUrl + "/tag/stats";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delTag(tag: string): Promise<void> {
        const url = this.apiUrl + "/tag/" + encodeURI(tag);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getTriggerList(page: number, onlyProblems: boolean, tags: Array<string>): Promise<TriggerList> {
        const url =
            this.apiUrl +
            "/trigger/page?" +
            queryString.stringify(
                {
                    /* eslint-disable */
                    p: page,
                    /* eslint-enable */
                    size: this.triggerListPageSize,
                    tags,
                    onlyProblems,
                },
                { arrayFormat: "index", encode: true }
            );
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTrigger(id: string): Promise<Trigger> {
        const url = this.apiUrl + "/trigger/" + encodeURI(id);
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async addTrigger(data: $Shape<Trigger>): Promise<{ [key: string]: string }> {
        const url = this.apiUrl + "/trigger";
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async setTrigger(id: string, data: $Shape<Trigger>): Promise<{ [key: string]: string }> {
        const url = this.apiUrl + "/trigger/" + encodeURI(id);
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delTrigger(id: string): Promise<void> {
        const url = this.apiUrl + "/trigger/" + encodeURI(id);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async setMaintenance(triggerId: string, data: { [metric: string]: number }): Promise<void> {
        const url = this.apiUrl + "/trigger/" + encodeURI(triggerId) + "/maintenance";
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getTriggerState(id: string): Promise<TriggerState> {
        const url = this.apiUrl + "/trigger/" + encodeURI(id) + "/state";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTriggerEvents(id: string, page: number): Promise<EventList> {
        const url = this.apiUrl + "/event/" + encodeURI(id) + "?p=" + page + "&size=" + this.eventHistoryPageSize;
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delThrottling(triggerId: string): Promise<void> {
        const url = this.apiUrl + "/trigger/" + encodeURI(triggerId) + "/throttling";
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async delMetric(triggerId: string, metric: string): Promise<void> {
        const url = this.apiUrl + "/trigger/" + encodeURI(triggerId) + "/metrics?name=" + encodeURI(metric);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getNotificationList(): Promise<NotificationList> {
        const url = this.apiUrl + "/notification?start=0&end=-1";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delNotification(id: string): Promise<void> {
        const url = this.apiUrl + "/notification?id=" + encodeURI(id);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async delAllNotifications(): Promise<void> {
        const url = this.apiUrl + "/notification/all";
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async delAllNotificationEvents(): Promise<void> {
        const url = this.apiUrl + "/event/all";
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async delSubscription(id: string): Promise<void> {
        const url = this.apiUrl + "/subscription/" + encodeURI(id);
        const response = await fetch(url, {
            method: "DELETE",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
    }

    async getMoiraStatus(): Promise<MoiraStatus> {
        const url = this.apiUrl + "/health/notifier";
        const response = await fetch(url, {
            method: "GET",
            credentials: "same-origin",
        });
        await this.checkStatus(response);
        return response.json();
    }
}
