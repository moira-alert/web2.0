declare module "*.less" {
    declare const less: classNames | ((name: string) => string);
    export default less;
}
