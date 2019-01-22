// flow-typed signature: 31fd71cabf421875ba2411998d57c9f7
// flow-typed version: da40cdd96e/react-media_v1.x.x/flow_>=v0.54.1

declare module 'react-media' {
  declare type ReactMediaQueryObject = {
    [prop: string]: string | number | boolean
  };

  declare type Props = {
    defaultMatches?: boolean,
    query?: string | ReactMediaQueryObject | Array<ReactMediaQueryObject>,
    render?: () => React$Node,
    children?: React$Node | (matches: boolean) => React$Node,
    targetWindow?: {
      matchMedia(query: string): void
    }
  };

  declare module.exports: React$ComponentType<Props>;
}
