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


import CGIHandler from './CGIHandler.js';

import ErrorHandler from './ErrorHandler.js';

import FileHandler from './FileHandler.js';

import HTTP from 'node:http';

import HTTPS from 'node:https';

import TypeScriptHandler from './TypeScriptHandler.js';


/* *
 *
 *  Declarations
 *
 * */


export interface ServerOptions {
    cgiPath?: string;
    httpPort?: number;
    httpsCert?: string;
    httpsKey?: string;
    httpsPort?: number;
    rootPath?: string;
    typeScript?: boolean;
}


/* *
 *
 *  Class
 *
 * */


export class Server {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        options: ServerOptions = { httpPort: 0 }
    ) {
        this.options = options;

        if ( typeof options.httpPort === 'number' ) {

            this.http = HTTP.createServer()

            this.attachListeners( this.http );
        }

        if ( typeof options.httpsPort === 'number' ) {

            this.https = HTTPS.createServer( {
                cert: options.httpsCert,
                key: options.httpsKey
            } );

            this.attachListeners( this.https );
        }

        this.errorHandler = new ErrorHandler( this );
        this.fileHandler = new FileHandler( this );

        if ( options.cgiPath ) {
            this.cgiHandler = new CGIHandler( this );
        }

        if ( options.typeScript ) {
            this.typeScriptHandler = new TypeScriptHandler( this );
        }
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly cgiHandler?: CGIHandler;

    public readonly errorHandler: ErrorHandler;

    public readonly fileHandler: FileHandler;

    public readonly http?: HTTP.Server;

    public readonly https?: HTTPS.Server;

    public readonly options: ServerOptions;

    public readonly typeScriptHandler?: TypeScriptHandler;


    /* *
     *
     *  Functions
     *
     * */


    private attachListeners (
        server: HTTP.Server
    ): void {
        const protocol = server instanceof HTTPS.Server ? 'https' : 'http';

        server.on(
            'request',
            ( request, response ) => {
                const url = new URL( ( request.url || '' ), `${protocol}://${request.headers.host}` );

                try {
                    if (
                        this.cgiHandler &&
                        !response.headersSent
                    ) {
                        this.cgiHandler.handleRequest( url, request, response );
                    }

                    if (
                        this.typeScriptHandler &&
                        !response.headersSent
                    ) {
                        this.typeScriptHandler.handleRequest( url, request, response );
                    }

                    if ( !response.headersSent ) {
                        this.fileHandler.handleRequest( url, request, response );
                    }

                    if ( !response.headersSent ) {
                        this.errorHandler.handleRequest( url, request, response, 404 );
                    }
                }
                catch ( error ) {
                    if ( !response.headersSent ) {
                        this.errorHandler.handleRequest( url, request, response, 500 );
                    }
                }
                finally {
                    response.end();
                }
            } );

        server.on(
            'listening',
            () => {
                const address = server.address();

                if ( address !== null ) {
                    address
                    console.info(
                        'Listening on',
                        typeof address === 'string' ?
                            address :
                            `${protocol}://localhost:${address.port}`
                    );
                }
            } );
    }


    public start () {
        const http = this.http;
        const https = this.https;
        const options = this.options;

        if ( http ) {
            http.listen( options.httpPort );
        }

        if ( https ) {
            https.listen( options.httpsPort );
        }
    }


    public stop () {
        const http = this.http;
        const https = this.https;

        if ( http ) {
            http.closeAllConnections();
        }

        if ( https ) {
            https.closeAllConnections();
        }
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Server
