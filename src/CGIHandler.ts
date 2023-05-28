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


export class CGIHandler {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server
    ) {
        this.cgiPath = server.options.cgiPath || '/cgi-bin';
        this.rootPath = server.options.rootPath || './';
        this.server = server;
    }


    /* *
     *
     *  Properties
     *
     * */


    public cgiPath: string;

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

        if ( !url.pathname.startsWith( this.cgiPath ) ) {
            return;
        }

        const localPath = System.joinPath( this.rootPath, url.pathname );

        if ( System.fileExists( localPath ) ) {
            const result = System.exec( localPath );

            response.statusCode = 200;
            response.setHeader( 'Content-Type', ContentTypes.types._default );
            response.setHeader( 'Content-Length', result.length );
            response.end( result );
        }
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default CGIHandler;
