/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/// <reference types="node" resolution-mode="require"/>
import Net from 'node:net';
export interface NetworkError extends Error {
    address: string;
    code: string;
    errno: number;
    port: number;
    syscall: string;
}
export type NetworkSocket = Net.Socket;
declare function connect(port: number, host?: string): Promise<Net.Socket>;
declare function freePort(firstPort?: number, lastPort?: number, host?: string): Promise<number>;
declare function usedPort(port: number, host?: string): Promise<boolean>;
export declare const Network: {
    connect: typeof connect;
    freePort: typeof freePort;
    usedPort: typeof usedPort;
};
export default Network;
