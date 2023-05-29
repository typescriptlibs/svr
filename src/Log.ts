/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/


/* *
 *
 *  Import
 *
 * */


import Server from './Server.js';


/* *
 *
 *  Class
 *
 * */


export class Log {



    /* *
     *
     *  Constructor
     *
     * */


    public constructor (
        server: Server
    ) {
        this.server = server;
    }


    /* *
     *
     *  Properties
     *
     * */


    public server: Server;


    /* *
     *
     *  Functions
     *
     * */


    protected dateString (): string {
        return new Date().toISOString();
    }


    public error ( error: unknown ): void {

        if ( error instanceof Error ) {
            this.info( error.name, error.message );
        }

        console.error( this.dateString(), `${error}` );
    }


    public info ( ...message: Array<unknown> ): void {
        console.info( this.dateString(), ...message );
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Log;
