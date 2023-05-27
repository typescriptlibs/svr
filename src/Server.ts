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


import HTTP from 'node:http';

import HTTPS from 'node:https';


/* *
 *
 *  Declarations
 *
 * */


export interface ServerOptions {
    httpPort?: number;
    httpsCert?: string;
    httpsCertKey?: string;
    httpsPort?: number;
    rootPath?: string;
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

        if ( typeof options.httpPort === 'number' ) {

            this.http = HTTP.createServer()

            this.attachListeners( this.http );
        }

        if ( typeof options.httpsPort === 'number' ) {

            this.https = HTTPS.createServer( {
                cert: options.httpsCert,
                key: options.httpsCertKey
            } );

            this.attachListeners( this.https );
        }

        this.options = options;
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

        server.on(
            'request',
            ( request, response ) => {
                response.statusCode = 200;
                response.setHeader( 'Content-Type', 'text/plain' );
                response.end( `Hello, ${request.headers['user-agent']?.split( ' ' )[0]}` );
            } );

        server.on(
            'listening',
            () => {
                const address = server.address();
                const protocol = server instanceof HTTPS.Server ? 'https' : 'http';

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
