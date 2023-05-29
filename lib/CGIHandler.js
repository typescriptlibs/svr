/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import System from './System.js';
/* *
 *
 *  Class
 *
 * */
export class CGIHandler {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(server) {
        this.cgiPath = server.options.cgiPath || '/cgi-bin';
        this.rootPath = server.options.rootPath || './';
        this.server = server;
    }
    /* *
     *
     *  Functions
     *
     * */
    handleRequest(url, input, output) {
        const cgiPath = this.cgiPath;
        const rootPath = this.rootPath;
        const urlPath = url.pathname;
        if (!urlPath.substring(1).startsWith(cgiPath)) {
            return;
        }
        const cgiSegments = urlPath.substring(cgiPath.length + 1).split(System.SEPARATOR, 2);
        const cgiName = cgiSegments[0] || '';
        const cgiInfo = cgiSegments[1] || '';
        const cgiScript = System.joinPath(rootPath, cgiPath, cgiName);
        if (System.fileExists(cgiScript)) {
            const options = {
                env: {
                    GATEWAY_INTERFACE: 'CGI/1.1',
                    PATH_INFO: cgiInfo,
                    PATH_TRANSLATED: System.joinPath(rootPath, cgiInfo),
                    QUERY_STRING: url.searchParams.toString(),
                    REMOTE_ADDR: input.socket.remoteAddress,
                    REQUEST_METHOD: input.method || 'GET',
                    SCRIPT_NAME: cgiName,
                    SERVER_NAME: url.hostname,
                    SERVER_PORT: url.port,
                    SERVER_PROTOCOL: url.protocol,
                    SERVER_SOFTWARE: `SVR/${System.VERSION}`
                }
            };
            const result = System.exec(cgiScript, options);
            output.statusCode = 200;
            output.setHeader('Content-Length', result.length);
            output.end(result);
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default CGIHandler;
