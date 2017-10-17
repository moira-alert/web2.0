// @flow
import queryString from 'query-string';
import type { Config } from '../Domain/Config';
import type { EventList } from '../Domain/Event';
import type { Trigger, TriggerList, TriggerState } from '../Domain/Trigger';
import type { Settings } from '../Domain/Settings';
import type { TagStat } from '../Domain/Tag';
import type { PatternList } from '../Domain/Pattern';
import type { NotificationList } from '../Domain/Notification';
import type { ContactList } from '../Domain/Contact';

export type TagList = {|
    list: Array<string>;
|};

export type TagStatList = {|
    list: Array<TagStat>;
|};

export interface IMoiraApi {
    getSettings(): Promise<Settings>;
    getContactList(): Promise<ContactList>;
    // delContact(contact: string): Promise<void>;
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
    deltNotification(id: string): Promise<void>;
    delSubscription(id: string): Promise<void>;
}

export default class Api implements IMoiraApi {
    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async checkStatus(response: Response): Promise<void> {
        if (!(response.status >= 200 && response.status < 300)) {
            const errorText = await response.text();
            let serverResponse;
            try {
                serverResponse = JSON.parse(errorText);
            }
            catch (error) {
                serverResponse = null;
            }
            if (serverResponse != null) {
                throw new Error(serverResponse.error);
            }
            throw new Error(errorText);
        }
    }

    async getSettings(): Promise<Settings> {
        const url = this.config.apiUrl + '/user/settings';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getContactList(): Promise<ContactList> {
        const url = this.config.apiUrl + '/contact';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    // async delContact(contact: string): Promise<void> {
    //     const url = this.config.apiUrl + '/contact/' + contact;
    //     const response = await fetch(url, { method: 'DELETE' });
    //     await this.checkStatus(response);
    //     return;
    // }

    async getPatternList(): Promise<PatternList> {
        const url = this.config.apiUrl + '/pattern';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delPattern(pattern: string): Promise<void> {
        const url = this.config.apiUrl + '/pattern/' + encodeURI(pattern);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async getTagList(): Promise<TagList> {
        const url = this.config.apiUrl + '/tag';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTagStats(): Promise<TagStatList> {
        const url = this.config.apiUrl + '/tag/stats';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delTag(tag: string): Promise<void> {
        const url = this.config.apiUrl + '/tag/' + encodeURI(tag);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async getTriggerList(page: number, onlyProblems: boolean, tags: Array<string>): Promise<TriggerList> {
        const url =
            this.config.apiUrl +
            '/trigger/page?' +
            queryString.stringify(
                {
                    /* eslint-disable */
                    p: page,
                    /* eslint-enable */
                    size: this.config.paging.triggerList,
                    tags,
                    onlyProblems,
                },
                { arrayFormat: 'index', encode: true }
            );
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTrigger(id: string): Promise<Trigger> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(id);
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async addTrigger(data: $Shape<Trigger>): Promise<{ [key: string]: string }> {
        const url = this.config.apiUrl + '/trigger';
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async setTrigger(id: string, data: $Shape<Trigger>): Promise<{ [key: string]: string }> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(id);
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delTrigger(id: string): Promise<void> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(id);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async setMaintenance(triggerId: string, data: { [metric: string]: number }): Promise<void> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(triggerId) + '/maintenance';
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async getTriggerState(id: string): Promise<TriggerState> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(id) + '/state';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async getTriggerEvents(id: string, page: number): Promise<EventList> {
        const url =
            this.config.apiUrl + '/event/' + encodeURI(id) + '?p=' + page + '&size=' + this.config.paging.eventHistory;
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async delThrottling(triggerId: string): Promise<void> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(triggerId) + '/throttling';
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async delMetric(triggerId: string, metric: string): Promise<void> {
        const url = this.config.apiUrl + '/trigger/' + encodeURI(triggerId) + '/metrics?name=' + encodeURI(metric);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async getNotificationList(): Promise<NotificationList> {
        const url = this.config.apiUrl + '/notification?start=0&end=-1';
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return response.json();
    }

    async deltNotification(id: string): Promise<void> {
        const url = this.config.apiUrl + '/notification?id=' + encodeURI(id);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }

    async delSubscription(id: string): Promise<void> {
        const url = this.config.apiUrl + '/subscription/' + encodeURI(id);
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin'
        });
        await this.checkStatus(response);
        return;
    }
}
