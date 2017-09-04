// @flow
import type { IMoiraApi } from './MoiraAPI';
import type { TagList, TagStatList } from './MoiraAPI';
import type { EventList } from '../Domain/Event';
import type { Trigger, TriggerList, TriggerState } from '../Domain/Trigger';
import type { Settings } from '../Domain/Settings';
import type { PatternList } from '../Domain/Pattern';
import type { NotificationList } from '../Domain/Notification';

import FakePattern from './ApiFakeData/pattern.json';
import FakeTag from './ApiFakeData/tag.json';
import FakeStats from './ApiFakeData/stats.json';
import FakeSettings from './ApiFakeData/settings.json';
import FakeTriggers from './ApiFakeData/triggers.json';
import FakeTrigger from './ApiFakeData/trigger.json';
import FakeTriggerState from './ApiFakeData/state.json';
import FakeTriggerEvents from './ApiFakeData/events.json';
import FakeNotifications from './ApiFakeData/notifications.json';

const patterns: PatternList = FakePattern;
const tags: TagList = FakeTag;
const stats: TagStatList = FakeStats;
const settings: Settings = FakeSettings;
const triggers: TriggerList = FakeTriggers;
const trigger: Trigger = FakeTrigger;
const state: TriggerState = FakeTriggerState;
const events: EventList = FakeTriggerEvents;
const notifications: NotificationList = FakeNotifications;

function sleep<T>(response: T): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(response), 500));
}

export default class ApiFake implements IMoiraApi {
    async getPatternList(): Promise<PatternList> {
        return await sleep(patterns);
    }

    async getTagList(): Promise<TagList> {
        return await sleep(tags);
    }

    async getTagStats(): Promise<TagStatList> {
        return await sleep(stats);
    }

    async getSettings(): Promise<Settings> {
        return await sleep(settings);
    }

    async getTriggerList(page: number, onlyProblems: boolean, tags: Array<string>): Promise<TriggerList> {
        const options = {};
        options.page = page;
        options.onlyProblems = onlyProblems;
        options.tags = tags;
        return await sleep(triggers);
    }

    async getTrigger(id: string): Promise<Trigger> {
        const options = {};
        options.id = id;
        return await sleep(trigger);
    }

    async setMaintenance(triggerId: string, data: { [metric: string]: number }): Promise<void> {
        const options = {};
        options.triggerId = triggerId;
        options.data = data;
        return await sleep();
    }

    async delMetric(triggerId: string, metric: string): Promise<void> {
        const options = {};
        options.triggerId = triggerId;
        options.metric = metric;
        return await sleep();
    }

    async getTriggerState(id: string): Promise<TriggerState> {
        const options = {};
        options.id = id;
        return await sleep(state);
    }

    async getTriggerEvents(id: string): Promise<EventList> {
        const options = {};
        options.id = id;
        return await sleep(events);
    }

    async getNotificationList(): Promise<NotificationList> {
        return await sleep(notifications);
    }
}
