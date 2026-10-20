import cn from "classnames";
import type { TriggerSource } from "../../Domain/Trigger";
import { getGrafanaExploreUrl } from "../../helpers/getGrafanaExploreUrl";
import type { GrafanaUrls } from "../../helpers/getGrafanaExploreUrl";
import { GrafanaIconButton } from "../GrafanaIconButton/GrafanaIconButton";
import { CopyButton } from "../TriggerEditForm/Components/CopyButton";

import styles from "./TargetActions.module.less";

interface TargetActionsProps {
    target: string;
    triggerSource: TriggerSource;
    grafanaUrls?: GrafanaUrls;
    className?: string;
}

export const TargetActions = ({
    target,
    triggerSource,
    grafanaUrls,
    className,
}: TargetActionsProps) => {
    const grafanaUrl = getGrafanaExploreUrl(target, triggerSource, grafanaUrls);

    return (
        <div className={cn(styles.actions, className)}>
            <GrafanaIconButton hintText="Open in Grafana Explore" link={grafanaUrl} />
            <CopyButton hintMessage="Copy without formatting" value={target} />
        </div>
    );
};
