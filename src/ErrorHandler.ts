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


import Request from './Request.js';

import Server from './Server.js';


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
        _server: Server
    ) {
    }


    /* *
     *
     *  Functions
     *
     * */


    public handleRequest (
        context: Request,
        statusCode: number
    ): void {
        context.output.statusCode = statusCode;
        context.output.end();
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default ErrorHandler;
