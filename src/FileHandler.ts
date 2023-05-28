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


/* *
 *
 *  Functions
 *
 * */


export function handleRequest (
    url: URL,
    request: HTTP.IncomingMessage,
    response: HTTP.ServerResponse
): void {
    response.statusCode = 200;
    response.setHeader( 'Content-Type', 'text/plain' );
    response.end(
        url.toJSON() + '\n' +
        `Hello, ${request.headers['user-agent']?.split( ' ' )[0]}`
    );
}


/* *
 *
 *  Default Export
 *
 * */


export const FileHandler = {
    handleRequest
};

export default FileHandler;
