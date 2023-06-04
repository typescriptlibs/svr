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


import ContentTypes from './ContentTypes.js';

import Request from './Request.js';

import Server from './Server.js';

import System from './System.js';


/* *
 *
 *  Class
 *
 * */


export class FileHandler {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server
    ) {
        this.rootPath = server.options.rootPath || './';
    }


    /* *
     *
     *  Properties
     *
     * */


    public rootPath: string;


    /* *
     *
     *  Functions
     *
     * */


    public handleRequest (
        request: Request
    ): void {
        const output = request.output;

        let localPath = System.joinPath( this.rootPath, request.url.pathname );

        if ( System.folderExists( localPath ) ) {
            localPath = System.joinPath( localPath, 'index.html' );
        }

        if ( System.fileExists( localPath ) ) {
            output.statusCode = 200;
            output.setHeader( 'Content-Type', ContentTypes.getType( localPath ) );
            output.setHeader( 'Content-Length', System.fileSize( localPath ) );
            output.end( System.fileContent( localPath ) );
        }
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default FileHandler;
