import { useEffect, FC, useState, memo, useCallback } from "react";
import { Layout, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";
import { UIState } from "../../store/selectors";
import { useAppSelector } from "../../store/hooks";

import {
    useDeleteMetricMutation,
    useGetHeavyTriggersQuery,
    useSetMetricsMaintenanceMutation,
} from "../../services/TriggerApi";
import TriggerList from "../../Components/TriggerList/TriggerList";
import { Paging } from "@skbkontur/react-ui";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { Slider } from "../../Components/Slider/Slider";
import FileExport from "../../Components/FileExport/FileExport";
import styles from "./HeavyTriggersContainer.module.less";

const MIN_METRICS = 1;
const MAX_METRICS = 40000;
const INITIAL_METRICS_VALUE = MAX_METRICS / 2;

const MemoizedTriggerList = memo(TriggerList);

const HeavyTriggersContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const [committedFrom, setCommittedFrom] = useState(INITIAL_METRICS_VALUE);

    const [activePage, setActivePage] = useState(1);

    const { data: heavyTriggers = { list: [] } } = useGetHeavyTriggersQuery({
        from: committedFrom,
        page: transformPageFromHumanToProgrammer(activePage),
    });
    const [setMetricMaintenance] = useSetMetricsMaintenanceMutation();
    const [deleteMetric] = useDeleteMetricMutation();

    const list = heavyTriggers?.list ?? [];
    const total = heavyTriggers?.total ?? 0;

    const pageCount = Math.ceil(total / 20) || 1;

    useEffect(() => {
        setDocumentTitle("Heavy triggers");
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setActivePage(page);
    }, []);

    const handleCommitSliderValue = (value: number) => {
        setCommittedFrom(value);
        setActivePage(1);
    };

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                {list.length > 0 && (
                    <div className={styles.exportButton}>
                        <FileExport isButton title={"heavy triggers"} data={heavyTriggers}>
                            Export
                        </FileExport>
                    </div>
                )}
                <Slider
                    min={MIN_METRICS}
                    max={MAX_METRICS}
                    initialValue={committedFrom}
                    onChange={handleCommitSliderValue}
                    label="Minimum metrics count"
                    tooltipText="Triggers with metrics count greater than this value will be shown."
                />
                <MemoizedTriggerList
                    searchMode={false}
                    onRemove={(triggerId, metric) =>
                        deleteMetric({ triggerId, metric, tagsToInvalidate: ["HeavyTriggers"] })
                    }
                    items={list}
                    onChange={(triggerId, metric, maintenance) =>
                        setMetricMaintenance({
                            triggerId,
                            metrics: { [metric]: maintenance },
                            tagsToInvalidate: ["HeavyTriggers"],
                        })
                    }
                />
            </LayoutContent>

            <LayoutFooter>
                <Paging
                    caption="Next page"
                    activePage={activePage}
                    pagesCount={pageCount}
                    onPageChange={handlePageChange}
                    withoutNavigationHint
                />
            </LayoutFooter>
        </Layout>
    );
};
export default HeavyTriggersContainer;
