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


/* *
 *
 *  Class
 *
 * */


export class ErrorHandler {


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


    public handleRequest (
        url: URL,
        request: HTTP.IncomingMessage,
        response: HTTP.ServerResponse,
        statusCode: number
    ): void {
        response.statusCode = statusCode;
        response.end();
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default ErrorHandler;
