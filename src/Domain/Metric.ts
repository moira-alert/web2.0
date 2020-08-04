
import { Status } from "./Status";

export type Metric = {
  state: Status;
  timestamp: number;
  suppressed?: boolean;
  event_timestamp?: number;
  value?: number;
  values?: {
    [metric: string]: number;
  };
  maintenance?: number;
  maintenance_info?: {
    setup_user: string | null | undefined;
    setup_time: number | null | undefined;
  };
};

export type MetricList = {
  [metric: string]: Metric;
};