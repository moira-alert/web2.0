// @flow
import createApiProvider from './MoiraApiProvider';
import createApiInjectionWrapper from './MoiraApiInjectionWrapper';

export const ApiProvider = createApiProvider('moiraApi');
export const withMoiraApi = createApiInjectionWrapper('moiraApi');
