export interface $ConnectionOptsType {
    debug?: any;
    connection: any;
    client?: string;
    pool?: {
        min: number;
        max: number;
    };
}
export interface $Config {
    db?: Object;
    cache?: Object;
    captureUncaught?: boolean;
    captureUnhandled?: boolean;
}
export interface $LoggerInterface {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
export interface $Address {
    city: string;
    state: string;
    zipCode: string;
    zip: string;
    address: string;
    street: string;
    streetAddress1: string;
    streetAddress2: string;
}
