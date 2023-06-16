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
    cert: string;
    key: string;
}

export interface OpenSSLOptions {
    country?: string;
    division?: string;
    organisation?: string;
    state?: string;
    city?: string;
}


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
            division: 'SVR',
            organisation: 'TypeScriptLibs',
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
            `CN=${domain}`,
        ];

        if ( options.country ) {
            subject.push( `C=${options.country}` );
        }

        if ( options.city ) {
            subject.push( `L=${options.city}` );
        }

        if ( options.organisation ) {
            subject.push( `O=${options.organisation}` );
        }

        if ( options.division ) {
            subject.push( `OU=${options.division}` );
        }

        // @todo Not compatible with common implementations yet.
        // const subjectAltNames = [
        //     `DNS:${domain}`,
        //     'IP:::1',
        //     'IP:127.0.0.1'
        // ];

        const version = parseInt( await System.exec( 'openssl', ['version'] ) );
        const temporaryFolder = await System.temporaryFolder();
        const keyFile = System.joinPath( temporaryFolder, 'key.pem' );
        const certFile = System.joinPath( temporaryFolder, 'crt.pem' );
        await System.exec( 'openssl', [
            'req',
            // @todo Not compatible with common implementations yet.
            // '-addext', `subjectAltName=${subjectAltNames.join( ',' )}`,
            '-days', '365',
            '-new',
            '-keyform', 'PEM',
            '-keyout', keyFile,
            '-newkey', 'rsa:4096',
            ( version > 2 ? '-noenc' : '-nodes' ),
            '-out', certFile,
            '-outform', 'PEM',
            '-subj', subject.join( '/' ),
            '-utf8',
            '-x509',
        ] );

        const cert = await System.fileContent( certFile );
        const key = await System.fileContent( keyFile );

        await System.deleteFolder( temporaryFolder );

        if ( !cert || !key ) {
            throw new Error( 'OpenSSL self-signed process failed.' );
        }

        return {
            cert,
            key
        };
    }

}


/* *
 *
 *  Default Export
 *
 * */


export default OpenSSL;
