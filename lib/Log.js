/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import System from './System.js';
/* *
 *
 *  Constants
 *
 * */
const STACK_PATTERN = /\n\s+at\s+(\S+)\s+\(/s;
/* *
 *
 *  Class
 *
 * */
export class Log {
    /* *
     *
     *  Static Functions
     *
     * */
    static dateString() {
        return new Date().toISOString();
    }
    static error(error, input, source) {
        const args = [
            `[${Log.dateString()}]`,
        ];
        if (source) {
            args.push(`[${source}]`);
        }
        else if (error instanceof Error) {
            const errorSource = error.stack && error.stack.match(STACK_PATTERN);
            if (errorSource) {
                args.push(`[${errorSource[1]}]`);
            }
        }
        args.push(`[pid ${System.PID}]`);
        if (input) {
            const socket = input.socket;
            if (socket === null || socket === void 0 ? void 0 : socket.remoteAddress) {
                args.push(`[client ${socket.remoteAddress}:${socket.remotePort}]`);
            }
        }
        args.push(`${error}`);
        console.error(...args);
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(server) {
        this.server = server;
    }
    /* *
     *
     *  Functions
     *
     * */
    error(error, input, scope) {
        Log.error(error, input, scope);
    }
    listening(address) {
        this.error(`Listening on ${address}`);
    }
    request(input, output) {
        console.info(input.socket.remoteAddress || '-', '-', '-', `[${Log.dateString()}]`, `"${input.method || 'GET'} ${input.url} HTTP/${input.httpVersion}"`, output.statusCode, output.getHeader('Content-Length') || '-');
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Log;
