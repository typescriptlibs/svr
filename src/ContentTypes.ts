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


import System from './System.js';


/* *
 *
 *  Constants
 *
 * */


const types: Record<string, string> = {
    _default: 'application/octet-stream',
    acc: 'audio/acc',
    cjs: 'application/javascript',
    css: 'text/css',
    gif: 'image/gif',
    htm: 'text/html',
    html: 'text/html',
    ico: 'image/vnd.microsoft.icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    json: 'application/json',
    m2a: 'audio/mpeg',
    m2v: 'video/mpeg',
    m4a: 'audio/mp4',
    m4v: 'video/mp4',
    mjs: 'application/javascript',
    mov: 'video/quicktime',
    mp2: 'application/mpeg',
    mp2a: 'audio/mpeg',
    mp2v: 'video/mpeg',
    mp3: 'audio/mpeg',
    mp4: 'application/mp4',
    mp4a: 'audio/mp4',
    mp4v: 'video/mp4',
    mpa: 'audio/mpeg',
    mpeg: 'application/mpeg',
    mpg: 'application/mpeg',
    oga: 'audio/ogg',
    ogg: 'audio/ogg',
    ogv: 'video/ogg',
    pdf: 'application/pdf',
    png: 'image/png',
    svg: 'image/svg+xml',
    txt: 'text/plain',
    wav: 'audio/wav',
    webm: 'video/webm',
    xml: 'text/xml',
    zip: 'application/zip'
};


/* *
 *
 *  Functions
 *
 * */


function getType (
    filePath: string
): string {
    return types[System.fileExtension( filePath )] || types._default;
}


/* *
 *
 *  Default Export
 *
 * */


const ContentTypes = {
    types,
    getType
}

export default ContentTypes;
