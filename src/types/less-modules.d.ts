declare module "*.less" {
    type CssModules = classNames | ((name: string) => string);
    declare const less = CssModules;
    export default less;
}
