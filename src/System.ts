/*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*!*\

  SVR: Simple HTTP(S) Server

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

import * as ChildProcess from 'node:child_process';

import * as FS from 'node:fs';

import * as OS from 'node:os';

import * as Path from 'node:path';

import * as URL from 'node:url';

/* *
 *
 *  Constants
 *
 * */

const CWD = process.cwd();

const EOL = OS.EOL;

const PATH = joinPath( folderName( pathFromURL( import.meta.url ) ), '..' );

const VERSION = extractPackageVersion();

/* *
 *
 *  Functions
 *
 * */

function deleteFolder (
    path: string
): void {

    if ( !FS.existsSync( path ) ) {
        return;
    }

    for ( const file of filesFrom( path ) ) {
        FS.unlinkSync( joinPath( path, file ) );
    }

    for ( const folder of foldersFrom( path ) ) {
        FS.rmdirSync( joinPath( path, folder ) );
    }
}

function exec (
    command: string
): string {
    return ChildProcess.execSync( command, { encoding: 'utf8', timeout: 60000 } );
}

function extractPackageVersion (
    packagePath: string = joinPath( PATH, 'package.json' )
): string {
    const packageJSON = JSON.parse( FS.readFileSync( packagePath ).toString() );

    return ( packageJSON?.version || '0.0.0' );
}

function fileExists (
    filePath: string
): boolean {
    return (
        FS.existsSync( filePath ) &&
        FS.lstatSync( filePath ).isFile()
    );
}

function filesFrom (
    folderPath: string,
    positivePattern?: RegExp,
    negativePattern?: RegExp
): Array<string> {
    const items = FS.readdirSync( folderPath, { withFileTypes: true } ).sort();
    const files: Array<string> = [];

    let name: string;

    for ( const item of items ) {
        name = item.name;

        if ( item.isFile() ) {

            if (
                positivePattern &&
                !positivePattern.test( name ) ||
                negativePattern &&
                negativePattern.test( name )
            ) {
                continue;
            }

            files.push( name );

            continue;
        }

        for ( const file of filesFrom( joinPath( folderPath, name ) ) ) {
            files.push( joinPath( name, file ) );
        }
    }

    return files;
}

function folderExists (
    folderPath: string
): boolean {
    return (
        FS.existsSync( folderPath ) &&
        FS.lstatSync( folderPath ).isDirectory()
    );
}

function folderName (
    path: string
): string {
    return Path.dirname( path );
}

function foldersFrom (
    folderPath: string,
    positivePattern?: RegExp,
    negativePattern?: RegExp
): Array<string> {
    const items = FS.readdirSync( folderPath, { withFileTypes: true } ).sort();
    const folders: Array<string> = [];

    let name: string;

    for ( const item of items ) {
        name = item.name;

        if ( item.isDirectory() ) {

            if (
                positivePattern &&
                !positivePattern.test( name ) ||
                negativePattern &&
                negativePattern.test( name )
            ) {
                continue;
            }

            folders.push( name );

            for ( const folder of foldersFrom( joinPath( folderPath, name ) ) ) {
                folders.push( joinPath( name, folder ) );
            }
        }
    }

    return folders;
}

function joinPath (
    ...paths: Array<string>
): string {
    return Path.join( ...paths );
}

function pathFromURL (
    fileURL: string
): string {
    return URL.fileURLToPath( fileURL );
}

/* *
 *
 *  Default Export
 *
 * */

export const System = {
    CWD,
    EOL,
    PATH,
    VERSION,
    deleteFolder,
    exec,
    extractPackageVersion,
    fileExists,
    filesFrom,
    folderExists,
    folderName,
    joinPath,
    pathFromURL,
};

export default System;
