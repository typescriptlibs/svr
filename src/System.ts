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


import ChildProcess from 'node:child_process';

import FS from 'node:fs';

import OS from 'node:os';

import Path from 'node:path';

import URL from 'node:url';


/* *
 *
 *  Declarations
 *
 * */


export type ExecOptions = ChildProcess.ExecFileSyncOptions;


/* *
 *
 *  Constants
 *
 * */


const CWD = process.cwd();

const EOL = OS.EOL;

const PATH = joinPath( folderName( pathFromURL( import.meta.url ) ), '..' );

const SEPARATOR = Path.sep;

const VERSION = extractPackageVersion();


/* *
 *
 *  Functions
 *
 * */


function args (
    argv: Array<string>
): Record<string, ( boolean | string | Array<string> )> {
    const args: Record<string, ( boolean | string | Array<string> )> = {};

    for (
        let i = 0,
        iEnd = argv.length,
        key: ( string | undefined ),
        value: string;
        i < iEnd;
        ++i
    ) {
        value = argv[i];

        if ( value[0] === '-' ) {
            key = value.substring( value.startsWith( '--' ) ? 2 : 1 ) || '_';

            if ( typeof args[key] === 'undefined' ) {
                args[key] = true;
            }

            continue;
        }

        if ( !key ) {
            key = '_';
        }

        switch ( typeof args[key] ) {
            case 'object':
                ( args[key] as Array<string> ).push( value );
                continue;
            case 'string':
                args[key] = [args[key] as string, value];
                continue;
            default:
                args[key] = value;
        }
    }

    return args;
}


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


async function exec (
    filePath: string,
    args: Array<string> = [],
    options?: ExecOptions,
    stdin?: ( string | Buffer )
): Promise<string> {
    return new Promise( ( resolve, reject ) => {
        const process = ChildProcess.execFile(
            filePath,
            args,
            {
                shell: true,
                timeout: 60000,
                ...options
            },
            ( error, stdout, stderr ) => ( error ? reject( error ) : resolve( stdout || stderr ) )
        );
        process.stdin?.end( stdin );
    } );
}


function extractPackageVersion (
    packagePath: string = joinPath( PATH, 'package.json' )
): string {
    const packageJSON = JSON.parse( FS.readFileSync( packagePath ).toString() );

    return ( packageJSON?.version || '0.0.0' );
}


function fileContent (
    filePath: string,
    followSymbolicLink?: boolean
): string {
    return (
        FS.existsSync( filePath ) &&
        ( followSymbolicLink ? FS.lstatSync( filePath ) : FS.statSync( filePath ) ).isFile() &&
        FS.readFileSync( filePath, 'utf-8' )
    ) || '';
}


function fileExists (
    filePath: string,
    followSymbolicLink?: boolean
): boolean {
    return (
        FS.existsSync( filePath ) &&
        ( followSymbolicLink ? FS.lstatSync( filePath ) : FS.statSync( filePath ) ).isFile()
    );
}


function fileExtension (
    filePath: string
): string {
    const extension = Path.extname( filePath );

    return extension ? extension.substring( 1 ) : '';
}


function fileName (
    filePath: string
): string {
    return Path.basename( filePath );
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


function fileSize (
    filePath: string,
    followSymbolicLink?: boolean
): number {
    if ( FS.existsSync( filePath ) ) {
        const stat = ( followSymbolicLink ? FS.lstatSync( filePath ) : FS.statSync( filePath ) );

        if ( stat.isFile() ) {
            return stat.size;
        }
    }

    return 0;
}

function folderExists (
    folderPath: string,
    followSymbolicLink?: boolean
): boolean {
    return (
        FS.existsSync( folderPath ) &&
        ( followSymbolicLink ? FS.lstatSync( folderPath ) : FS.statSync( folderPath ) ).isDirectory()
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
    SEPARATOR,
    VERSION,
    args,
    deleteFolder,
    exec,
    extractPackageVersion,
    fileContent,
    fileExists,
    fileExtension,
    fileName,
    filesFrom,
    fileSize,
    folderExists,
    folderName,
    joinPath,
    pathFromURL,
};

export default System;
