// @flow
import type { IMoiraApi } from "./MoiraAPI";
import { createApiProvider, createWithApiWrapper } from "./ApiInjection";

type ApiProps = { moiraApi: IMoiraApi };

export const ApiProvider = createApiProvider(["moiraApi"]);
export const withMoiraApi = createWithApiWrapper("moiraApi", (null: ?ApiProps));
