import { LoggerInterface } from "../types";
/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */
export declare class Logger implements LoggerInterface {
    static DEFAULT_SCOPE: string;
    private static parsePathToScope;
    private scope;
    constructor(scope?: string);
    set(scope?: string): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    private log;
    private formatScope;
}
