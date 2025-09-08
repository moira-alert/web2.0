/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiErrorResponse {
  /** application-level error message, for debugging */
  error?: string;
  /** user-level status message */
  status: string;
}

export interface ApiFeatureFlags {
  /** @example "new_year" */
  celebrationMode: string;
  /** @example true */
  isPlottingAvailable: boolean;
  /** @example false */
  isPlottingDefaultOn: boolean;
  /** @example false */
  isReadonlyEnabled: boolean;
  /** @example false */
  isSubscriptionToAllTagsAvailable: boolean;
}

export interface ApiMetricSourceCluster {
  /** @example "default" */
  cluster_id: string;
  /** @example "Graphite Remote Prod" */
  cluster_name: string;
  /** @example 604800 */
  metrics_ttl: number;
  /** @example "graphite_remote" */
  trigger_source: string;
}

export interface ApiSentry {
  /** @example "https://secret@sentry.host" */
  dsn?: string;
  /** @example "dev" */
  platform?: string;
}

export interface ApiWebConfig {
  /** @uniqueItems false */
  contacts: ApiWebContact[];
  featureFlags: ApiFeatureFlags;
  /** @uniqueItems false */
  metric_source_clusters: ApiMetricSourceCluster[];
  /** @example true */
  remoteAllowed: boolean;
  sentry: ApiSentry;
  /** @example "kontur.moira.alert@gmail.com" */
  supportEmail?: string;
}

export interface ApiWebContact {
  /**
   * @example "### Domains whitelist:
   *  - moira.ru
   * "
   */
  help?: string;
  /** @example "Webhook" */
  label: string;
  /** @example "discord-logo.svg" */
  logo_uri?: string;
  /** @example "https://moira.ru/webhooks" */
  placeholder?: string;
  /** @example "webhook" */
  type: string;
  /** @example "^(http|https):\/\/.*(moira.ru)(:[0-9]{2,5})?\/" */
  validation?: string;
}

