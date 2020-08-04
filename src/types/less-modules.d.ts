declare module "*.less" {
    // eslint-disable-next-line prettier/prettier
    type CssModules = classNames | ((name: string) => string);
    declare const less = CssModules;
    export default less;
}
