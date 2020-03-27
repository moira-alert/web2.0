var chance = require('chance').Chance(Math.floor(Math.random() * 100));

var db = {
    config: {
        contacts: [
            {
                type: "email",
                label: "E-mail"
            },
            {
                type: "slack",
                label: "Slack",
                validation: "^[@#][a-zA-Z0-9-_]+",
                placeholder: "Slack #channel or @user"
            },
            {
                type: "msteams",
                label: "Microsoft Teams",
                placeholder: "Microsoft Teams Channel Incoming WebHook"
            },
            {
                type: "phone",
                label: "Phone",
                validation: "^9\\d{9}$",
                placeholder: "In format 98743210",
                help: "Phone for Kontur SMS"
            },
            {
                type: "discord",
                label: "Discord",
                placeholder: "Discord channel (eg: general-text) or user (eg: @user)"
            },
            {
                type: "pagerduty",
                label: "Pagerduty",
                placeholder: "Enter the pagerduty routing key"
            },
            {
                type: "victorops",
                label: "Victorops",
                placeholder: "Enter the victorops routing key"
            },
            {
                type: "opsgenie",
                label: "Opsgenie",
                placeholder: "Enter the responder id"
            }
        ],
        supportEmail: "devopsteam@skbkontur.ru"
    },
    user: {
        login: "testuser"
    },
    contact: {
        list: [{
            "type": "phone",
            "user": "testuser",
            "value": "9876543210",
            "id": "0000-0000-0000-0000-0001"
        },
        {
            "type": "email",
            "user": "testuser",
            "value": "testuser@skbkontur.ru",
            "id": "0000-0000-0000-0000-0002"
        }],
    },
    tag: {
        list: [
            "critical",
            "devops",
            "frontend",
            "backend",
            "test",
            "errors",
            "warnings",
            "archive",
            "dev",
            "moira-dev",
            "moira-test",
            "seyren",
            "Moira"
        ]
    },
    health: {
        state: "OK",
        message: null
    }
}

function getRandomSubset(array) {
    const len = array.length;

    // random shuffling
    for (var i = 0; i < len; i++) {
        const index = chance.integer({ min: 0, max: len - 1 });

        const _ = array[index];
        array[index] = array[i];
        array[i] = _;
    }

    return array.slice(0, chance.integer({ min: 1, max: len }));
}

function createSchedule() {
    const DaysOfWeek = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
    ];
    const days = getRandomSubset(DaysOfWeek);
    return {
        days: DaysOfWeek.map(day => { return { enabled: days.includes(day), name: day }; }),
        tzOffset: new Date().getTimezoneOffset(),
        startOffset: 0,
        endOffset: 1439,
    };

}

function getState(warn_value, error_value, trigger_type, value) {
    if (!value) return "NODATA";
    else
        switch (trigger_type) {
            case "rising":
                return value < warn_value ? "OK" : (value < error_value ? "WARN" : "ERROR");
            case "falling":
                return value > warn_value ? "OK" : (value > error_value ? "WARN" : "ERROR");
            default:
                return "EXCEPTION";
        }
}

function createMetric(pattern, warn_value, error_value, trigger_type) {
    const event_timestamp = Math.floor(Date.now() / 1000) - chance.integer({ min: 60 * 60 * 24 * 1, max: 60 * 60 * 24 * 7 })
    const timestamp = Math.floor(Date.now() / 1000);
    const suppressed = chance.bool();
    const value = chance.integer({ min: 0, max: 400 });
    const state = getState(warn_value, error_value, trigger_type, value);
    const maintenance = chance.bool() ? 0 : timestamp + 8 * 24 * 60 * 60;
    const maintenance_info = maintenance ? {
        setup_user: chance.first(),
        setup_time: chance.integer({ min: Math.max(event_timestamp, timestamp - 7 * 24 * 60 * 60), max: timestamp })
    } : {};
    return {
        event_timestamp,
        timestamp,
        suppressed,
        value,
        state,
        maintenance,
        maintenance_info
    };
}

