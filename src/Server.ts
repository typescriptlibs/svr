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


import FileHandler from './FileHandler.js';

import HTTP from 'node:http';

import HTTPS from 'node:https';


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
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly http?: HTTP.Server;

    public readonly https?: HTTPS.Server;

    public readonly options: ServerOptions;


    /* *
     *
     *  Functions
     *
     * */


    private attachListeners (
        server: HTTP.Server
    ): void {
        const options = this.options;
        const protocol = server instanceof HTTPS.Server ? 'https' : 'http';

        server.on(
            'request',
            ( request, response ) => {
                const url = new URL( ( request.url || '' ), `${protocol}://${request.headers.host}` );

                if ( options.cgiPath ) {
                    // @todo
                }

                if ( options.typeScript ) {
                    // @todo
                }

                FileHandler.handleRequest( url, request, response );
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
