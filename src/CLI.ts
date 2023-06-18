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


import Log from './Log.js';

import Network from './Network.js';

import OpenSSL from './OpenSSL.js';

import { Server, ServerOptions } from './Server.js';

import System, { ExecResult } from './System.js';


/* *
 *
 *  Constants
 *
 * */


export const VERSION = `Version ${System.PACKAGE_VERSION}`;

export const HELP = [
    `Svr: Simple HTTP(S) Server - ${VERSION}`,
    '',
    `svr [options]`,
    '',
    'OPTIONS:',
    '',
    '  --cgi [path]        Activates CGI path for web browsers.',
    '',
    '  --help, -h          Prints only this help text.',
    '',
    '  --http [port]       Activates HTTP port. Port number is optional.',
    '',
    '  --https [port]      Activates HTTPS port. Port number is optional. Without',
    '                      httpsCert and httpsKey a sels-signed certificate will be',
    '                      created instead (requires OpenSSL).',
    '',
    '  --httpsCert [file]  File path to the HTTPS certificate.',
    '',
    '  --httpsKey [file]   File path to the HTTPS key.',
    '',
    '  --root [folder]     Root folder with files for web browsers.',
    '',
    '  --stop [seconds]    Stops the server after the given amount of seconds.',
    '',
    '  --ts                Activates transpiling of TypeScript files for missing',
    '                      JavaScript files.',
    '',
    '  --version, -v       Prints only the version string.',
    '',
    'EXAMPLES:',
    '',
    '  npx svr',
    '  Starts the HTTP server and delivers files from the current folder to web',
    '  browsers.',
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

        process.on( 'SIGQUIT', Log.error );
        process.on( 'SIGTERM', Log.error );

        return new CLI( argv )
            .run()
            .catch( () => process.exit( 1 ) );
    }


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        argv: Array<string>
    ) {
        this.args = System.args( argv );
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly args: Record<string, ( boolean | string | Array<string> )>;

    public server?: Server;


    /* *
     *
     *  Functions
     *
     * */


    public async run (): Promise<void> {
        const args = this.args;

        // Parse CLI arguments

        if ( args.help || args.h ) {
            console.info( HELP.join( System.EOL ) );
            return;
        }

        if ( args.version || args.v ) {
            console.info( VERSION );
            return;
        }

        if ( args.stop ) {
            const seconds = parseInt( `${args.stop}`, 10 );
            setTimeout(
                () => {
                    Log.error( `Stop after ${seconds} seconds`, undefined, 'CLI.run' );
                    process.exit();
                },
                seconds * 1000
            );
        }

        const options: ServerOptions = {
            rootPath: './'
        };

        if ( args.cgi ) {
            options.cgiPath = ( typeof args.cgi === 'string' ? args.cgi : 'cgi-bin' );
        }

        if ( args.http || !args.https ) {
            options.httpPort = parseInt( `${args.http}`, 10 );
        }

        if ( args.https ) {
            options.httpsPort = parseInt( `${args.https}`, 10 );
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

        if ( typeof args.root === 'string' ) {
            options.rootPath = args.root;
        }

        if ( args.typescript ) {
            options.ts = true;
        }

        // Validate options

        if (
            options.rootPath &&
            !System.folderExists( options.rootPath )
        ) {
            Log.error( `Folder not found: ${options.rootPath}` );
            process.exit( 1 );
        }

        if (
            typeof options.httpPort === 'number' &&
            isNaN( options.httpPort )
        ) {
            options.httpPort = await ( Network.freePort( 8000 ) );
        }

        if ( typeof options.httpsPort === 'number' ) {
            if ( isNaN( options.httpsPort ) ) {
                options.httpsPort = await ( Network.freePort( 8080 ) );
            }

            if (
                !options.httpsCert ||
                !options.httpsKey
            ) {
                const openSSL = new OpenSSL();

                Log.error( 'Generating HTTPS signature' );

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
        }

        // Start server

        this.server = await Server.create( options );

        await this.server.start();
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default CLI;
