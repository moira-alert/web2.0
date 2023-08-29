import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import MobileTriggerListItem from "../../Components/Mobile/MobileTriggerListItem/MobileTriggerListItem";
import { DaysOfWeek } from "../../Domain/Schedule";
import { Trigger, TriggerSource } from "../../Domain/Trigger";
import { Status } from "../../Domain/Status";

const sourceData: Trigger = {
    mute_new_metrics: false,
    notify_about_new_metrics: false,
    trigger_source: TriggerSource.GRAPHITE_LOCAL,
    id: "3e93211b-7fec-4c70-b5e1-abb36d6a4a1d",
    trigger_type: "falling",
    name: "ke.notifications-dev.mail-sender.alive",
    targets: ["sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)"],
    tags: ["ke.notifications-dev", "ke.notifications"],
    patterns: ["KE-cloud.Notifications.*.MailSender.PfrReport.Alive"],
    expression: "",
    ttl: 1200,
    ttl_state: Status.NODATA,
    throttling: 0,
    sched: {
        endOffset: 1439,
        days: [
            { enabled: true, name: DaysOfWeek.Mon },
            { enabled: true, name: DaysOfWeek.Tue },
            { enabled: true, name: DaysOfWeek.Wed },
            { enabled: true, name: DaysOfWeek.Thu },
            { enabled: true, name: DaysOfWeek.Fri },
            { enabled: true, name: DaysOfWeek.Sat },
            { enabled: true, name: DaysOfWeek.Sun },
        ],
        startOffset: 0,
        tzOffset: -420,
    },
    warn_value: null,
    error_value: null,
    last_check: {
        metrics: {
            "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                timestamp: 1499416938,
                state: Status.OK,
            },
            "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                timestamp: 1499416938,
                state: Status.OK,
            },
            "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                timestamp: 1499416938,
                state: Status.OK,
            },
            "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                timestamp: 1499416938,
                state: Status.OK,
            },
            "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                timestamp: 1499416938,
                state: Status.OK,
                suppressed: false,
                event_timestamp: 1499331679,
            },
        },
        timestamp: 1499418145,
        state: Status.OK,
        score: 14000,
    },
};

const stories: Array<{
    title: string;
    data: Trigger;
}> = [
    {
        title: "Default",
        data: { ...sourceData },
    },
    {
        title: "Long trigger name",
        data: {
            ...sourceData,
            name:
                "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok",
        },
    },
    {
        title: "Large counters",
        data: {
            ...sourceData,
            last_check: {
                metrics: {
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(KE-cloud.Noti2fications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.A45live)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Not1ifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifica3tions.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notificati1ons.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(KE-cloud.Notifications.*.M4ailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notificati21ons.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(KE-cloud.N1otificati21ons.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(KE-cloud7.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-2cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notificatio4ns.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notific4ations.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(6KE-cloud.Notifications.*.M4ailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud7.Notifications.*.Mail6Sender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-2cloud.Notification6s.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-c6loud.Notificatio4ns.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud6.Notific4ations.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(KE-clou3d.Notifications.*.M4ailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud7.Notifications.*.MailSender.MrAp3plication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-2cloud.3Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notificatio4ns.*.Mail3Sender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notific4at3ions.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                    "sumSeries(6KE-cloud.Not3ifications.*.M4ailSender.PfrReport.Al3ive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(K3E-cloud7.Notifications.*.Mail6Sender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-2cloud.Notification6s.*.MailSender.PfrIos.Aliv3e)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-c6loud.Notificat3io4ns.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                },
                timestamp: 1499418145,
                state: Status.OK,
                score: 14000,
            },
        },
    },
    {
        title: "Few states",
        data: {
            ...sourceData,
            last_check: {
                metrics: {
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.ERROR,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                },
                timestamp: 1499418145,
                state: Status.OK,
                score: 14000,
            },
        },
    },
    {
        title: "No metrics",
        data: {
            ...sourceData,
            last_check: {
                metrics: {},
                timestamp: 1499418145,
                state: Status.EXCEPTION,
                score: 14000,
            },
        },
    },
    {
        title: "Short tags",
        data: { ...sourceData, tags: ["dev", "test_"] },
    },
    {
        title: "Long tags",
        data: {
            ...sourceData,
            tags: ["dev-or-not-dev-what-is-question", "ke.notifications-dev-test-sort"],
        },
    },
    {
        title: "Lot tags",
        data: {
            ...sourceData,
            tags: ["dev", "test_", "ke.notifications", "ke.notifications-dev"],
        },
    },
    {
        title: "Throttling flag",
        data: { ...sourceData, throttling: Date.now() },
    },
    {
        title: "Lot of all data",
        data: {
            ...sourceData,
            throttling: Date.now(),
            last_check: {
                metrics: {
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.ERROR,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                },
                timestamp: 1499418145,
                state: Status.OK,
                score: 14000,
            },
            name:
                "ke.notifications-dev.mail-sender.alive.cloud.noname.*.all.metrics.few.error.one.warning.zero.nodata.min.ok",
            targets: [
                "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive.KE-cloud.Notifications.*.MailSender.Expert.Alive.KE-cloud.Notifications.*.MailSender.K705Letter.Alive.KE-cloud.Notifications.*.MailSender.MrApplication)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.Expert.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.K705Letter.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.MrDemand.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.MrLetter.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.MrReport.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.PfrLetter.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.StatLetter.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.StatReport.Alive)",
                "sumSeries(KE-cloud.Notifications.*.MailSender.Submission.Alive)",
            ],
            tags: [
                "dev",
                "test",
                "ke.notifications",
                "ke.notifications-dev",
                "very.long.tag.why.you.choice.that.name",
            ],
        },
    },
    {
        title: "Exception state",
        data: {
            ...sourceData,
            last_check: {
                metrics: {
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.ERROR,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                },
                timestamp: 1499418145,
                state: Status.EXCEPTION,
                score: 14000,
            },
        },
    },
    {
        title: "Maintenance",
        data: {
            ...sourceData,
            last_check: {
                metrics: {
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrReport.Alive)": {
                        timestamp: 1499416938,
                        state: Status.OK,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrApplication.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.PfrIos.Alive)": {
                        timestamp: 1499416938,
                        state: Status.WARN,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.MrIon.Alive)": {
                        timestamp: 1499416938,
                        state: Status.ERROR,
                    },
                    "sumSeries(KE-cloud.Notifications.*.MailSender.BankNotification.Alive)": {
                        timestamp: 1499416938,
                        state: Status.NODATA,
                        suppressed: false,
                        event_timestamp: 1499331679,
                    },
                },
                maintenance: 33213987735,
                timestamp: 1499418145,
                state: Status.OK,
                score: 14000,
            },
        },
    },
];

const story = storiesOf("Mobile/TriggerListItem", module).addDecorator(StoryRouter());

stories.forEach(({ title, data }) => {
    story.add(title, () => <MobileTriggerListItem data={data} />);
});
