Svr: Simple HTTP(S) Server
==========================

This package provides a simple HTTP(S) server to deliver HTML, TypeScript, and
other files to web browsers.



[![CodeQL](https://github.com/typescriptlibs/svr/workflows/CodeQL/badge.svg)](https://github.com/typescriptlibs/svr/actions/workflows/codeql.yml)
[![Node.js](https://github.com/typescriptlibs/svr/workflows/Node.js/badge.svg)](https://github.com/typescriptlibs/svr/actions/workflows/node.js.yml)
[![NPM](https://img.shields.io/npm/v/@typescriptlibs/svr.svg)](https://www.npmjs.com/package/@typescriptlibs/svr)
[![License](https://img.shields.io/npm/l/@typescriptlibs/svr.svg)](https://github.com/typescriptlibs/svr/blob/main/LICENSE.md)



Examples
--------

- Start a HTTPS server with `html` folder as the website's root:

  ``` Shell
  npx svr --https --root html
  ```

- Start a HTTP server with log files:

  ``` Shell
  npx svr 1>> svr.log 2>> svr-error.log
  ```



Options
-------

All options are optional.

- `--cgi [path]`:       Activates CGI path for web browsers.

- `--http [port]`:      Activates HTTP port. Port number is optional.

- `--https [port]`:     Activates HTTPS port. Port number is optional. Without
                        httpsCert and httpsKey a sels-signed certificate will be
                        created instead (requires OpenSSL).

- `--httpsCert [file]`: File path to the HTTPS certificate.

- `--httpsKey [file]`:  File path to the HTTPS key.

- `--root [folder]`:    Root folder with files for web browsers.

- `--stop [seconds]`:   Stops the server after the given amount of seconds.



Redirect Output
---------------

The following patterns follow last.

- `1> [file]`:  Redirect request log to a file. Replaces an existing file.

- `1>> [file]`: Redirect request log to a file. Append to existing file.

- `2> [file]`:  Redirect error log to a file. Replaces an existing file.

- `2>> [file]`: Redirect error log to a file. Append to existing file.
