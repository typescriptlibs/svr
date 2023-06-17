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

import System, { ExecOptions } from './System.js';


/* *
 *
 *  Class
 *
 * */


export class CGIHandler {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server
    ) {
        this.cgiPath = server.options.cgiPath || '/cgi-bin';
        this.rootPath = server.options.rootPath || './';
    }


    /* *
     *
     *  Properties
     *
     * */


    public cgiPath: string;

    public rootPath: string;


    /* *
     *
     *  Functions
     *
     * */


    public async handleRequest (
        request: Request
    ): Promise<void> {
        const cgiPath = this.cgiPath;
        const rootPath = this.rootPath;
        const input = request.input;
        const output = request.output;
        const url = request.url;
        const urlPath = url.pathname;

        // If no CGI script requested

        if ( !urlPath.substring( 1 ).startsWith( cgiPath ) ) {
            return;
        }

        // Split request path (#4)

        const cgiName = (
            urlPath.substring( 0, urlPath.indexOf( '/', cgiPath.length + 2 ) ) ||
            urlPath // keep original if no trailing info found
        );
        const cgiInfo = urlPath.substring( cgiName.length );
        const cgiScript = System.joinPath( System.CWD, rootPath, cgiName );

        // If CGI script not found

        if (
            !System.fileExists( cgiScript ) ||
            !System.permissions( cgiScript ).other.x
        ) {
            request.server.errorHandler.handleRequest( request, 404 );
            return;
        }

        // Set environment variables

        const env: NodeJS.ProcessEnv = {
            GATEWAY_INTERFACE: 'CGI/1.1',
            HOME: process.env.HOME,
            PATH: process.env.PATH,
            PATH_INFO: cgiInfo,
            PATH_TRANSLATED: System.joinPath( System.CWD, rootPath, cgiInfo ),
            QUERY_STRING: url.searchParams.toString(),
            REMOTE_ADDR: input.socket.remoteAddress || '0.0.0.0',
            REMOTE_PORT: `${input.socket.remotePort || 0}`,
            REQUEST_METHOD: input.method || 'GET',
            REQUEST_URI: url.pathname + url.search,
            SCRIPT_FILENAME: cgiScript,
            SCRIPT_NAME: cgiName,
            SERVER_NAME: url.hostname,
            SERVER_PORT: url.port,
            SERVER_PROTOCOL: 'HTTP/1.1',
            SERVER_SOFTWARE: `SVR/${System.PACKAGE_VERSION}`
        };

        // Add HTTP header as environment variables

        const headers = input.headers;

        let envKey: string;
        let value: ( string | Array<string> | undefined );

        for ( const key in headers ) {
            value = headers[key];
            envKey = key.toUpperCase().replace( /-/g, '_' );

            env[`HTTP_${envKey}`] = (
                !value || typeof value === 'string' ?
                    value :
                    value.join( ', ' )
            );
        }

        // Indicate HTTPS as environment variable

        if ( url.protocol === 'https' ) {
            env['HTTPS'] = 'true';
        }

        // Add HTTP body as standard input

        const options: ExecOptions = {
            env
        };

        if ( input.method === 'POST' || input.method === 'PUT' ) {
            options.input = await request.body();
        }

        // Execute CGI script

        let result = '';

        try {
            result = await System.exec( cgiScript, [], options );
            output.statusCode = 200;
        } catch ( e ) {
            request.server.log.error( e );
            output.statusCode = 500;
        }

        // Search for HTTP headers in result (#2)

        const resultHeadersEnd = result.indexOf( '\n\n' );

        if ( resultHeadersEnd === -1 ) {
            output.setHeader( 'Content-Lengh', result.length );
            output.end( result );
        }

        // Transfer HTTP headers

        const headerPattern = /^([\w-]+):\s*(.+)$/gim;
        const resultHeaders = result.substring( 0, resultHeadersEnd );
        const resultBody = result.substring( resultHeadersEnd + 2 );

        let resultHeader: ( RegExpExecArray | null );

        while ( resultHeader = headerPattern.exec( resultHeaders ) ) {
            output.setHeader( resultHeader[1], resultHeader[2] );
        }

        // Overwrite Content-Length with our result

        output.setHeader( 'Content-Lengh', resultBody.length );

        // Write HTTP body

        output.end( resultBody );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default CGIHandler;
