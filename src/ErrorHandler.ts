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

import System from './System.js';


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
        request: Request,
        statusCode: number
    ): void {
        const output = request.output;

        output.statusCode = statusCode;
        output.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
        output.flushHeaders();

        const title = `${output.statusCode} ${output.statusMessage}`;

        output.end( [
            '<html>',
            '<head>',
            '<meta charset="UTF-8">',
            `<title>${title}</title>`,
            '</head>',
            '<body>',
            `<center><h1>${title}</h1></center>`,
            `<hr><center>SVR/${System.PACKAGE_VERSION}</center>`,
            '</body>',
            '</html>'
        ].join( '\n' ) );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default ErrorHandler;
