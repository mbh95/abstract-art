/* eslint import/no-webpack-loader-syntax: off */
declare module "!raw-loader!*" {
    const content: string;
    export default content;
}