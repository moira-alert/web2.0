// @flow
import React from 'react';
import queryString from 'query-string';
import { intersection, concat, difference, flattenDeep, uniq } from 'lodash';
import moment from 'moment';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import { getMaintenanceTime } from '../Domain/Maintenance';

import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { TriggerList } from '../Domain/Trigger';
import type { Maintenance } from '../Domain/Maintenance';

import ToggleWithLabel from '../Components/Toggle/Toggle';
import Paging from 'retail-ui/components/Paging';
import Layout, { LayoutPlate, LayoutContent, LayoutPaging } from '../Components/Layout/Layout';
import TagSelector from '../Components/TagSelector/TagSelector';
import TriggerListView from '../Components/TriggerList/TriggerList';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    subscribtions: ?Array<string>;
    tags: ?Array<string>;
    triggers: ?TriggerList;
|};
type LocationSearch = {|
    page: number;
    tags: Array<string>;
    onlyProblems: boolean;
|};

class TriggerListContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        subscribtions: null,
        tags: null,
        triggers: null,
    };

    async getData(props: Props): Promise<void> {
        const { moiraApi, location } = props;
        const { page, onlyProblems, tags: parsedTags } = this.parseLocationSearch(location.search);

        try {
            const { subscriptions } = await moiraApi.getSettings();
            const { list: allTags } = await moiraApi.getTagList();
            const selectedTags = intersection(parsedTags, allTags);
            const triggers = await moiraApi.getTriggerList(page - 1, onlyProblems, selectedTags);

            if (page > Math.ceil(triggers.total / triggers.size) && triggers.total !== 0) {
                const rightLastPage = Math.ceil(triggers.total / triggers.size);
                this.changeLocationSearch({ page: rightLastPage });
            }

            this.setState({
                loading: false,
                error: null,
                subscribtions: uniq(flattenDeep(subscriptions.map(x => x.tags))),
                tags: allTags,
                triggers,
            });
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.getData(nextProps);
    }

    parseLocationSearch(search: string): LocationSearch {
        const {
            page,
            tags,
            onlyProblems,
        }: {
            [key: string]: string | Array<string>;
        } = queryString.parse(search, { arrayFormat: 'index' });
        return {
            page: typeof page === 'string' ? Number(page.replace(/\D/g, '')) || 1 : 1,
            tags: Array.isArray(tags) ? tags : [],
            onlyProblems: onlyProblems === 'true' || false,
        };
    }

    changeLocationSearch(update: $Shape<LocationSearch>) {
        const { location, history } = this.props;
        const search = {
            ...this.parseLocationSearch(location.search),
            ...update,
        };
        history.push(
            '?' +
                queryString.stringify(search, {
                    arrayFormat: 'index',
                    encode: true,
                })
        );
    }

    async setMaintenance(triggerId: string, maintenance: Maintenance, metric: string): Promise<void> {
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await this.props.moiraApi.setMaintenance(triggerId, {
            [metric]:
                maintenanceTime > 0
                    ? moment
                          .utc()
                          .add(maintenanceTime, 'minutes')
                          .unix()
                    : maintenanceTime,
        });
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

    render(): React.Element<*> {
        const { loading, error, triggers, tags, subscribtions } = this.state;
        const { page, onlyProblems, tags: parsedTags } = this.parseLocationSearch(location.search);
        const selectedTags = tags ? intersection(parsedTags, tags) : [];
        const subscribedTags = subscribtions ? difference(subscribtions, selectedTags) : [];
        const remainedTags = difference(tags, concat(selectedTags, subscribedTags));
        const pageCount = triggers ? Math.ceil(triggers.total / triggers.size) : 1;

        return (
            <Layout loading={loading} error={error}>
                <LayoutPlate>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ flexGrow: 1, width: '100%' }}>
                            <TagSelector
                                selected={selectedTags}
                                subscribed={subscribedTags}
                                remained={remainedTags}
                                onSelect={tag =>
                                    this.changeLocationSearch({
                                        tags: concat(selectedTags, [tag]),
                                    })}
                                onRemove={tag =>
                                    this.changeLocationSearch({
                                        tags: difference(selectedTags, [tag]),
                                    })}
                            />
                        </div>
                        <div style={{ flexShrink: 0, padding: '5px 0 0 20px' }}>
                            <ToggleWithLabel
                                checked={onlyProblems}
                                label='Only Problems'
                                onChange={checked =>
                                    this.changeLocationSearch({
                                        onlyProblems: checked,
                                    })}
                            />
                        </div>
                    </div>
                </LayoutPlate>
                {triggers && (
                    <LayoutContent>
                        <TriggerListView
                            items={triggers.list || []}
                            onChange={(triggerId, maintenance, metric) => {
                                this.setMaintenance(triggerId, maintenance, metric);
                            }}
                            onRemove={(triggerId, metric) => {
                                this.removeMetric(triggerId, metric);
                            }}
                        />
                    </LayoutContent>
                )}
                {pageCount > 1 && (
                    <LayoutPaging>
                        <Paging
                            activePage={page}
                            pagesCount={pageCount}
                            onPageChange={page => this.changeLocationSearch({ page: page })}
                        />
                    </LayoutPaging>
                )}
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerListContainer);
