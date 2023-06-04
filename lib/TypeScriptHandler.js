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
import TypeScript from 'typescript';
/* *
 *
 *  Class
 *
 * */
export class TypeScriptHandler {
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
        const output = request.output;
        const jsPathname = request.url.pathname;
        const jsExtension = System.fileExtension(jsPathname);
        if (jsExtension !== 'js' &&
            jsExtension !== 'jsx') {
            return;
        }
        const tsExtension = jsExtension.replace('js', 'ts');
        const tsPathname = jsPathname.substring(0, jsPathname.length - jsExtension.length) + tsExtension;
        const rootPath = this.rootPath;
        const localJSPath = System.joinPath(rootPath, jsPathname);
        const localTSPath = System.joinPath(rootPath, tsPathname);
        if (!System.fileExists(localJSPath) &&
            System.fileExists(localTSPath)) {
            const jsFile = TypeScript.transpile(System.fileContent(localTSPath), {
                target: TypeScript.ScriptTarget.ESNext
            }, localTSPath);
            output.statusCode = 200;
            output.setHeader('Content-Type', ContentTypes.types[jsExtension]);
            output.setHeader('Content-Length', jsFile.length);
            output.end(jsFile);
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default TypeScriptHandler;
