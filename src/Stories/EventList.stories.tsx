import * as React from "react";
import { storiesOf } from "@storybook/react";
import EventList from "../Components/EventList/EventList";
import { Event } from "../Domain/Event";
import { Status } from "../Domain/Status";

const items: { [key: string]: Array<Event> } = {
    "vm-ditrace2.elasticsearch": [
        {
            state: Status.OK,
            old_state: Status.NODATA,
            timestamp: 1504166060,
            value: 233245,
            metric: "vm-ditrace2.elasticsearch",
            msg: "This metric has been in bad state for more than 24 hours - please, fix.",
            trigger_id: "e3ab7290-0c5f-42df-965f-ff4bd160d704",
        },
        {
            timestamp: 1504528667,
            metric: "vm-ditrace2.elasticsearch",
            value: 12345,
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.WARN,
        },
        {
            timestamp: 1504528667,
            metric: "vm-ditrace2.elasticsearch",
            state: Status.WARN,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.ERROR,
        },
        {
            timestamp: 1504528667,
            metric: "vm-ditrace2.elasticsearch",
            state: Status.ERROR,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.EXCEPTION,
        },
        {
            timestamp: 1504528667,
            metric: "vm-ditrace2.elasticsearch",
            state: Status.EXCEPTION,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.DEL,
        },
    ],
    "ditrace-lt.nginx": [
        {
            timestamp: 1504527066,
            metric: "ditrace-lt.nginx",
            value: 36059806,
            state: Status.OK,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.NODATA,
        },
        {
            timestamp: 1504526684,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
        {
            timestamp: 1504526596,
            metric: "ditrace-lt.nginx",
            value: 11840200,
            state: Status.OK,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.NODATA,
        },
        {
            timestamp: 1504526590,
            metric: "ditrace-lt.nginx",
            value: 5374721,
            state: Status.OK,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.NODATA,
        },
        {
            timestamp: 1504526536,
            metric: "ditrace-lt.nginx",
            value: 1873956,
            state: Status.OK,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.NODATA,
        },
        {
            timestamp: 1504526407,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
        {
            timestamp: 1504526407,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
        {
            timestamp: 1504526407,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
        {
            timestamp: 1504526407,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
        {
            timestamp: 1504526407,
            metric: "ditrace-lt.nginx",
            state: Status.NODATA,
            trigger_id: "351de571-015f-40ff-b16e-8ca57585b4e8",
            old_state: Status.OK,
        },
    ],
};

storiesOf("EventList", module).add("Default", () => <EventList items={items} />);
