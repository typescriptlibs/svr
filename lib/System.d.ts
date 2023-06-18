/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  Svr: Simple HTTP(S) Server

  Copyright (c) TypeScriptLibs and Contributors

  Licensed under the MIT License; you may not use this file except in
  compliance with the License. You may obtain a copy of the MIT License at
  https://typescriptlibs.org/LICENSE.txt

\*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*i*/
/// <reference types="node" resolution-mode="require"/>
import ChildProcess from 'node:child_process';
export type ExecOptions = ChildProcess.ExecFileSyncOptions;
export interface ExecResult {
    error?: ChildProcess.ExecFileException;
    stderr: string;
    stdin?: (ArrayBufferView | string);
    stdout: string;
}
export interface Permission {
    mode: number;
    r: boolean;
    w: boolean;
    x: boolean;
}
export interface Permissions {
    group: Permission;
    other: Permission;
    owner: Permission;
}
declare function args(argv: Array<string>): Record<string, (boolean | string | Array<string>)>;
declare function deleteFolder(path: string): void;
declare function exec(filePath: string, args?: Array<string>, options?: ExecOptions, fullResult?: boolean): Promise<string>;
declare function exec(filePath: string, args: (Array<string> | undefined), options: (ExecOptions | undefined), fullResult: true): Promise<ExecResult>;
declare function extractPackageVersion(packagePath?: string): string;
declare function fileContent(filePath: string, followSymbolicLink?: boolean): string;
declare function fileExists(filePath: string, followSymbolicLink?: boolean): boolean;
declare function fileExtension(filePath: string): string;
declare function fileName(filePath: string): string;
declare function filesFrom(folderPath: string, positivePattern?: RegExp, negativePattern?: RegExp): Array<string>;
declare function fileSize(filePath: string, followSymbolicLink?: boolean): number;
declare function folderExists(folderPath: string, followSymbolicLink?: boolean): boolean;
declare function folderName(path: string): string;
declare function joinPath(...paths: Array<string>): string;
declare function pathFromURL(fileURL: string): string;
declare function permissions(path: string, followSymbolicLink?: boolean): Permissions;
declare function temporaryFolder(): Promise<string>;
export declare const System: {
    CWD: string;
    EOL: string;
    PATH: string;
    PID: number;
    SEPARATOR: string;
    PACKAGE_VERSION: string;
    args: typeof args;
    deleteFolder: typeof deleteFolder;
    exec: typeof exec;
    extractPackageVersion: typeof extractPackageVersion;
    fileContent: typeof fileContent;
    fileExists: typeof fileExists;
    fileExtension: typeof fileExtension;
    fileName: typeof fileName;
    filesFrom: typeof filesFrom;
    fileSize: typeof fileSize;
    folderExists: typeof folderExists;
    folderName: typeof folderName;
    joinPath: typeof joinPath;
    pathFromURL: typeof pathFromURL;
    permissions: typeof permissions;
    temporaryFolder: typeof temporaryFolder;
};
export default System;
