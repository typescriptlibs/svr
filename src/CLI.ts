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


import Network from './Network.js';

import OpenSSL from './OpenSSL.js';

import { Server, ServerOptions } from './Server.js';

import System, { ExecResult } from './System.js';


/* *
 *
 *  Constants
 *
 * */


export const VERSION = `Version ${System.VERSION}`;

export const HELP = [
    `SVR: Simple HTTP(S) Server - ${VERSION}`,
    '',
    `svr [options]`,
    '',
    'OPTIONS:',
    '',
    '  --cgi [path]         Activates CGI path for web browsers.',
    '',
    '  --help, -h           Prints only this help text.',
    '',
    '  --http [port]        Activates HTTP port. Port number is optional.',
    '',
    '  --https [port]       Activates HTTPS port. Port number is optional.',
    '',
    '  --https-cert [file]  File path to the HTTPS certificate. Optional.',
    '',
    '  --https-key [file]   File path to the HTTPS key. Optional.',
    '',
    '  --root [folder]      Root folder with files for web browsers.',
    '',
    '  --timeout [seconds]  Stops the server after the given amount of seconds.',
    '',
    '  --typescript         Activates transpile of TypeScript files for missing',
    '                       JavaScript files.',
    '',
    '  --version, -v        Prints only the version string.',
    '',
    'EXAMPLES:',
    '',
    '  npx svr',
    '  Starts the server and delivers files from the current folder to web browsers.',
];


/* *
 *
 *  Class
 *
 * */


export class CLI {


    /* *
     *
     *  Static Functions
     *
     * */


    public static async run (
        argv: Array<string>
    ): Promise<void> {
        return new CLI( argv, System ).run();
    }


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        argv: Array<string>,
        system: typeof System
    ) {
        this.args = System.args( argv );
        this.rootPath = ( typeof this.args.root === 'string' ? this.args.root : './' );
        this.system = system;
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly args: Record<string, ( boolean | string | Array<string> )>;

    public readonly rootPath: string;

    public readonly system: typeof System;


    /* *
     *
     *  Functions
     *
     * */


    public async run (): Promise<void> {
        const args = this.args;
        const system = this.system;

        if ( args.help || args.h ) {
            console.info( HELP.join( system.EOL ) );
            return;
        }

        if ( args.version || args.v ) {
            console.info( VERSION );
            return;
        }

        if ( args.timeout ) {
            setTimeout(
                () => process.exit(),
                parseInt( args.timeout.toString(), 10 ) * 1000
            );
        }

        let rootPath = this.rootPath;

        if ( !system.folderExists( rootPath ) ) {
            throw new Error( `Folder not found. (${rootPath})` );
        }

        const options: ServerOptions = {
            rootPath
        };

        if ( args.cgi ) {
            options.cgiPath = ( typeof args.cgi === 'string' ? args.cgi : 'cgi-bin' );
        }

        if ( args.http ) {
            options.httpPort = parseInt( args.http.toString(), 10 );

            if ( isNaN( options.httpPort ) ) {
                options.httpPort = await ( Network.freePort( 8000 ) );
            }
        }

        if ( args.https ) {
            options.httpsPort = parseInt( args.https.toString(), 10 );

            if ( isNaN( options.httpsPort ) ) {
                options.httpsPort = await ( Network.freePort( 8080 ) );
            }
        }

        if (
            args['https-cert'] &&
            args['https-key']
        ) {
            const certPath = args['https-cert'].toString();

            if ( System.fileExists( certPath ) ) {
                // set file content, not path (#1)
                options.httpsCert = System.fileContent( certPath );
            }

            const keyPath = args['https-key'].toString();

            if ( System.fileExists( keyPath ) ) {
                // set file content, not path (#1)
                options.httpsKey = System.fileContent( keyPath );
            }
        }
        else if ( args.https ) {
            const openSSL = new OpenSSL();

            console.info( 'Generating HTTPS signature' );

            try {
                const signature = await openSSL.getSignature();

                options.httpsKey = signature.key;
                options.httpsCert = signature.cert;
            }
            catch ( e ) {
                if ( e instanceof Error ) {
                    console.error( e );
                }
                else {
                    const result = e as ExecResult;

                    console.info( result.stdout );
                    console.error( result.stderr );
                    console.error( result.error );
                }
                process.exit( 1 );
            }
        }

        if ( args.typescript ) {
            options.typeScript = true;
        }

        const server = await Server.create( options );

        server.start();
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default CLI;
