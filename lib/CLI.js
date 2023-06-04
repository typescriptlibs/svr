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
import { Server } from './Server.js';
import System from './System.js';
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
    '  --help, -h           Prints this help text.',
    '',
    '  --http [port]        Activates HTTP port. Port number is optional.',
    '',
    '  --https [port]       Activates HTTPS port. Port number is optional.',
    '',
    '  --https-cert [file]  File path to the HTTPS certificate.',
    '',
    '  --https-key [file]   File path to the HTTPS key.',
    '',
    '  --root [folder]      Root folder with files for web browsers.',
    '',
    '  --timeout [seconds]  Stops the server after the given amount of seconds.',
    '',
    '  --typescript         Activates transpile of TypeScript files for missing',
    '                       JavaScript files.',
    '',
    '  --version, -v        Prints the version string.',
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
    static async run(argv) {
        return new CLI(argv, System).run();
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(argv, system) {
        this.args = System.args(argv);
        this.rootPath = (typeof this.args.root === 'string' ? this.args.root : './');
        this.system = system;
    }
    /* *
     *
     *  Functions
     *
     * */
    async run() {
        const args = this.args;
        const system = this.system;
        if (args.help || args.h) {
            console.info(HELP.join(system.EOL));
            return;
        }
        if (args.version || args.v) {
            console.info(VERSION);
            return;
        }
        if (args.timeout) {
            setTimeout(() => process.exit(), parseInt(args.timeout.toString(), 10) * 1000);
        }
        let rootPath = this.rootPath;
        if (!system.folderExists(rootPath)) {
            throw new Error(`Folder not found. (${rootPath})`);
        }
        const options = {
            rootPath
        };
        if (args.cgi) {
            options.cgiPath = (typeof args.cgi === 'string' ? args.cgi : 'cgi-bin');
        }
        if (args.http) {
            options.httpPort = parseInt(args.http.toString(), 10);
            if (isNaN(options.httpPort)) {
                options.httpPort = 0;
            }
        }
        if (args.https) {
            options.httpsPort = parseInt(args.https.toString(), 10);
            if (isNaN(options.httpsPort)) {
                options.httpsPort = 0;
            }
        }
        if (args['https-cert']) {
            const certPath = args['https-cert'].toString();
            if (System.fileExists(certPath)) {
                // set file content, not path (#1)
                options.httpsCert = System.fileContent(certPath);
            }
        }
        if (args['https-key']) {
            const keyPath = args['https-key'].toString();
            if (System.fileExists(keyPath)) {
                // set file content, not path (#1)
                options.httpsKey = System.fileContent(keyPath);
            }
        }
        if (args.typescript) {
            options.typeScript = true;
        }
        const server = await Server.create(options);
        server.start();
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default CLI;
