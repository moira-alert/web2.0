import { FC } from "react";
import queryString from "query-string";
import { Link } from "@skbkontur/react-ui/components/Link";
import { IconMinusCircleRegular16 } from "@skbkontur/icons/IconMinusCircleRegular16";
import TagGroup from "../../../TagGroup/TagGroup";
import { Trigger, TriggerState, triggerSourceDescription } from "../../../../Domain/Trigger";
import { getPageLink } from "../../../../Domain/Global";
import RouterLink from "../../../RouterLink/RouterLink";
import { CodeEditor } from "../../../HighlightInput/CodeEditor";
import { CopyButton } from "../../../TriggerEditForm/Components/CopyButton";
import { MarkdownViewer } from "@skbkontur/markdown";
import { WysiwygWrapper } from "../../../Markdown/WysiwygWrapper";
import { ScheduleView } from "../ScheduleView";
import { useNavigate } from "react-router";
import { Flexbox } from "../../../Flexbox/FlexBox";
import { TriggerCRUDInfo } from "../TriggerCRUDInfo";

import styles from "./TriggerDetails.module.less";

interface TriggerDetailsProps {
    trigger: Trigger;
    triggerState: TriggerState;
    supportEmail?: string;
    clusterName?: string;
    ownerTeam?: { id: string; name: string };
    isOwnerTeamShown: boolean;
    isClusterName: boolean;
}

export const TriggerDetails: FC<TriggerDetailsProps> = ({
    trigger,
    triggerState,
    supportEmail,
    clusterName,
    ownerTeam,
    isOwnerTeamShown,
    isClusterName,
}) => {
    const {
        id,
        desc,
        targets,
        expression,
        error_value: errorValue,
        warn_value: warnValue,
        ttl_state: ttlState,
        ttl,
        sched,
        tags,
        trigger_source: triggerSource,
        created_at,
        created_by,
        updated_at,
        updated_by,
    } = trigger;

    const { state, msg: exceptionMessage } = triggerState;
    const navigate = useNavigate();

    const hasExpression = expression !== null && expression !== "";
    const hasMultipleTargets = targets.length > 1;

    return (
        <div className={styles["info-section"]}>
            <dl className={styles.list}>
                <dt>
                    Target
                    <br />
                    {triggerSourceDescription(triggerSource)}
                </dt>
                <dd className={styles.codeEditor}>
                    <Flexbox gap={10}>
                        {targets.map((target, i) => (
                            <div key={target}>
                                <div className={styles.copyButtonWrapper}>
                                    <div className={styles.copyButton}>
                                        <CopyButton
                                            hintMessage="Copy without formatting"
                                            value={target}
                                        />
                                    </div>
                                </div>
                                <CodeEditor
                                    data-tid={`T${i + 1}`}
                                    triggerSource={triggerSource}
                                    disabled
                                    key={i}
                                    value={target}
                                />
                            </div>
                        ))}
                    </Flexbox>
                </dd>

                {desc && <dt>Description</dt>}
                {desc && (
                    <dd>
                        <WysiwygWrapper>
                            <MarkdownViewer source={desc} />
                        </WysiwygWrapper>
                    </dd>
                )}

                {isClusterName && <dt>Cluster</dt>}
                {isClusterName && <dd>{clusterName}</dd>}

                {!expression && <dt>Value</dt>}
                {!expression && (
                    <dd>
                        {warnValue != null && `Warning: ${warnValue}. `}
                        {errorValue != null && `Error: ${errorValue}. `}
                        Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}

                {expression && <dt>Expression</dt>}
                {expression && (
                    <dd>
                        {`${expression}. `}
                        Set {ttlState} if has no value for {ttl} seconds
                    </dd>
                )}

                {sched && <dt>Schedule</dt>}
                {sched && (
                    <dd>
                        <ScheduleView data={sched} />
                    </dd>
                )}

                <dt>Tags</dt>
                <dd>
                    <TagGroup
                        onClick={(tag) => {
                            navigate(
                                `/?${queryString.stringify({ tags: [tag] }, { arrayFormat: "index", encode: true })}`
                            );
                        }}
                        tags={tags}
                    />
                </dd>

                {(state === "EXCEPTION" || state === "ERROR") && <dt />}
                {(state === "EXCEPTION" || state === "ERROR") && (
                    <dd className={styles["exception-explanation"]}>
                        <div>
                            <IconMinusCircleRegular16 color="#D43517" /> Trigger in {state} state.{" "}
                            {exceptionMessage}
                        </div>
                        <div className={styles["line-2"]}>
                            Please verify trigger target{hasMultipleTargets ? "s" : ""}
                            {hasExpression ? " and expression" : ""} on{" "}
                            <RouterLink to={`/trigger/${id}/edit`}>trigger edit page</RouterLink>.
                            {supportEmail && (
                                <span>
                                    {" "}
                                    Or <Link href={`mailto:${supportEmail}`}>contact</Link> with
                                    server administrator.
                                </span>
                            )}
                        </div>
                    </dd>
                )}

                <TriggerCRUDInfo
                    created_by={created_by}
                    created_at={created_at}
                    updated_by={updated_by}
                    updated_at={updated_at}
                />

                {isOwnerTeamShown && ownerTeam && (
                    <>
                        <dt>Made for team</dt>
                        <dd>
                            <RouterLink to={getPageLink("teamSettings", ownerTeam.id)}>
                                {ownerTeam.name}
                            </RouterLink>
                        </dd>
                    </>
                )}
            </dl>
        </div>
    );
};
