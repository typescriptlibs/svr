/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import type CGIHandler from './CGIHandler.js';
import type TSHandler from './TSHandler.js';
import ErrorHandler from './ErrorHandler.js';
import FileHandler from './FileHandler.js';
import HTTP from 'node:http';
import HTTPS from 'node:https';
import Log from './Log.js';
export interface ServerHandlers {
    CGIHandler?: typeof CGIHandler;
    TSHandler?: typeof TSHandler;
}
export type ServerInput = HTTP.IncomingMessage;
export interface ServerOptions {
    cgiPath?: string;
    httpPort?: number;
    httpsCert?: string;
    httpsKey?: string;
    httpsPort?: number;
    rootPath?: string;
    ts?: boolean;
}
export type ServerOutput = HTTP.ServerResponse;
export declare class Server {
    static create(options?: ServerOptions): Promise<Server>;
    constructor(options?: ServerOptions, serverHandlers?: ServerHandlers);
    cgiHandler?: CGIHandler;
    readonly errorHandler: ErrorHandler;
    readonly fileHandler: FileHandler;
    readonly http?: HTTP.Server;
    readonly https?: HTTPS.Server;
    readonly log: Log;
    readonly options: ServerOptions;
    typeScriptHandler?: TSHandler;
    protected attachHandlers(serverHandlers?: ServerHandlers): void;
    private attachListeners;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export default Server;
