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
        let localPath = System.joinPath( this.rootPath, url.pathname );

        if ( System.folderExists( localPath ) ) {
            localPath = System.joinPath( localPath, 'index.html' );
        }

        if ( System.fileExists( localPath ) ) {
            response.statusCode = 200;
            response.setHeader( 'Content-Type', ContentTypes.getType( localPath ) );
            response.setHeader( 'Content-Length', System.fileSize( localPath ) );
            response.end( System.fileContent( localPath ) );
        }
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default FileHandler;