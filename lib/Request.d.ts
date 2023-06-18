/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/// <reference types="node" resolution-mode="require"/>
import Server, { ServerInput, ServerOutput } from './Server.js';
export type RequestProtocol = ('http' | 'https');
export declare class Request {
    constructor(server: Server, input: ServerInput, output: ServerOutput);
    private _body?;
    readonly input: ServerInput;
    readonly output: ServerOutput;
    readonly protocol: RequestProtocol;
    readonly server: Server;
    readonly url: URL;
    endResponse(content: string): void;
    errorResponse(statusCode: number, logError?: unknown, logScope?: string): void;
    getBody(): Promise<Buffer>;
}
export default Request;