function createTrigger(tags) {
    const name = chance.sentence({ words: chance.integer({ min: 2, max: 5 }) });
    const desc = chance.sentence();
    const pattern = `graphite.pattern.*.${chance.bb_pin()}`;
    const trigger_type = chance.bool() ? "rising" : "falling";
    const warn_value = chance.integer({ min: 100, max: 200 });
    const error_value = chance.integer(trigger_type === "falling" ? { min: 20, max: 80 } : { min: 240, max: 300 });
    const last_check = {
        score: chance.integer({ min: 0, max: 400 }),
        timestamp: Math.floor(Date.now() / 1000),
        event_timestamp: 0
    }
    last_check.state = getState(warn_value, error_value, trigger_type, last_check.score);
    const totalMetrics = chance.integer({ min: 1, max: 8 });
    last_check.metrics = {};
    [...Array(totalMetrics).keys()].map(index => {
        const newMetric = createMetric(pattern, warn_value, error_value, trigger_type);
        last_check.metrics[pattern.replace("*", chance.bb_pin())] = newMetric;
        last_check.event_timestamp = Math.max(last_check.event_timestamp, newMetric.timestamp);
    });
    return {
        id: chance.guid(),
        name,
        desc,
        targets: [
            `graphiteFunction(${pattern})`
        ],
        warn_value,
        error_value,
        trigger_type,
        tags: getRandomSubset(tags),
        ttl_state: "NODATA",
        ttl: chance.integer({ min: 60, max: 60 * 60 }),
        sched: createSchedule(),
        throttling: chance.bool() ? 0 : Math.floor(Date.now() / 1000) + chance.integer({ min: 60 * 60 * 24 * 1, max: 60 * 60 * 24 * 7 }),
        is_remote: chance.bool(),
        patterns: [
            pattern
        ],
        last_check,
        highlights: {
            name: name.split(" ").map(word => { return chance.bool() ? `<mark>${word}</mark>` : word }).join(" "),
            desc: desc.split(" ").map(word => { return chance.bool() ? `<mark>${word}</mark>` : word }).join(" ")
        }
    }
}

function createTriggerList(tags) {
    const total = Math.floor(Math.random() * 10 + 5);
    const list = [...Array(total).keys()].map(index => {
        return createTrigger(tags);
    });
    return {
        page: 0,
        size: 20,
        total,
        list
    }
}

function createEventHistory(metric, trigger_state, trigger) {
    const {
        event_timestamp,
        value,
        state
    } = trigger_state.metrics[metric];
    const {
        warn_value,
        error_value,
        trigger_type
    } = trigger;

    var event_history = [{
        timestamp: event_timestamp,
        state,
        value,
        trigger_id: trigger.id,
        metric
    }];
    var prev_timestamp = event_history[0].timestamp;
    var prev_state = event_history[0].state;
    for (var i = 0; i < 100; i++) {
        var newEvent = {
            timestamp: prev_timestamp - chance.integer({ min: 60 * 60, max: 2 * 60 * 60 }),
            value: chance.integer({ min: 0, max: 400 }),
            trigger_id: trigger.id,
            metric,
        };
        newEvent.state = getState(warn_value, error_value, trigger_type, newEvent.value);
        if (prev_state !== newEvent.state) {
            event_history.push(newEvent);
            prev_timestamp = newEvent.timestamp;
            prev_state = newEvent.state;
        }
    }

    for (var i = event_history.length - 2; i >= 0; i--) {
        event_history[i].old_state = event_history[i + 1].state;
    }

    return event_history.splice(0, event_history.length - 1);
}

