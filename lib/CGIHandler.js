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
const ERROR_SCOPE = 'CGIHandler.handleRequest';
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
    }
    /* *
     *
     *  Functions
     *
     * */
    async handleRequest(request) {
        const cgiPath = this.cgiPath;
        const rootPath = this.rootPath;
        const input = request.input;
        const output = request.output;
        const server = request.server;
        const url = request.url;
        const errorHandler = server.errorHandler;
        const log = server.log;
        const urlPath = url.pathname;
        // Exit if no CGI script requested
        if (!urlPath.substring(1).startsWith(cgiPath)) {
            return;
        }
        // Split request path (#4)
        const cgiName = (urlPath.substring(0, urlPath.indexOf('/', cgiPath.length + 2)) ||
            urlPath // keep original if no trailing info found
        );
        const cgiInfo = urlPath.substring(cgiName.length);
        const cgiScript = System.joinPath(System.CWD, rootPath, cgiName);
        // If CGI script not found
        if (!System.fileExists(cgiScript) ||
            !System.permissions(cgiScript).other.x) {
            request.errorResponse(403, 'Script denied', ERROR_SCOPE);
            return;
        }
        // Set environment variables
        const env = {
            GATEWAY_INTERFACE: 'CGI/1.1',
            HOME: process.env.HOME,
            PATH: process.env.PATH,
            PATH_INFO: cgiInfo,
            PATH_TRANSLATED: System.joinPath(System.CWD, rootPath, cgiInfo),
            QUERY_STRING: url.searchParams.toString(),
            REMOTE_ADDR: input.socket.remoteAddress || '0.0.0.0',
            REMOTE_PORT: `${input.socket.remotePort || 0}`,
            REQUEST_METHOD: input.method || 'GET',
            REQUEST_URI: url.pathname + url.search,
            SCRIPT_FILENAME: cgiScript,
            SCRIPT_NAME: cgiName,
            SERVER_NAME: url.hostname,
            SERVER_PORT: url.port,
            SERVER_PROTOCOL: 'HTTP/1.1',
            SERVER_SOFTWARE: `Svr/${System.PACKAGE_VERSION}`
        };
        // Add HTTP header as environment variables
        const headers = input.headers;
        let envKey;
        let value;
        for (const key in headers) {
            value = headers[key];
            envKey = key.toUpperCase().replace(/-/g, '_');
            env[`HTTP_${envKey}`] = (!value || typeof value === 'string' ?
                value :
                value.join(', '));
        }
        // Indicate HTTPS as environment variable
        if (url.protocol === 'https') {
            env['HTTPS'] = 'true';
        }
        // Add HTTP body as standard input
        const options = {
            env
        };
        if (input.method === 'POST' || input.method === 'PUT') {
            options.input = await request.getBody();
        }
        // Execute CGI script
        let result = '';
        try {
            result = await System.exec(cgiScript, [], options);
            output.statusCode = 200;
        }
        catch (e) {
            request.errorResponse(502, e, ERROR_SCOPE);
            return;
        }
        // Search for HTTP headers in result (#2)
        const resultHeadersEnd = result.indexOf('\n\n');
        if (resultHeadersEnd === -1) {
            request.endResponse(result);
        }
        // Transfer HTTP headers
        const headerPattern = /^([\w-]+):\s*(.+)$/gim;
        const resultHeaders = result.substring(0, resultHeadersEnd);
        const resultBody = result.substring(resultHeadersEnd + 2);
        let resultHeader;
        while (resultHeader = headerPattern.exec(resultHeaders)) {
            output.setHeader(resultHeader[1], resultHeader[2]);
        }
        // Write HTTP body
        request.endResponse(resultBody);
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default CGIHandler;
