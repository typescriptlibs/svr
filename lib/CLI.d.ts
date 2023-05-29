/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
import System from './System.js';
export declare const VERSION: string;
export declare const HELP: string[];
export declare class CLI {
    static run(argv: Array<string>): Promise<void>;
    constructor(argv: Array<string>, system: typeof System);
    readonly args: Record<string, (boolean | string | Array<string>)>;
    readonly rootPath: string;
    readonly system: typeof System;
    run(): Promise<void>;
}
export default CLI;
