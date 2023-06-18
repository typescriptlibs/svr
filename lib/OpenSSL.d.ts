/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
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
export declare class OpenSSL {
    constructor(options?: Partial<OpenSSLOptions>);
    readonly options: OpenSSLOptions;
    private signature?;
    getSignature(domain?: string): Promise<OpenSSLSignature>;
}
export default OpenSSL;
