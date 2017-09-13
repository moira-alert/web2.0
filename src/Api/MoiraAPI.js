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
    getContactList(): Promise<ContactList>;
    delContact(contact: string): Promise<void>;
    getPatternList(): Promise<PatternList>;
    delPattern(pattern: string): Promise<void>;
    getTagList(): Promise<TagList>;
    getTagStats(): Promise<TagStatList>;
    delTag(tag: string): Promise<void>;
    getSettings(): Promise<Settings>;
    getTriggerList(page: number, onlyProblems: boolean, tags: Array<string>): Promise<TriggerList>;
    getTrigger(id: string): Promise<Trigger>;
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

    async getContactList(): Promise<ContactList> {
        const url = this.config.apiUrl + '/contact';
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async delContact(contact: string): Promise<void> {
        const url = this.config.apiUrl + '/contact/' + contact;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async getPatternList(): Promise<PatternList> {
        const url = this.config.apiUrl + '/pattern';
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async delPattern(pattern: string): Promise<void> {
        const url = this.config.apiUrl + '/pattern/' + pattern;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async getTagList(): Promise<TagList> {
        const url = this.config.apiUrl + '/tag';
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async getTagStats(): Promise<TagStatList> {
        const url = this.config.apiUrl + '/tag/stats';
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async delTag(tag: string): Promise<void> {
        const url = this.config.apiUrl + '/tag/' + tag;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        const { error } = await response.json();
        throw new Error(error);
    }

    async getSettings(): Promise<Settings> {
        const url = this.config.apiUrl + '/user/settings';
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-webauth-user': 'sushko',
            },
        });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
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
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async getTrigger(id: string): Promise<Trigger> {
        const url = `${this.config.apiUrl}/trigger/${id}`;
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async setMaintenance(triggerId: string, data: { [metric: string]: number }): Promise<void> {
        const url = `${this.config.apiUrl}/trigger/${triggerId}/maintenance`;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async getTriggerState(id: string): Promise<TriggerState> {
        const url = `${this.config.apiUrl}/trigger/${id}/state`;
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async getTriggerEvents(id: string, page: number): Promise<EventList> {
        const url = `${this.config.apiUrl}/event/${id}?p=${page}&size=${this.config.paging.eventHistory}`;
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async delThrottling(triggerId: string): Promise<void> {
        const url = `${this.config.apiUrl}/trigger/${triggerId}/throttling`;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async delMetric(triggerId: string, metric: string): Promise<void> {
        const url = `${this.config.apiUrl}/trigger/${triggerId}/metrics?name=${metric}`;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async getNotificationList(): Promise<NotificationList> {
        const url = this.config.apiUrl + '/notification?start=0&end=-1';
        const response = await fetch(url, { method: 'GET' });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error('Network error');
    }

    async deltNotification(id: string): Promise<void> {
        const url = this.config.apiUrl + '/notification?id=' + id;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }

    async delSubscription(id: string): Promise<void> {
        const url = this.config.apiUrl + '/subscription/' + id;
        const response = await fetch(url, { method: 'DELETE' });
        if (response.status === 200) {
            return;
        }
        throw new Error('Network error');
    }
}