function createEventList(trigger, state) {
    var list = [];
    Object.keys(state.metrics).map(metric => {
        const event_history = createEventHistory(metric, state, trigger);
        list = list.concat(event_history.slice(0, Math.min(20, event_history.length)));
    });
    const total = Math.min(100, list.length);
    return {
        page: 0,
        size: 100,
        total,
        list: list.splice(0, total)
    }
}

function createTriggerState(trigger) {
    const { timestamp, event_timestamp } = trigger.last_check;
    const maintenance = chance.bool() ? 0 : timestamp + 8 * 24 * 60 * 60;
    const maintenance_info = maintenance ? {
        setup_user: chance.first(),
        setup_time: chance.integer({ min: Math.max(event_timestamp, timestamp - 7 * 24 * 60 * 60), max: timestamp })
    } : {};
    return {
        ...trigger.last_check,
        maintenance,
        maintenance_info,
        trigger_id: trigger.id
    }
}

function createSubscriptions(tags, contacts, user) {
    const subscriptions = [...Array(chance.integer({ min: 1, max: 10 }))].map(index => {
        return {
            sched: createSchedule(),
            tags: getRandomSubset(tags),
            throttling: chance.bool(),
            contacts: getRandomSubset(contacts.map(contact => { return contact.id; })),
            enabled: chance.bool(),
            user: user[Object.keys(user)[0]],
            id: chance.guid(),
            ignore_recoverings: chance.bool(),
            ignore_warnings: chance.bool(),
        }
    });
    return subscriptions;
}

function createSettings(user, contacts, tags) {
    return {
        login: user[Object.keys(user)[0]],
        contacts,
        subscriptions: createSubscriptions(tags, contacts, user)
    }
}

function createNotificationList(event, trigger, tags, contacts) {
    const {
        id,
        name,
        targets,
        desc,
        warn_value
    } = trigger;

    const total = chance.integer({ min: 1, max: 20 });
    return {
        total,
        list: [...Array(total).keys()].map(index => {
            const __notifier_trigger_tags = getRandomSubset(tags);

            const _event = {
                ...event.list[chance.integer({ min: 0, max: event.list.length - 1 })],
                sub_id: chance.guid()
            }
            return {
                contact: contacts[chance.integer({ min: 0, max: contacts.length - 1 })],
                event: _event,
                send_fail: chance.integer({ min: 0, max: 10 }),
                throttled: chance.bool(),
                timestamp: _event.timestamp,
                trigger: {
                    id,
                    name,
                    targets,
                    __notifier_trigger_tags,
                    desc,
                    warn_value
                }
            }
        })
    }
}

function initialiseTagStats(tags, trigger_list, subscription_list) {
    const list = tags.map(tag => {
        var triggers = [];
        trigger_list.map(trigger => {
            if (trigger.tags.includes(tag))
                triggers.push(trigger.id);
        })
        var subscriptions = [];
        subscription_list.map(subscription => {
            if (subscription.tags.includes(tag))
                subscriptions.push(subscription);
        });
        return {
            name: tag,
            triggers,
            subscriptions,
        }
    });
    return { list };
}

function initialisePatternStats(trigger_list) {
    const list = trigger_list.map(trigger => {
        const pattern = trigger.patterns[0];
        const metrics = Object.keys(trigger.last_check.metrics);
        return {
            metrics,
            pattern,
            triggers: [trigger]
        }
    });
    return { list };
}

module.exports = () => {
    const tags = db.tag.list,
        contacts = db.contact.list,
        user = db.user;

    const triggers = createTriggerList(tags);
    const trigger = triggers.list[0];
    const state = createTriggerState(trigger);
    const event = createEventList(trigger, state);
    const settings = createSettings(user, contacts, tags);
    const notification = createNotificationList(event, trigger, tags, contacts);
    const stats = initialiseTagStats(tags, triggers.list, settings.subscriptions);
    const pattern = initialisePatternStats(triggers.list);

    return {
        ...db,
        triggers,
        trigger,
        stats,
        settings,
        state,
        event,
        notification,
        pattern
    }
}