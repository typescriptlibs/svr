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


import * as Path from 'node:path';

import Server from './Server.js';

import System from './System.js';


/* *
 *
 *  Class
 *
 * */


export class CLI {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        argv: Array<string>,
        system: typeof System
    ) {
        this.argv = argv;
        this.source = argv[argv.length - 1];
        this.system = system;

        if (
            this.source.startsWith( '-' ) ||
            this.source.endsWith( 'svr.mjs' )
        ) {
            this.source = './';
        }
    }


    /* *
     *
     *  Properties
     *
     * */


    public readonly argv: Array<string>;

    public readonly source: string;

    public readonly system: typeof System;


    /* *
     *
     *  Functions
     *
     * */


    public async run (): Promise<void> {
        const argv = this.argv;
        const system = this.system;

        if (
            argv.includes( '-h' ) ||
            argv.includes( '--help' )
        ) {
            console.info( CLI.HELP.join( system.EOL ) );
            return;
        }

        if (
            argv.includes( '-v' ) ||
            argv.includes( '--version' )
        ) {
            console.info( CLI.VERSION );
            return;
        }

        let source = this.source;

        if ( !system.folderExists( source ) ) {
            throw new Error( `Folder not found. (${source})` );
        }

        const server = new Server();

    }
}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace CLI {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Args extends Partial<Record<string, ( boolean | string )>> {
        help?: boolean;
        source?: string;
        version?: boolean;
    }

    /* *
     *
     *  Constants
     *
     * */

    export const VERSION = `Version ${System.extractPackageVersion()}`;

    export const HELP = [
        `SVR: Simple HTTP(S) Server - ${VERSION}`,
        '',
        `svr [options] [source]`,
        '',
        'ARGUMENTS:',
        '',
        '  [options]  Optional flags explained in the section below.',
        '',
        '  [source]   File folder for web browsers.',
        '',
        'OPTIONS:',
        '',
        '  --help, -h     Prints this help text.',
        '',
        '  --timeout, -t  Stops the server after the give time in seconds.',
        '',
        '  --version, -v  Prints the version string.',
        '',
        'EXAMPLES:',
        '',
        '  svr html/',
        '  Starts the server and delivers files in the "html" folder to web browsers.',
    ];

    /* *
     *
     *  Functions
     *
     * */

    export async function run (
        argv: Array<string>
    ): Promise<void> {
        return new CLI( argv, System ).run();
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default CLI;
