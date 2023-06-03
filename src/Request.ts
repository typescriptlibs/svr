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

import Server, { ServerInput, ServerOutput, ServerProtocol } from './Server.js';

import TLS from 'node:tls';


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
        output: ServerOutput
    ) {
        const input: ServerInput = output.req;
        const protocol = ( input.socket instanceof TLS.TLSSocket ? 'https' : 'http' );

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

    public readonly protocol: ServerProtocol;

    public readonly server: Server;

    public readonly url: URL;


    /* *
     *
     *  Functions
     *
     * */


    public body (): Promise<Buffer> {

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
