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

import Log from './Log.js';

import TLS from 'node:tls';

import TypeScriptHandler from './TypeScriptHandler.js';


/* *
 *
 *  Declarations
 *
 * */


export type ServerInput = HTTP.IncomingMessage;

export interface ServerOptions {
    cgiPath?: string;
    httpPort?: number;
    httpsCert?: string;
    httpsKey?: string;
    httpsPort?: number;
    rootPath?: string;
    typeScript?: boolean;
}

export type ServerOutput = HTTP.ServerResponse;

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

        this.log = new Log( this );

        if ( typeof options.httpPort === 'number' ) {
            this.http = HTTP.createServer()
        }

        if ( typeof options.httpsPort === 'number' ) {
            this.https = HTTPS.createServer( {
                cert: options.httpsCert,
                key: options.httpsKey
            } );
        }

        this.errorHandler = new ErrorHandler( this );
        this.fileHandler = new FileHandler( this );

        if ( typeof options.cgiPath === 'string' ) {
            this.cgiHandler = new CGIHandler( this );
        }

        if ( options.typeScript === true ) {
            this.typeScriptHandler = new TypeScriptHandler( this );
        }

        this.attachListeners();
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

    public readonly log: Log;

    public readonly options: ServerOptions;

    public readonly typeScriptHandler?: TypeScriptHandler;


    /* *
     *
     *  Functions
     *
     * */


    private attachListeners (): void {
        const cgiHandler = this.cgiHandler;
        const errorHandler = this.errorHandler;
        const fileHandler = this.fileHandler;
        const http = this.http;
        const https = this.https;
        const log = this.log;
        const typeScriptHandler = this.typeScriptHandler;

        const onRequest = (
            input: ServerInput,
            output: ServerOutput
        ) => {
            const protocol = ( input.socket instanceof TLS.TLSSocket ? 'https' : 'http' );
            const url = new URL( ( input.url || '' ), `${protocol}://${input.headers.host}` );

            try {
                log.info( url.toString() );

                if ( cgiHandler && !output.headersSent ) {
                    cgiHandler.handleRequest( url, input, output );
                }

                if ( typeScriptHandler && !output.headersSent ) {
                    typeScriptHandler.handleRequest( url, input, output );
                }

                if ( !output.headersSent ) {
                    fileHandler.handleRequest( url, input, output );
                }

                if ( !output.headersSent ) {
                    errorHandler.handleRequest( url, input, output, 404 );
                }
            }
            catch ( error ) {
                log.error( '' + error );

                if ( !output.headersSent ) {
                    errorHandler.handleRequest( url, input, output, 500 );
                }
            }
            finally {
                output.end();
            }
        };

        const onListening = (
            httpServer: HTTP.Server
        ) => {
            const address = httpServer.address();
            const protocol = ( httpServer instanceof HTTPS.Server ? 'https' : 'http' );

            if ( address !== null ) {
                address
                log.info(
                    'Listening on',
                    typeof address === 'string' ?
                        address :
                        `${protocol}://localhost:${address.port}`
                );
            }
        };

        if ( http ) {
            http.on( 'request', onRequest );
            http.on( 'listening', () => onListening( http ) );
        }

        if ( https ) {
            https.on( 'request', onRequest );
            https.on( 'listening', () => onListening( https ) );
        }
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