export interface DtoContact {
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id?: string;
  /** @example "Mail Alerts" */
  name?: string;
  team_id?: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user?: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface DtoContactEventItem {
  metric: string;
  old_state: string;
  state: string;
  /** @format int64 */
  timestamp: number;
  trigger_id: string;
}

export interface DtoContactEventItemList {
  /** @uniqueItems false */
  list: DtoContactEventItem[];
}

export interface DtoContactList {
  /** @uniqueItems false */
  list: DtoTeamContact[];
}

export interface DtoContactNoisiness {
  /** EventsCount for the contact. */
  events_count: number;
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id?: string;
  /** @example "Mail Alerts" */
  name?: string;
  team_id?: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user?: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface DtoContactNoisinessList {
  /**
   * List of entities.
   * @uniqueItems false
   */
  list: DtoContactNoisiness[];
  /**
   * Page number.
   * @format int64
   * @example 0
   */
  page: number;
  /**
   * Size is the amount of entities per Page.
   * @format int64
   * @example 100
   */
  size: number;
  /**
   * Total amount of entities in the database.
   * @format int64
   * @example 10
   */
  total: number;
}

export interface DtoContactScore {
  /** LastErrMessage is the last error message encountered. */
  last_err?: string;
  /** LastErrTimestamp is the timestamp of the last error. */
  last_err_timestamp?: number;
  /** ScorePercent is the percentage score of successful transactions. */
  score_percent?: number;
  /** Status is the current status of the contact. */
  status?: string;
}

export interface DtoContactWithScore {
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id?: string;
  /** @example "Mail Alerts" */
  name?: string;
  score?: DtoContactScore;
  team_id?: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user?: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface DtoEventsList {
  /** @uniqueItems false */
  list: MoiraNotificationEvent[];
  /**
   * @format int64
   * @example 0
   */
  page: number;
  /**
   * @format int64
   * @example 100
   */
  size: number;
  /**
   * @format int64
   * @example 10
   */
  total: number;
}

export interface DtoMessageResponse {
  /** @example "tag deleted" */
  message: string;
}

export interface DtoNotificationDeleteResponse {
  /**
   * @format int64
   * @example 0
   */
  result: number;
}

export interface DtoNotificationsList {
  /** @uniqueItems false */
  list: MoiraScheduledNotification[];
  /**
   * @format int64
   * @example 0
   */
  total: number;
}

export interface DtoNotifierState {
  /** @example "AUTO" */
  actor: string;
  /** @example "Moira has been turned off for maintenance" */
  message?: string;
  /** @example "ERROR" */
  state: string;
}

export interface DtoNotifierStateForSource {
  /** @example "AUTO" */
  actor: string;
  cluster_id: string;
  /** @example "Moira has been turned off for maintenance" */
  message?: string;
  /** @example "ERROR" */
  state: string;
  trigger_source: string;
}

export interface DtoNotifierStatesForSources {
  /** @uniqueItems false */
  sources: DtoNotifierStateForSource[];
}

export interface DtoPatternData {
  /**
   * @uniqueItems false
   * @example ["DevOps.my_server.hdd.freespace_mbytes"," DevOps.my_server.hdd.freespace_mbytes"," DevOps.my_server.db.*"]
   */
  metrics: string[];
  /** @example "Devops.my_server.*" */
  pattern: string;
  /** @uniqueItems false */
  triggers: DtoTriggerModel[];
}

export interface DtoPatternList {
  /** @uniqueItems false */
  list: DtoPatternData[];
}

export interface DtoPatternMetrics {
  metrics: Record<string, MoiraMetricValue[]>;
  pattern: string;
  retention: Record<string, number>;
}

export interface DtoProblemOfTarget {
  /** @example "consolidateBy" */
  argument: string;
  /** @example "This function affects only visual graph representation. It is meaningless in Moira" */
  description?: string;
  /** @example 0 */
  position: number;
  /** @uniqueItems false */
  problems?: DtoProblemOfTarget[];
  /** @example "warn" */
  type?: string;
}

export interface DtoSaveTeamResponse {
  /** @example "d5d98eb3-ee18-4f75-9364-244f67e23b54" */
  id: string;
}

export interface DtoSaveTriggerResponse {
  checkResult?: DtoTriggerCheckResponse;
  /** @example "trigger_id" */
  id: string;
  /** @example "trigger created" */
  message: string;
}

export interface DtoSubscription {
  /** @example false */
  any_tags: boolean;
  /**
   * @uniqueItems false
   * @example ["acd2db98-1659-4a2f-b227-52d71f6e3ba1"]
   */
  contacts: string[];
  /** @example true */
  enabled: boolean;
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  id: string;
  /** @example false */
  ignore_recoverings?: boolean;
  /** @example false */
  ignore_warnings?: boolean;
  plotting: MoiraPlottingData;
  /** Determines when Moira should monitor trigger */
  sched: MoiraScheduleData;
  /**
   * @uniqueItems false
   * @example ["server","cpu"]
   */
  tags: string[];
  /** @example "324516ed-4924-4154-a62c-eb124234fce" */
  team_id: string;
  /** @example false */
  throttling: boolean;
  /** @example "" */
  user: string;
}

export interface DtoSubscriptionList {
  /** @uniqueItems false */
  list: MoiraSubscriptionData[];
}

export interface DtoTagStatistics {
  /** @example "cpu" */
  name: string;
  /** @uniqueItems false */
  subscriptions: MoiraSubscriptionData[];
  /**
   * @uniqueItems false
   * @example ["bcba82f5-48cf-44c0-b7d6-e1d32c64a88c"]
   */
  triggers: string[];
}

export interface DtoTagsData {
  /**
   * @uniqueItems false
   * @example ["cpu"]
   */
  list: string[];
}

export interface DtoTagsStatistics {
  /** @uniqueItems false */
  list: DtoTagStatistics[];
}

export interface DtoTeamContact {
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id?: string;
  /** @example "Mail Alerts" */
  name?: string;
  /** This field is deprecated */
  team?: string;
  team_id?: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user?: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface DtoTeamContactWithScore {
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id?: string;
  /** @example "Mail Alerts" */
  name?: string;
  score?: DtoContactScore;
  /** This field is deprecated */
  team?: string;
  team_id?: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user?: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface DtoTeamMembers {
  /**
   * @uniqueItems false
   * @example ["anonymous"]
   */
  usernames: string[];
}

export interface DtoTeamModel {
  /** @example "Team that holds all members of infrastructure division" */
  description: string;
  /** @example "d5d98eb3-ee18-4f75-9364-244f67e23b54" */
  id: string;
  /** @example "Infrastructure Team" */
  name: string;
}

export interface DtoTeamSettings {
  /** @uniqueItems false */
  contacts: DtoTeamContactWithScore[];
  /** @uniqueItems false */
  subscriptions: MoiraSubscriptionData[];
  /** @example "d5d98eb3-ee18-4f75-9364-244f67e23b54" */
  team_id: string;
}

export interface DtoTeamsList {
  /** @uniqueItems false */
  list: DtoTeamModel[];
  /**
   * @format int64
   * @example 0
   */
  page: number;
  /**
   * @format int64
   * @example 100
   */
  size: number;
  /**
   * @format int64
   * @example 10
   */
  total: number;
}

export interface DtoThrottlingResponse {
  /**
   * @format int64
   * @example 0
   */
  throttling: number;
}

export interface DtoTreeOfProblems {
  /** @example true */
  syntax_ok: boolean;
  tree_of_problems?: DtoProblemOfTarget;
}

export interface DtoTrigger {
  /**
   * A list of targets that have only alone metrics
   * @example {"t1":true}
   */
  alone_metrics: Record<string, boolean>;
  /**
   * Shows the exact cluster from where the metrics are fetched
   * @example "default"
   */
  cluster_id: string;
  /** Datetime when the trigger was created */
  created_at: string | null;
  /** Username who created trigger */
  created_by: string;
  /**
   * Description string
   * @example "check the size of /var/log"
   */
  desc?: string | null;
  /**
   * ERROR threshold
   * @example 1000
   */
  error_value: number | null;
  /**
   * Used if you need more complex logic than provided by WARN/ERROR values
   * @example ""
   */
  expression: string;
  /**
   * Trigger unique ID
   * @example "292516ed-4924-4154-a62c-ebe312431fce"
   */
  id: string;
  /**
   * Shows if trigger is remote (graphite-backend) based or stored inside Moira-Redis DB
   *
   * Deprecated: Use TriggerSource field instead
   * @example false
   */
  is_remote: boolean;
  /**
   * If true, first event NODATA → OK will be omitted
   * @example false
   */
  mute_new_metrics: boolean;
  /**
   * Trigger name
   * @example "Not enough disk space left"
   */
  name: string;
  /**
   * Graphite patterns for trigger
   * @uniqueItems false
   * @example [""]
   */
  patterns: string[];
  /** Determines when Moira should monitor trigger */
  sched?: MoiraScheduleData;
  /**
   * Set of tags to manipulate subscriptions
   * @uniqueItems false
   * @example ["server","disk"]
   */
  tags: string[];
  /**
   * Graphite-like targets: t1, t2, ...
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /**
   * @format int64
   * @example 0
   */
  throttling: number;
  /**
   * Shows the type of source from where the metrics are fetched
   * @example "graphite_local"
   */
  trigger_source: string;
  /**
   * Could be: rising, falling, expression
   * @example "rising"
   */
  trigger_type: string;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @format int64
   * @example 600
   */
  ttl?: number;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @example "NODATA"
   */
  ttl_state?: string | null;
  /** Datetime  when the trigger was updated */
  updated_at: string | null;
  /** Username who updated trigger */
  updated_by: string;
  /**
   * WARN threshold
   * @example 500
   */
  warn_value: number | null;
}

export interface DtoTriggerCheck {
  /**
   * @format int64
   * @example 1590741878
   */
  event_timestamp?: number;
  /**
   * LastSuccessfulCheckTimestamp - time of the last check of the trigger, during which there were no errors
   * @format int64
   * @example 1590741916
   */
  last_successful_check_timestamp: number;
  /**
   * @format int64
   * @example 0
   */
  maintenance?: number;
  maintenance_info: MoiraMaintenanceInfo;
  metrics: Record<string, MoiraMetricState>;
  /**
   * MetricsToTargetRelation is a map that holds relation between metric names that was alone during last
   * check and targets that fetched this metric
   * 	{"t1": "metric.name.1", "t2": "metric.name.2"}
   * @example {"t1":"metric.name.1","t2":"metric.name.2"}
   */
  metrics_to_target_relation: Record<string, string>;
  msg?: string;
  /**
   * @format int64
   * @example 100
   */
  score: number;
  /** @example "OK" */
  state: string;
  /** @example true */
  suppressed?: boolean;
  suppressed_state?: string;
  /**
   * Timestamp - time, which means when the checker last checked this trigger, this value stops updating if the trigger does not receive metrics
   * @format int64
   * @example 1590741916
   */
  timestamp?: number;
  /** @example "trigger_id" */
  trigger_id: string;
}

export interface DtoTriggerCheckResponse {
  /**
   * Graphite-like targets: t1, t2, ...
   * @uniqueItems false
   */
  targets?: DtoTreeOfProblems[];
}

export interface DtoTriggerDump {
  created: string;
  last_check: MoiraCheckData;
  /** @uniqueItems false */
  metrics: DtoPatternMetrics[];
  trigger: MoiraTrigger;
}

export interface DtoTriggerMaintenance {
  metrics: Record<string, number>;
  /**
   * @format int64
   * @example 1594225165
   */
  trigger?: number | null;
}

export type DtoTriggerMetrics = Record<
  string,
  Record<string, MoiraMetricValue[]>
>;

export interface DtoTriggerModel {
  /**
   * A list of targets that have only alone metrics
   * @example {"t1":true}
   */
  alone_metrics: Record<string, boolean>;
  /**
   * Shows the exact cluster from where the metrics are fetched
   * @example "default"
   */
  cluster_id: string;
  /** Datetime when the trigger was created */
  created_at: string | null;
  /** Username who created trigger */
  created_by: string;
  /**
   * Description string
   * @example "check the size of /var/log"
   */
  desc?: string | null;
  /**
   * ERROR threshold
   * @example 1000
   */
  error_value: number | null;
  /**
   * Used if you need more complex logic than provided by WARN/ERROR values
   * @example ""
   */
  expression: string;
  /**
   * Trigger unique ID
   * @example "292516ed-4924-4154-a62c-ebe312431fce"
   */
  id: string;
  /**
   * Shows if trigger is remote (graphite-backend) based or stored inside Moira-Redis DB
   *
   * Deprecated: Use TriggerSource field instead
   * @example false
   */
  is_remote: boolean;
  /**
   * If true, first event NODATA → OK will be omitted
   * @example false
   */
  mute_new_metrics: boolean;
  /**
   * Trigger name
   * @example "Not enough disk space left"
   */
  name: string;
  /**
   * Graphite patterns for trigger
   * @uniqueItems false
   * @example [""]
   */
  patterns: string[];
  /** Determines when Moira should monitor trigger */
  sched?: MoiraScheduleData;
  /**
   * Set of tags to manipulate subscriptions
   * @uniqueItems false
   * @example ["server","disk"]
   */
  tags: string[];
  /**
   * Graphite-like targets: t1, t2, ...
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /**
   * Shows the type of source from where the metrics are fetched
   * @example "graphite_local"
   */
  trigger_source: string;
  /**
   * Could be: rising, falling, expression
   * @example "rising"
   */
  trigger_type: string;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @format int64
   * @example 600
   */
  ttl?: number;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @example "NODATA"
   */
  ttl_state?: string | null;
  /** Datetime  when the trigger was updated */
  updated_at: string | null;
  /** Username who updated trigger */
  updated_by: string;
  /**
   * WARN threshold
   * @example 500
   */
  warn_value: number | null;
}

export interface DtoTriggerNoisiness {
  /**
   * A list of targets that have only alone metrics
   * @example {"t1":true}
   */
  alone_metrics: Record<string, boolean>;
  /**
   * Shows the exact cluster from where the metrics are fetched
   * @example "default"
   */
  cluster_id: string;
  /** Datetime when the trigger was created */
  created_at: string | null;
  /** Username who created trigger */
  created_by: string;
  /**
   * Description string
   * @example "check the size of /var/log"
   */
  desc?: string | null;
  /**
   * ERROR threshold
   * @example 1000
   */
  error_value: number | null;
  /** EventsCount for the trigger. */
  events_count: number;
  /**
   * Used if you need more complex logic than provided by WARN/ERROR values
   * @example ""
   */
  expression: string;
  /**
   * Trigger unique ID
   * @example "292516ed-4924-4154-a62c-ebe312431fce"
   */
  id: string;
  /**
   * Shows if trigger is remote (graphite-backend) based or stored inside Moira-Redis DB
   *
   * Deprecated: Use TriggerSource field instead
   * @example false
   */
  is_remote: boolean;
  /**
   * If true, first event NODATA → OK will be omitted
   * @example false
   */
  mute_new_metrics: boolean;
  /**
   * Trigger name
   * @example "Not enough disk space left"
   */
  name: string;
  /**
   * Graphite patterns for trigger
   * @uniqueItems false
   * @example [""]
   */
  patterns: string[];
  /** Determines when Moira should monitor trigger */
  sched?: MoiraScheduleData;
  /**
   * Set of tags to manipulate subscriptions
   * @uniqueItems false
   * @example ["server","disk"]
   */
  tags: string[];
  /**
   * Graphite-like targets: t1, t2, ...
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /**
   * @format int64
   * @example 0
   */
  throttling: number;
  /**
   * Shows the type of source from where the metrics are fetched
   * @example "graphite_local"
   */
  trigger_source: string;
  /**
   * Could be: rising, falling, expression
   * @example "rising"
   */
  trigger_type: string;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @format int64
   * @example 600
   */
  ttl?: number;
  /**
   * When there are no metrics for trigger, Moira will switch metric to TTLState state after TTL seconds
   * @example "NODATA"
   */
  ttl_state?: string | null;
  /** Datetime  when the trigger was updated */
  updated_at: string | null;
  /** Username who updated trigger */
  updated_by: string;
  /**
   * WARN threshold
   * @example 500
   */
  warn_value: number | null;
}

export interface DtoTriggerNoisinessList {
  /**
   * List of entities.
   * @uniqueItems false
   */
  list: DtoTriggerNoisiness[];
  /**
   * Page number.
   * @format int64
   * @example 0
   */
  page: number;
  /**
   * Size is the amount of entities per Page.
   * @format int64
   * @example 100
   */
  size: number;
  /**
   * Total amount of entities in the database.
   * @format int64
   * @example 10
   */
  total: number;
}

export interface DtoTriggersList {
  /** @uniqueItems false */
  list: MoiraTriggerCheck[];
  /** @format int64 */
  page?: number | null;
  pager?: string | null;
  /** @format int64 */
  size?: number | null;
  /** @format int64 */
  total?: number | null;
}

export interface DtoTriggersSearchResultDeleteResponse {
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  pager_id: string;
}

export interface DtoUser {
  /** @example true */
  auth_enabled?: boolean;
  /** @example "john" */
  login: string;
  /** @example "user" */
  role?: string;
}

export interface DtoUserSettings {
  /** @example true */
  auth_enabled?: boolean;
  /** @uniqueItems false */
  contacts: DtoContactWithScore[];
  /** @example "john" */
  login: string;
  /** @example "user" */
  role?: string;
  /** @uniqueItems false */
  subscriptions: DtoSubscription[];
}

export interface DtoUserTeams {
  /** @uniqueItems false */
  teams: DtoTeamModel[];
}

export interface MoiraCheckData {
  /**
   * @format int64
   * @example 1590741878
   */
  event_timestamp?: number;
  /**
   * LastSuccessfulCheckTimestamp - time of the last check of the trigger, during which there were no errors
   * @format int64
   * @example 1590741916
   */
  last_successful_check_timestamp: number;
  /**
   * @format int64
   * @example 0
   */
  maintenance?: number;
  maintenance_info: MoiraMaintenanceInfo;
  metrics: Record<string, MoiraMetricState>;
  /**
   * MetricsToTargetRelation is a map that holds relation between metric names that was alone during last
   * check and targets that fetched this metric
   * 	{"t1": "metric.name.1", "t2": "metric.name.2"}
   * @example {"t1":"metric.name.1","t2":"metric.name.2"}
   */
  metrics_to_target_relation: Record<string, string>;
  msg?: string;
  /**
   * @format int64
   * @example 100
   */
  score: number;
  /** @example "OK" */
  state: string;
  /** @example true */
  suppressed?: boolean;
  suppressed_state?: string;
  /**
   * Timestamp - time, which means when the checker last checked this trigger, this value stops updating if the trigger does not receive metrics
   * @format int64
   * @example 1590741916
   */
  timestamp?: number;
}

export interface MoiraContactData {
  extra_message?: string;
  /** @example "1dd38765-c5be-418d-81fa-7a5f879c2315" */
  id: string;
  /** @example "Mail Alerts" */
  name?: string;
  team: string;
  /** @example "mail" */
  type: string;
  /** @example "" */
  user: string;
  /** @example "devops@example.com" */
  value: string;
}

export interface MoiraEventInfo {
  /**
   * @format int64
   * @example 0
   */
  interval?: number | null;
  maintenance?: MoiraMaintenanceInfo;
}

export interface MoiraMaintenanceInfo {
  /**
   * @format int64
   * @example 0
   */
  remove_time: number | null;
  remove_user: string | null;
  /**
   * @format int64
   * @example 0
   */
  setup_time: number | null;
  setup_user: string | null;
}

export interface MoiraMetricState {
  /**
   * DeletedButKept controls whether the metric is shown to the user if the trigger has ttlState = Del
   * and the metric is in Maintenance. The metric remains in the database
   * @example false
   */
  deleted_but_kept?: boolean;
  /**
   * @format int64
   * @example 1590741878
   */
  event_timestamp: number;
  /**
   * @format int64
   * @example 0
   */
  maintenance?: number;
  maintenance_info: MoiraMaintenanceInfo;
  /** @example "OK" */
  state: string;
  /** @example false */
  suppressed: boolean;
  suppressed_state?: string;
  /**
   * @format int64
   * @example 1590741878
   */
  timestamp: number;
  /** @example 70 */
  value?: number | null;
  values?: Record<string, number>;
}

export interface MoiraMetricValue {
  /** @format int64 */
  step?: number;
  /** @format int64 */
  ts: number;
  value: number;
}

export interface MoiraNotificationEvent {
  contact_id?: string;
  event_message: MoiraEventInfo;
  /** @example "carbon.agents.*.metricsReceived" */
  metric: string;
  msg?: string | null;
  /** @example "ERROR" */
  old_state: string;
  /** @example "OK" */
  state: string;
  sub_id?: string | null;
  /**
   * @format int64
   * @example 1590741878
   */
  timestamp: number;
  /** @example true */
  trigger_event?: boolean;
  /** @example "5ff37996-8927-4cab-8987-970e80d8e0a8" */
  trigger_id: string;
  /** @example 70 */
  value?: number | null;
  values?: Record<string, number>;
}

export interface MoiraPlottingData {
  /** @example true */
  enabled: boolean;
  /** @example "dark" */
  theme: string;
}

/** Determines when Moira should monitor trigger */
export interface MoiraScheduleData {
  /** @uniqueItems false */
  days: MoiraScheduleDataDay[];
  /**
   * @format int64
   * @example 1439
   */
  endOffset: number;
  /**
   * @format int64
   * @example 0
   */
  startOffset: number;
  /**
   * @format int64
   * @example -60
   */
  tzOffset: number;
}

export interface MoiraScheduleDataDay {
  /** @example true */
  enabled: boolean;
  /** @example "Mon" */
  name?: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
}

export interface MoiraScheduledNotification {
  contact: MoiraContactData;
  /**
   * @format int64
   * @example 1594471900
   */
  created_at?: number;
  event: MoiraNotificationEvent;
  plotting: MoiraPlottingData;
  /** @example 0 */
  send_fail: number;
  /** @example false */
  throttled: boolean;
  /**
   * @format int64
   * @example 1594471927
   */
  timestamp: number;
  trigger: MoiraTriggerData;
}

export interface MoiraSubscriptionData {
  /** @example false */
  any_tags: boolean;
  /**
   * @uniqueItems false
   * @example ["acd2db98-1659-4a2f-b227-52d71f6e3ba1"]
   */
  contacts: string[];
  /** @example true */
  enabled: boolean;
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  id: string;
  /** @example false */
  ignore_recoverings?: boolean;
  /** @example false */
  ignore_warnings?: boolean;
  plotting: MoiraPlottingData;
  /** Determines when Moira should monitor trigger */
  sched: MoiraScheduleData;
  /**
   * @uniqueItems false
   * @example ["server","cpu"]
   */
  tags: string[];
  /** @example "324516ed-4924-4154-a62c-eb124234fce" */
  team_id: string;
  /** @example false */
  throttling: boolean;
  /** @example "" */
  user: string;
}

export interface MoiraTrigger {
  /** @example {"t1":true} */
  alone_metrics: Record<string, boolean>;
  /** @example "default" */
  cluster_id?: string;
  /** @format int64 */
  created_at: number | null;
  created_by: string;
  /** @example "check the size of /var/log" */
  desc?: string | null;
  /** @example 1000 */
  error_value: number | null;
  /** @example "" */
  expression?: string | null;
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  id: string;
  /** @example false */
  mute_new_metrics: boolean;
  /** @example "Not enough disk space left" */
  name: string;
  /**
   * @uniqueItems false
   * @example [""]
   */
  patterns: string[];
  python_expression?: string | null;
  /** Determines when Moira should monitor trigger */
  sched?: MoiraScheduleData;
  /**
   * @uniqueItems false
   * @example ["server","disk"]
   */
  tags: string[];
  /**
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /** @example "graphite_local" */
  trigger_source?: string;
  /** @example "rising" */
  trigger_type: string;
  /**
   * @format int64
   * @example 600
   */
  ttl?: number;
  /** @example "NODATA" */
  ttl_state?: string | null;
  /** @format int64 */
  updated_at: number | null;
  updated_by: string;
  /** @example 5000 */
  warn_value: number | null;
}

export interface MoiraTriggerCheck {
  /** @example {"t1":true} */
  alone_metrics: Record<string, boolean>;
  /** @example "default" */
  cluster_id?: string;
  /** @format int64 */
  created_at: number | null;
  created_by: string;
  /** @example "check the size of /var/log" */
  desc?: string | null;
  /** @example 1000 */
  error_value: number | null;
  /** @example "" */
  expression?: string | null;
  highlights: Record<string, string>;
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  id: string;
  last_check: MoiraCheckData;
  /** @example false */
  mute_new_metrics: boolean;
  /** @example "Not enough disk space left" */
  name: string;
  /**
   * @uniqueItems false
   * @example [""]
   */
  patterns: string[];
  python_expression?: string | null;
  /** Determines when Moira should monitor trigger */
  sched?: MoiraScheduleData;
  /**
   * @uniqueItems false
   * @example ["server","disk"]
   */
  tags: string[];
  /**
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /**
   * @format int64
   * @example 0
   */
  throttling: number;
  /** @example "graphite_local" */
  trigger_source?: string;
  /** @example "rising" */
  trigger_type: string;
  /**
   * @format int64
   * @example 600
   */
  ttl?: number;
  /** @example "NODATA" */
  ttl_state?: string | null;
  /** @format int64 */
  updated_at: number | null;
  updated_by: string;
  /** @example 5000 */
  warn_value: number | null;
}

export interface MoiraTriggerData {
  /**
   * @uniqueItems false
   * @example ["server","disk"]
   */
  __notifier_trigger_tags: string[];
  /** @example "default" */
  cluster_id?: string;
  /** @example "check the size of /var/log" */
  desc: string;
  /** @example 1000 */
  error_value: number;
  /** @example "292516ed-4924-4154-a62c-ebe312431fce" */
  id: string;
  /** @example false */
  is_remote: boolean;
  /** @example "Not enough disk space left" */
  name: string;
  /**
   * @uniqueItems false
   * @example ["devOps.my_server.hdd.freespace_mbytes"]
   */
  targets: string[];
  /** @example "graphite_local" */
  trigger_source?: string;
  /** @example 5000 */
  warn_value: number;
}
