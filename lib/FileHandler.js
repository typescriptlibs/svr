/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

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
        this.server = server;
    }
    /* *
     *
     *  Functions
     *
     * */
    handleRequest(url, input, output) {
        let localPath = System.joinPath(this.rootPath, url.pathname);
        if (System.folderExists(localPath)) {
            localPath = System.joinPath(localPath, 'index.html');
        }
        if (System.fileExists(localPath)) {
            output.statusCode = 200;
            output.setHeader('Content-Type', ContentTypes.getType(localPath));
            output.setHeader('Content-Length', System.fileSize(localPath));
            output.end(System.fileContent(localPath));
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default FileHandler;