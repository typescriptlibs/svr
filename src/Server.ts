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


import type CGIHandler from './CGIHandler.js';

import type TypeScriptHandler from './TypeScriptHandler.js';

import ErrorHandler from './ErrorHandler.js';

import FileHandler from './FileHandler.js';

import HTTP from 'node:http';

import HTTPS from 'node:https';

import Log from './Log.js';

import Request from './Request.js';


/* *
 *
 *  Declarations
 *
 * */


export interface ServerHandlers {
    CGIHandler?: typeof CGIHandler;
    TypeScriptHandler?: typeof TypeScriptHandler;
}

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
     *  Static Functions
     *
     * */


    public static async create (
        options: ServerOptions = { httpPort: 0 }
    ): Promise<Server> {
        const serverHandlers: ServerHandlers = {};

        if ( typeof options.cgiPath === 'string' ) {
            serverHandlers.CGIHandler = ( await import( './CGIHandler.js' ) ).default;
        }

        if ( typeof options.typeScript === 'string' ) {
            serverHandlers.TypeScriptHandler = ( await import( './TypeScriptHandler.js' ) ).default;
        }

        return new Server( options, serverHandlers );
    }


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        options: ServerOptions = { httpPort: 0 },
        serverHandlers?: ServerHandlers
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

        this.attachListeners();

        this.errorHandler = new ErrorHandler( this );
        this.fileHandler = new FileHandler( this );

        this.attachHandlers( serverHandlers );
    }


    /* *
     *
     *  Properties
     *
     * */


    public cgiHandler?: CGIHandler;

    public readonly errorHandler: ErrorHandler;

    public readonly fileHandler: FileHandler;

    public readonly http?: HTTP.Server;

    public readonly https?: HTTPS.Server;

    public readonly log: Log;

    public readonly options: ServerOptions;

    public typeScriptHandler?: TypeScriptHandler;


    /* *
     *
     *  Functions
     *
     * */


    protected attachHandlers (
        serverHandlers?: ServerHandlers
    ): void {

        if ( serverHandlers?.CGIHandler ) {
            this.cgiHandler = new serverHandlers.CGIHandler( this );
        }

        if ( serverHandlers?.TypeScriptHandler ) {
            this.typeScriptHandler = new serverHandlers.TypeScriptHandler( this );
        }
    }


    private attachListeners (): void {
        const http = this.http;
        const https = this.https;
        const log = this.log;

        const onRequest = async (
            input: ServerInput,
            output: ServerOutput
        ) => {
            const request = new Request( this, input, output );

            try {
                log.info( request.url.toString() );

                if ( this.cgiHandler && !output.headersSent ) {
                    await this.cgiHandler.handleRequest( request );
                }

                if ( this.typeScriptHandler && !output.headersSent ) {
                    await this.typeScriptHandler.handleRequest( request );
                }

                if ( !output.headersSent ) {
                    await this.fileHandler.handleRequest( request );
                }

                if ( !output.headersSent ) {
                    await this.errorHandler.handleRequest( request, 404 );
                }
            }
            catch ( error ) {
                log.error( '' + error );

                if ( !output.headersSent ) {
                    await this.errorHandler.handleRequest( request, 500 );
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
