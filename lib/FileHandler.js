/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/* *
 *
 *  Imports
 *
 * */
import ContentTypes from './ContentTypes.js';
import System from './System.js';
/* *
 *
 *  Constants
 *
 * */
const ERROR_SCOPE = 'FileHandler.handleRequest';
const DOT_PATTERN = /(?:^|\/)\.[^\.\/\\]/;
/* *
 *
 *  Class
 *
 * */
export class FileHandler {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(server) {
        this.rootPath = server.options.rootPath || './';
    }
    /* *
     *
     *  Functions
     *
     * */
    handleRequest(request) {
        const input = request.input;
        const output = request.output;
        const server = request.server;
        const errorHandler = server.errorHandler;
        const log = server.log;
        const method = input.method;
        if (method === 'POST' ||
            method === 'PUT') {
            request.errorResponse(405, `Unsupported method: ${method}`, ERROR_SCOPE);
            return;
        }
        let localPath = System.joinPath(this.rootPath, request.url.pathname);
        if (DOT_PATTERN.test(localPath)) {
            request.errorResponse(403, `Forbidden dot-file: ${localPath}`, ERROR_SCOPE);
            return;
        }
        if (System.folderExists(localPath)) {
            if (!System.permissions(localPath).other.x) {
                request.errorResponse(403, `Folder denied: ${localPath}`, ERROR_SCOPE);
                return;
            }
            localPath = System.joinPath(localPath, 'index.html');
        }
        if (System.fileExists(localPath)) {
            const permissions = System.permissions(localPath);
            if (!permissions.other.r || permissions.other.x) {
                request.errorResponse(403, `File denied: ${localPath}`, ERROR_SCOPE);
                return;
            }
            const content = System.fileContent(localPath);
            output.statusCode = 200;
            output.setHeader('Content-Type', ContentTypes.getType(localPath));
            request.endResponse(content);
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default FileHandler;
