// @flow
import * as React from "react";
import moment from "moment";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Schedule } from "../../Domain/Schedule";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import Link from "retail-ui/components/Link";
import Icon from "retail-ui/components/Icon";
import Button from "retail-ui/components/Button";
import TagGroup from "../TagGroup/TagGroup";
import { getJSONContent } from "../../helpers";
import cn from "./TriggerInfo.less";

type Props = {|
    data: Trigger,
    triggerState: TriggerState,
    supportEmail: string,
    onThrottlingRemove: (triggerId: string) => void,
|};

function ScheduleView(props: { data: Schedule }): React.Node {
    const { days, startOffset, endOffset } = props.data;
    const enabledDays = days.filter(({ enabled }) => enabled);
    const viewDays = days.length === enabledDays.length ? "Everyday" : enabledDays.map(({ name }) => name).join(", ");
    const viewTime =
        moment("1900-01-01 00:00:00")
            .add(startOffset, "minutes")
            .format("HH:mm") +
        "–" +
        moment("1900-01-01 00:00:00")
            .add(endOffset, "minutes")
            .format("HH:mm");
    return (
        <div>
            {viewDays} {viewTime}
        </div>
    );
}

export default function TriggerInfo({ data, triggerState, supportEmail, onThrottlingRemove }: Props): React.Node {
    const {
        id,
        name,
        targets,
        desc,
        expression,
        error_value: errorValue,
        warn_value: warnValue,
        ttl_state: ttlState,
        ttl,
        sched,
        tags,
        throttling,
    } = data;

    const { state, msg: exceptionMessage } = triggerState;

    const hasExpression = expression != null && expression !== "";
    const hasMultipleTargets = targets.length > 1;

    return (
        <section>
            <header className={cn("header")}>
                <h1 className={cn("title")}>{name != null && name !== "" ? name : "[No name]"}</h1>
                <div className={cn("controls")}>
                    {throttling !== 0 && (
                        <Link use="danger" icon="Clear" onClick={() => onThrottlingRemove(id)}>
                            Disable throttling
                        </Link>
                    )}
                    <RouterLink to={getPageLink("triggerEdit", id)} icon="Edit">
                        Edit
                    </RouterLink>
                    <a
                        href="#download"
                        onClick={(event: Event) => {
                            const target = event.currentTarget;
                            if (target instanceof HTMLAnchorElement) {
                                target.href = getJSONContent(data);
                            }
                        }}
                        download={`trigger-${id}.json`}>
                        <Button use="link" icon="Export">
                            Export
                        </Button>
                    </a>
                </div>
            </header>
            <dl className={cn("list")}>
                <dt>Target</dt>
                <dd>{targets.map((target, i) => <div key={i}>{target}</div>)}</dd>
                {desc && <dt>Description</dt>}
                {desc && (
                    <dd>
                        {data.desc.split("\n").map((item, key) => {
                            return (
                                <span key={key}>
                                    {item}
                                    <br />
                                </span>
                            );
                        })}
                    </dd>
                )}
                {!expression && <dt>Value</dt>}
                {!expression && (
                    <dd>
                        Warning: {warnValue}, Error: {errorValue}, Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}
                {expression && <dt>Expression</dt>}
                {expression && <dd>{expression}</dd>}
                {sched && <dt>Schedule</dt>}
                {sched && (
                    <dd>
                        <ScheduleView data={sched} />
                    </dd>
                )}
                <dt>Tags</dt>
                <dd>
                    <TagGroup tags={tags} />
                </dd>
                {state === "EXCEPTION" && <dt />}
                {state === "EXCEPTION" && (
                    <dd className={cn("exception-explanation")}>
                        <div className={cn("line-1")}>
                            <Icon name="Error" color={"#D43517"} size={16} /> Trigger in EXCEPTION state.{" "}
                            {exceptionMessage}
                        </div>
                        <div className={cn("line-2")}>
                            Please <RouterLink to={`/trigger/${data.id}/edit`}>verify</RouterLink> trigger target{hasMultipleTargets
                                ? "s"
                                : ""}
                            {hasExpression ? " and exression" : ""} on{" "}
                            <RouterLink to={`/trigger/${data.id}/edit`}>trigger edit page</RouterLink>.
                            {supportEmail != null && (
                                <span>
                                    {" "}
                                    Or <Link href={`mailto:${supportEmail}`}>contact</Link> with server administrator.
                                </span>
                            )}
                        </div>
                    </dd>
                )}
            </dl>
        </section>
    );
}
