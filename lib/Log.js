/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
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
    constructor(server) {
        this.server = server;
    }
    /* *
     *
     *  Functions
     *
     * */
    dateString() {
        return new Date().toISOString();
    }
    error(error) {
        if (error instanceof Error) {
            this.info(error.name, error.message);
        }
        console.error(this.dateString(), `${error}`);
    }
    info(...message) {
        console.info(this.dateString(), ...message);
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Log;
