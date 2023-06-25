/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/


/* *
 *
 *  Import
 *
 * */


import { NetworkSocket } from './Network.js';

import Server, { ServerInput, ServerOutput } from './Server.js';

import System from './System.js';


/* *
 *
 *  Constants
 *
 * */


const STACK_PATTERN = /\n\s+at\s+(\S+)\s+\(/s;


/* *
 *
 *  Class
 *
 * */


export class Log {


    /* *
     *
     *  Static Functions
     *
     * */


    public static dateString (): string {
        return new Date().toISOString();
    }


    public static error (
        error: unknown,
        input?: ServerInput,
        source?: string
    ): void {
        const args = [
            `[${Log.dateString()}]`,
        ];

        if ( source ) {
            args.push( `[${source}]` );
        }
        else if ( error instanceof Error ) {
            const errorSource = error.stack && error.stack.match( STACK_PATTERN );

            if ( errorSource ) {
                args.push( `[${errorSource[1]}]` );
            }
        }

        args.push( `[pid ${System.PID}]`, );

        if ( input ) {
            const socket: ( NetworkSocket | undefined ) = input.socket;

            if ( socket?.remoteAddress ) {
                args.push( `[client ${socket.remoteAddress}:${socket.remotePort}]` );
            }
        }

        args.push( `${error}` );

        console.error( ...args );
    }


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server
    ) {
        this.server = server;
    }


    /* *
     *
     *  Properties
     *
     * */


    public server: Server;


    /* *
     *
     *  Functions
     *
     * */


    public error (
        error: unknown,
        input?: ServerInput,
        scope?: string
    ): void {
        Log.error( error, input, scope );
    }


    public listening ( address: string ) {
        this.error( `Listening on ${address}` );
    }


    public request (
        input: ServerInput,
        output: ServerOutput
    ) {
        console.info(
            input.socket.remoteAddress || '-',
            '-',
            '-',
            `[${Log.dateString()}]`,
            `"${input.method || 'GET'} ${input.url} HTTP/${input.httpVersion}"`,
            output.statusCode,
            output.getHeader( 'Content-Length' ) || '-'
        );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Log;
