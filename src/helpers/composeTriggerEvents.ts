import { Event } from "../Domain/Event";

export const getEventMetricName = (event: Event, triggerName: string): string => {
    if (event.trigger_event) {
        return triggerName;
    }
    return event.metric.length !== 0 ? event.metric : "No metric evaluated";
};

export const composeEvents = (
    events: Array<Event>,
    triggerName: string
): {
    [key: string]: Array<Event>;
} => {
    return events.reduce((data: { [key: string]: Array<Event> }, event: Event) => {
        const metric = getEventMetricName(event, triggerName);
        if (data[metric]) {
            data[metric].push(event);
        } else {
            data[metric] = [event];
        }
        return data;
    }, {});
};
