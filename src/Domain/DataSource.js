// @flow
export const DataSources = {
    REDIS: "REDIS",
    GRAPHITE: "GRAPHITE",
};

export const DataSourcesCaptions = {
    REDIS: "Redis. Use internal Moira storage",
    GRAPHITE: "Graphite. Use external data storage. Use with caution: it may create extra load for Graphite subsystem",
};
