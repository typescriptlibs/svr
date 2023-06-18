/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import TLS from 'node:tls';
/* *
 *
 *  Class
 *
 * */
export class Request {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(server, input, output) {
        const protocol = (input.socket instanceof TLS.TLSSocket ? 'https' : 'http');
        this.input = output.req;
        this.output = output;
        this.protocol = protocol;
        this.server = server;
        this.url = new URL((input.url || ''), `${protocol}://${input.headers.host}`);
    }
    /* *
     *
     *  Functions
     *
     * */
    endResponse(content) {
        const output = this.output;
        output.setHeader('Content-Length', Buffer.byteLength(content));
        output.end(content);
    }
    errorResponse(statusCode, logError, logScope) {
        const server = this.server;
        server.log.error(logError || `HTTP Status ${statusCode}`, this.input, logScope);
        server.errorHandler.handleRequest(this, statusCode);
    }
    getBody() {
        if (this._body) {
            return Promise.resolve(this._body);
        }
        return new Promise((resolve, reject) => {
            const input = this.input;
            const chunks = [];
            input.on('error', reject);
            input.on('data', (chunk) => chunks.push(chunk));
            input.on('end', () => {
                this._body = Buffer.concat(chunks);
                resolve(this._body);
            });
        });
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Request;
