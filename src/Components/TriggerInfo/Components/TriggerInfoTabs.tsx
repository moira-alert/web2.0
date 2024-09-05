import React, { FC, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Tabs, { Tab } from "../../Tabs/Tabs";
import { EventListTab } from "./EventListTab/EventListTab";
import { CurrentStateTab } from "./CurrentStateTab";
import { MetricItemList } from "../../../Domain/Metric";

interface ITriggerInfoTabsProps {
    metrics: MetricItemList;
    triggerName: string;
    setMetricMaintenance: (metric: string, maintenance: number) => void;
    removeMetric: (metric: string) => void;
    removeNoDataMetric: () => void;
}

export const TriggerInfoTabs: FC<ITriggerInfoTabsProps> = ({
    setMetricMaintenance,
    removeNoDataMetric,
    removeMetric,
    triggerName,
    metrics,
}) => {
    const history = useHistory();
    const location = useLocation();
    const [currentTab, setCurrentTab] = useState<string>("state");

    const handleTabChange = (tabId: string) => {
        if (tabId === "events") {
            const searchParams = new URLSearchParams();
            searchParams.set("action", "events");
            history.push({ search: searchParams.toString() });
        } else {
            history.push({ search: "" });
        }
    };

    useEffect(() => {
        const action = new URLSearchParams(location.search).get("action");
        setCurrentTab(action === "events" ? "events" : "state");
    }, [location.search]);

    return (
        <Tabs value={currentTab} onValueChange={handleTabChange}>
            <Tab id="state" label="Current state">
                <CurrentStateTab
                    metrics={metrics}
                    setMetricMaintenance={setMetricMaintenance}
                    removeMetric={removeMetric}
                    removeNoDataMetric={removeNoDataMetric}
                />
            </Tab>
            <Tab id="events" label="Events history">
                <EventListTab triggerName={triggerName} />
            </Tab>
        </Tabs>
    );
};
