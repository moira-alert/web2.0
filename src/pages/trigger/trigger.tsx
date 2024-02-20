import React, { ComponentType } from "react";
import queryString from "query-string";
import { RouteComponentProps } from "react-router-dom";
import isEqual from "lodash/isEqual";
import MoiraApi from "../../Api/MoiraApi";
import { Trigger, TriggerState } from "../../Domain/Trigger";
import { Event } from "../../Domain/Event";
import { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import { setMetricMaintenance, setTriggerMaintenance } from "../../Domain/Maintenance";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { TriggerDesktopProps } from "./trigger.desktop";
import { TriggerMobileProps } from "./trigger.mobile";
import { getPageLink } from "../../Domain/Global";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";

export type TriggerProps = RouteComponentProps<{ id: string }> & {
    moiraApi: MoiraApi;
    view: ComponentType<TriggerDesktopProps | TriggerMobileProps>;
};

type State = {
    loading: boolean;
    error?: string;
    page: number;
    pageCount: number;
    trigger?: Trigger;
    triggerState?: TriggerState;
    triggerEvents: Array<Event>;
};

// ToDo решить, нужно ли подтягивать данные с сервера, если что-то изменилось

class TriggerPage extends React.Component<TriggerProps, State> {
    state: State = {
        loading: true,
        page: 1,
        pageCount: 1,
        triggerEvents: [],
    };

    componentDidMount() {
        setDocumentTitle("Trigger");
        this.loadData();
    }

    componentDidUpdate({ location: prevLocation }: TriggerProps) {
        const { location: currentLocation } = this.props;
        if (!isEqual(prevLocation, currentLocation)) {
            this.loadData();
        }
    }

    static parseLocationSearch(search: string): MoiraUrlParams {
        const START_PAGE = 1;
        const { page } = queryString.parse(search);

        return {
            page:
                Number.isNaN(Number(page)) || typeof page !== "string"
                    ? START_PAGE
                    : Math.abs(parseInt(page, 10)),
            tags: [],
            searchText: "",
            onlyProblems: false,
        };
    }

    render() {
        const {
            loading,
            error,
            page,
            pageCount,
            trigger,
            triggerState,
            triggerEvents,
        } = this.state;
        const { view: TriggerView } = this.props;

        return (
            <TriggerView
                trigger={trigger}
                state={triggerState}
                events={triggerEvents}
                page={page}
                pageCount={pageCount}
                loading={loading}
                error={error}
                deleteTrigger={this.deleteTrigger}
                disableThrottling={this.disableThrottling}
                setTriggerMaintenance={this.setTriggerMaintenance}
                setMetricMaintenance={this.setMetricMaintenance}
                removeMetric={this.removeMetric}
                removeNoDataMetric={this.removeNoDataMetric}
                onPageChange={this.changeLocationSearch}
                history={this.props.history}
            />
        );
    }

    async loadData() {
        const { moiraApi, match, location } = this.props;
        const { page } = TriggerPage.parseLocationSearch(location.search);
        const { id } = match.params;

        // ToDo написать проверку id

        try {
            const [trigger, triggerState, triggerEvents] = await Promise.all([
                moiraApi.getTrigger(id, { populated: true }),
                moiraApi.getTriggerState(id),
                moiraApi.getTriggerEvents(id, transformPageFromHumanToProgrammer(page)),
            ]);

            const pageCount = Math.ceil(triggerEvents.total / triggerEvents.size);

            // ToDo написать проверку на превышение страниц

            setDocumentTitle(`Trigger - ${trigger.name}`);

            this.setState({
                page,
                pageCount: Number.isNaN(pageCount) ? 1 : pageCount,
                trigger,
                triggerState,
                triggerEvents: triggerEvents.list || [],
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    disableThrottling = async (triggerId: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delThrottling(triggerId);
        this.loadData();
    };

    setTriggerMaintenance = async (triggerId: string, maintenance: number) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setTriggerMaintenance(moiraApi, triggerId, maintenance);
        this.loadData();
    };

    setMetricMaintenance = async (triggerId: string, metric: string, maintenance: number) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setMetricMaintenance(moiraApi, triggerId, metric, maintenance);
        this.loadData();
    };

    removeMetric = async (triggerId: string, metric: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delMetric(triggerId, metric);
        this.loadData();
    };

    removeNoDataMetric = async (triggerId: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delNoDataMetric(triggerId);
        this.loadData();
    };

    deleteTrigger = async (id: string) => {
        const { moiraApi } = this.props;
        try {
            await moiraApi.delTrigger(id);
            this.props.history.push(getPageLink("index"));
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    };

    changeLocationSearch = (update: { page: number }) => {
        const { location, history } = this.props;
        const locationSearch = TriggerPage.parseLocationSearch(location.search);
        history.push(
            `?${queryString.stringify(
                { ...locationSearch, ...update },
                {
                    arrayFormat: "index",
                    encode: true,
                }
            )}`
        );
    };
}

export default withMoiraApi(TriggerPage);
