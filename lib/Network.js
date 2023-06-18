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
import Net from 'node:net';
/* *
 *
 *  Functions
 *
 * */
function connect(port, host) {
    return new Promise((resolve, reject) => {
        try {
            Net.connect(port, host)
                .once('error', reject)
                .once('ready', resolve);
        }
        catch (e) {
            reject(e);
        }
    });
}
async function freePort(firstPort = 1000, lastPort = 65536, host) {
    for (let port = firstPort; port < lastPort; ++port) {
        try {
            (await connect(port, host)).end();
        }
        catch (e) {
            if (e.code === 'ECONNREFUSED') {
                return port;
            }
        }
    }
    throw new Error('No free port found');
}
async function usedPort(port, host) {
    try {
        (await connect(port, host)).end();
    }
    catch (e) {
        if (e.code === 'ECONNREFUSED') {
            return false;
        }
    }
    return true;
}
/* *
 *
 *  Default Export
 *
 * */
export const Network = {
    connect,
    freePort,
    usedPort,
};
export default Network;
