/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

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


import Server, { ServerInput, ServerOutput } from './Server.js';

import TLS from 'node:tls';


/* *
 *
 *  Declarations
 *
 * */


export type RequestProtocol = (
    | 'http'
    | 'https'
);


/* *
 *
 *  Class
 *
 * */


export class Request {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server,
        input: ServerInput,
        output: ServerOutput
    ) {
        const protocol: RequestProtocol = ( input.socket instanceof TLS.TLSSocket ? 'https' : 'http' );

        this.input = output.req;
        this.output = output;
        this.protocol = protocol;
        this.server = server;
        this.url = new URL( ( input.url || '' ), `${protocol}://${input.headers.host}` );
    }


    /* *
     *
     *  Properties
     *
     * */


    private _body?: Buffer;

    public readonly input: ServerInput;

    public readonly output: ServerOutput;

    public readonly protocol: RequestProtocol;

    public readonly server: Server;

    public readonly url: URL;


    /* *
     *
     *  Functions
     *
     * */



    public endResponse (
        content: string
    ): void {
        const output = this.output;

        output.setHeader( 'Content-Length', Buffer.byteLength( content ) );
        output.end( content );
    }


    public errorResponse (
        statusCode: number,
        logError?: unknown,
        logScope?: string
    ): void {
        const server = this.server;

        server.log.error( logError || `HTTP Status ${statusCode}`, this.input, logScope );
        server.errorHandler.handleRequest( this, statusCode );
    }


    public getBody (): Promise<Buffer> {

        if ( this._body ) {
            return Promise.resolve( this._body );
        }

        return new Promise( ( resolve, reject ) => {
            const input = this.input;
            const chunks: Array<Uint8Array> = [];

            input.on( 'error', reject );

            input.on( 'data', ( chunk: Uint8Array ) => chunks.push( chunk ) );

            input.on( 'end', () => {
                this._body = Buffer.concat( chunks );

                resolve( this._body );
            } );
        } );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Request;
