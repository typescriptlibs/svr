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
 *  Declarations
 *
 * */


export interface NetworkError extends Error {
    address: string;
    code: string;
    errno: number;
    port: number;
    syscall: string;
}


export type NetworkSocket = Net.Socket;


/* *
 *
 *  Functions
 *
 * */


function connect (
    port: number,
    host?: string
): Promise<Net.Socket> {
    return new Promise( ( resolve, reject ) => {
        try {
            Net.connect( port, host )
                .once( 'error', reject )
                .once( 'ready', resolve )
        }
        catch ( e ) {
            reject( e );
        }
    } );
}


async function freePort (
    firstPort = 1000,
    lastPort = 65536,
    host?: string
): Promise<number> {

    for ( let port = firstPort; port < lastPort; ++port ) {
        try {
            ( await connect( port, host ) ).end();
        }
        catch ( e ) {
            if ( ( e as NetworkError ).code === 'ECONNREFUSED' ) {
                return port;
            }
        }
    }

    throw new Error( 'No free port found' );
}


async function usedPort (
    port: number,
    host?: string
): Promise<boolean> {

    try {
        ( await connect( port, host ) ).end();
    }
    catch ( e ) {
        if ( ( e as NetworkError ).code === 'ECONNREFUSED' ) {
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
