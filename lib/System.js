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
 *  Constants
 *
 * */
const CWD = process.cwd();
const EOL = OS.EOL;
const PATH = joinPath(folderName(pathFromURL(import.meta.url)), '..');
const SEPARATOR = Path.sep;
const VERSION = extractPackageVersion();
/* *
 *
 *  Functions
 *
 * */
function args(argv) {
    const args = {};
    for (let i = 0, iEnd = argv.length, key, value; i < iEnd; ++i) {
        value = argv[i];
        if (value[0] === '-') {
            key = value.substring(value.startsWith('--') ? 2 : 1) || '_';
            if (typeof args[key] === 'undefined') {
                args[key] = true;
            }
            continue;
        }
        if (!key) {
            key = '_';
        }
        switch (typeof args[key]) {
            case 'object':
                args[key].push(value);
                continue;
            case 'string':
                args[key] = [args[key], value];
                continue;
            default:
                args[key] = value;
        }
    }
    return args;
}
function deleteFolder(path) {
    if (!FS.existsSync(path)) {
        return;
    }
    for (const file of filesFrom(path)) {
        FS.unlinkSync(joinPath(path, file));
    }
    for (const folder of foldersFrom(path)) {
        FS.rmdirSync(joinPath(path, folder));
    }
}
async function exec(filePath, options) {
    return new Promise((resolve, reject) => {
        ChildProcess.execFile(filePath, [], {
            shell: true,
            timeout: 60000,
            ...options
        }, (error, stdout, stderr) => (error || stderr ? reject(error || stderr) : resolve(stdout)));
    });
}
function extractPackageVersion(packagePath = joinPath(PATH, 'package.json')) {
    const packageJSON = JSON.parse(FS.readFileSync(packagePath).toString());
    return ((packageJSON === null || packageJSON === void 0 ? void 0 : packageJSON.version) || '0.0.0');
}
function fileContent(filePath, followSymbolicLink) {
    return (FS.existsSync(filePath) &&
        (followSymbolicLink ? FS.lstatSync(filePath) : FS.statSync(filePath)).isFile() &&
        FS.readFileSync(filePath, 'utf-8')) || '';
}
function fileExists(filePath, followSymbolicLink) {
    return (FS.existsSync(filePath) &&
        (followSymbolicLink ? FS.lstatSync(filePath) : FS.statSync(filePath)).isFile());
}
function fileExtension(filePath) {
    const extension = Path.extname(filePath);
    return extension ? extension.substring(1) : '';
}
function filesFrom(folderPath, positivePattern, negativePattern) {
    const items = FS.readdirSync(folderPath, { withFileTypes: true }).sort();
    const files = [];
    let name;
    for (const item of items) {
        name = item.name;
        if (item.isFile()) {
            if (positivePattern &&
                !positivePattern.test(name) ||
                negativePattern &&
                    negativePattern.test(name)) {
                continue;
            }
            files.push(name);
            continue;
        }
        for (const file of filesFrom(joinPath(folderPath, name))) {
            files.push(joinPath(name, file));
        }
    }
    return files;
}
function fileSize(filePath, followSymbolicLink) {
    if (FS.existsSync(filePath)) {
        const stat = (followSymbolicLink ? FS.lstatSync(filePath) : FS.statSync(filePath));
        if (stat.isFile()) {
            return stat.size;
        }
    }
    return 0;
}
function folderExists(folderPath, followSymbolicLink) {
    return (FS.existsSync(folderPath) &&
        (followSymbolicLink ? FS.lstatSync(folderPath) : FS.statSync(folderPath)).isDirectory());
}
function folderName(path) {
    return Path.dirname(path);
}
function foldersFrom(folderPath, positivePattern, negativePattern) {
    const items = FS.readdirSync(folderPath, { withFileTypes: true }).sort();
    const folders = [];
    let name;
    for (const item of items) {
        name = item.name;
        if (item.isDirectory()) {
            if (positivePattern &&
                !positivePattern.test(name) ||
                negativePattern &&
                    negativePattern.test(name)) {
                continue;
            }
            folders.push(name);
            for (const folder of foldersFrom(joinPath(folderPath, name))) {
                folders.push(joinPath(name, folder));
            }
        }
    }
    return folders;
}
function joinPath(...paths) {
    return Path.join(...paths);
}
function pathFromURL(fileURL) {
    return URL.fileURLToPath(fileURL);
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
    filesFrom,
    fileSize,
    folderExists,
    folderName,
    joinPath,
    pathFromURL,
};
export default System;
