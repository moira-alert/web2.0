export {
    ApiWebConfig as Config,
    ApiWebContact as ContactConfig,
} from "./__generated__/data-contracts";

export enum ECelebrationMode {
    newYear = "new_year",
}

export enum Platform {
    DEV = "dev",
    STAGING = "staging",
    PROD = "prod",
}
