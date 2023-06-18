/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import ErrorHandler from './ErrorHandler.js';
import FileHandler from './FileHandler.js';
import HTTP from 'node:http';
import HTTPS from 'node:https';
import Log from './Log.js';
import Network from './Network.js';
import Request from './Request.js';
/* *
 *
 *  Class
 *
 * */
export class Server {
    /* *
     *
     *  Static Functions
     *
     * */
    static async create(options = { httpPort: 0 }) {
        const serverHandlers = {};
        if (typeof options.cgiPath === 'string') {
            serverHandlers.CGIHandler = (await import('./CGIHandler.js')).default;
        }
        if (typeof options.ts === 'string') {
            serverHandlers.TSHandler = (await import('./TSHandler.js')).default;
        }
        return new Server(options, serverHandlers);
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(options = { httpPort: 0 }, serverHandlers) {
        this.options = options;
        this.log = new Log(this);
        try {
            if (typeof options.httpPort === 'number') {
                this.http = HTTP.createServer();
            }
            if (typeof options.httpsPort === 'number') {
                this.https = HTTPS.createServer({
                    cert: options.httpsCert,
                    key: options.httpsKey
                });
            }
            this.errorHandler = new ErrorHandler(this);
            this.fileHandler = new FileHandler(this);
            this.attachHandlers(serverHandlers);
            this.attachListeners();
        }
        catch (error) {
            this.log.error(error);
            throw error;
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    attachHandlers(serverHandlers) {
        if (serverHandlers === null || serverHandlers === void 0 ? void 0 : serverHandlers.CGIHandler) {
            this.cgiHandler = new serverHandlers.CGIHandler(this);
        }
        if (serverHandlers === null || serverHandlers === void 0 ? void 0 : serverHandlers.TSHandler) {
            this.typeScriptHandler = new serverHandlers.TSHandler(this);
        }
    }
    attachListeners() {
        const http = this.http;
        const https = this.https;
        const log = this.log;
        const onRequest = async (input, output) => {
            let request;
            try {
                request = new Request(this, input, output);
                if (this.cgiHandler && !output.headersSent) {
                    await this.cgiHandler.handleRequest(request);
                }
                if (this.typeScriptHandler && !output.headersSent) {
                    await this.typeScriptHandler.handleRequest(request);
                }
                if (!output.headersSent) {
                    await this.fileHandler.handleRequest(request);
                }
                if (!output.headersSent) {
                    await this.errorHandler.handleRequest(request, 404);
                }
            }
            catch (error) {
                log.error(error, input);
                if (!output.headersSent) {
                    await this.errorHandler.handleIO(input, output, 500);
                }
            }
            finally {
                log.request(input, output);
                output.end();
            }
        };
        const onListening = (httpServer) => {
            const address = httpServer.address();
            const protocol = (httpServer instanceof HTTPS.Server ? 'https' : 'http');
            if (address !== null) {
                log.listening(typeof address === 'string' ?
                    address :
                    `${protocol}://localhost:${address.port}`);
            }
        };
        if (http) {
            http.on('request', onRequest);
            http.on('listening', () => onListening(http));
        }
        if (https) {
            https.on('request', onRequest);
            https.on('listening', () => onListening(https));
        }
    }
    async start() {
        const http = this.http;
        const https = this.https;
        const options = this.options;
        try {
            if (http) {
                const httpPort = options.httpPort;
                if (httpPort &&
                    await Network.usedPort(httpPort)) {
                    throw new Error(`Port already in use. (${httpPort})`);
                }
                http.listen(httpPort);
            }
            if (https) {
                const httpsPort = options.httpsPort;
                if (httpsPort &&
                    await Network.usedPort(httpsPort)) {
                    throw new Error(`Port already in use. (${httpsPort})`);
                }
                https.listen(options.httpsPort);
            }
        }
        catch (error) {
            this.log.error(error);
            throw error;
        }
    }
    async stop() {
        const http = this.http;
        const https = this.https;
        try {
            if (http) {
                http.closeAllConnections();
            }
            if (https) {
                https.closeAllConnections();
            }
        }
        catch (error) {
            this.log.error(error);
            throw error;
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Server;
