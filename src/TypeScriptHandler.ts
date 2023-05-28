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


import type HTTP from 'node:http';

import type Server from './Server.js';

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


    public constructor (
        server: Server
    ) {
        this.rootPath = server.options.rootPath || './';
        this.server = server;
    }


    /* *
     *
     *  Properties
     *
     * */


    public rootPath: string;

    public server: Server;


    /* *
     *
     *  Functions
     *
     * */


    public handleRequest (
        url: URL,
        request: HTTP.IncomingMessage,
        response: HTTP.ServerResponse
    ): void {
        const jsPathname = url.pathname;
        const jsExtension = System.fileExtension( jsPathname );

        if (
            jsExtension !== 'js' &&
            jsExtension !== 'jsx'
        ) {
            return;
        }

        const tsExtension = jsExtension.replace( 'js', 'ts' );
        const tsPathname = jsPathname.substring( 0, jsPathname.length - jsExtension.length ) + tsExtension;

        const rootPath = this.rootPath;
        const localJSPath = System.joinPath( rootPath, jsPathname );
        const localTSPath = System.joinPath( rootPath, tsPathname );

        if (
            !System.fileExists( localJSPath ) &&
            System.fileExists( localTSPath )
        ) {
            const jsFile = TypeScript.transpile(
                System.fileContent( localTSPath ),
                {
                    target: TypeScript.ScriptTarget.ESNext
                },
                localTSPath
            );

            response.statusCode = 200;
            response.setHeader( 'Content-Type', ContentTypes.types[jsExtension] );
            response.setHeader( 'Content-Length', jsFile.length );
            response.end( jsFile );
        }
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default TypeScriptHandler;
