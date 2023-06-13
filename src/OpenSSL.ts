/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/


/* *
 *
 *  Default Export
 *
 * */


import System from './System.js';


/* *
 *
 *  Declarations
 *
 * */


export interface OpenSSLSignature {
    key: string;
    cert: string;
}

export interface OpenSSLOptions {
    country: string;
    division: string;
    organisation: string;
    state: string;
    city: string;
}


/* *
 *
 *  Constants
 *
 * */


const CERT_PATTERN = /-----BEGIN CERTIFICATE-----[\s\w=+\/]+-----END CERTIFICATE-----/gs;

const KEY_PATTERN = /-----BEGIN PRIVATE KEY-----[\s\w=+\/]+-----END PRIVATE KEY-----/gs;


/* *
 *
 *  Class
 *
 * */

export class OpenSSL {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor (
        options: Partial<OpenSSLOptions> = {}
    ) {
        this.options = {
            city: 'Brussels',
            country: 'EU',
            division: 'SVR',
            organisation: 'TypeScriptLibs',
            state: 'Belgium',
            ...options
        };
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: OpenSSLOptions;

    private signature?: OpenSSLSignature;

    /* *
     *
     *  Functions
     *
     * */

    public async getSignature (
        domain: string = 'localhost'
    ): Promise<OpenSSLSignature> {

        if ( this.signature ) {
            return this.signature;
        }

        const options = this.options;
        const subject = [
            '',
            `C=${options.country}`,
            `CN=${domain}`,
            `L=${options.city}`,
            `O=${options.organisation}`,
            `OU=${options.division}`
        ];

        const signature = await System.exec(
            'openssl',
            [
                'req',
                '-days', '365',
                '-newkey', 'rsa:4096',
                '-nodes',
                '-subj', subject.join( '/' ),
                '-x509',
            ],
            {}
        );

        const signatureCert = signature.match( CERT_PATTERN );
        const signatureKey = signature.match( KEY_PATTERN );

        if ( !signatureCert || !signatureKey ) {
            throw new Error( 'OpenSSL self-signed process failed.' );
        }

        return {
            key: signatureKey[0],
            cert: signatureCert[0]
        };
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default OpenSSL;
