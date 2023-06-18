/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import Server, { ServerInput, ServerOutput } from './Server.js';
export declare class Log {
    static dateString(): string;
    static error(error: unknown, input?: ServerInput, source?: string): void;
    constructor(server: Server);
    server: Server;
    error(error: unknown, input?: ServerInput, scope?: string): void;
    listening(address: string): void;
    request(input: ServerInput, output: ServerOutput): void;
}
export default Log;
