declare namespace Express {
    export interface Response {
        headers: any;
    }
}

declare module "providers.json" {
    const value: string
    export default value;
}
