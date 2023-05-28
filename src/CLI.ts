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


import Server from './Server.js';

import System from './System.js';


/* *
 *
 *  Constants
 *
 * */


export const VERSION = `Version ${System.extractPackageVersion()}`;

export const HELP = [
    `SVR: Simple HTTP(S) Server - ${VERSION}`,
    '',
    `svr [options]`,
    '',
    'OPTIONS:',
    '',
    '  --cgi [path]         Activates CGI path for web browsers.',
    '',
    '  --help, -h           Prints this help text.',
    '',
    '  --http [port]        Activates HTTP port.',
    '                       (Default: random number >= 1000)',
    '',
    '  --https [port]       Activates HTTPS port.',
    '',
    '  --httpsCert [file]   File path to the HTTPS certificate.',
    '',
    '  --httpsKey [file]    File path to the HTTPS key.',
    '',
    '  --root [folder]      Root folder with files for web browsers.',
    '                       (Default: "./")',
    '',
    '  --timeout [seconds]  Stops the server after the given amount of seconds.',
    '',
    '  --version, -v        Prints the version string.',
    '',
    'EXAMPLES:',
    '',
    '  svr --root html/',
    '  Starts the server and delivers files in the "html" folder to web browsers.',
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

        const server = new Server();

        server.start();
    }
}


/* *
 *
 *  Default Export
 *
 * */


export default CLI;
