SVR: Simple HTTP(S) Server
==========================

This package provides a simple HTTP(S) server to deliver HTML, TypeScript, and
other files to web browsers.



[![CodeQL](https://github.com/typescriptlibs/svr/workflows/CodeQL/badge.svg)](https://github.com/typescriptlibs/svr/actions/workflows/codeql.yml)
[![Node.js](https://github.com/typescriptlibs/svr/workflows/Node.js/badge.svg)](https://github.com/typescriptlibs/svr/actions/workflows/node.js.yml)
[![npm](https://img.shields.io/npm/v/@typescriptlibs/svr.svg)](https://www.npmjs.com/package/@typescriptlibs/svr)
[![license](https://img.shields.io/npm/l/@typescriptlibs/svr.svg)](https://github.com/typescriptlibs/svr/blob/main/LICENSE.md)



Examples
--------

``` Shell
cd html
npx svr
```

*or*

``` Shell
npx svr --root html
```



Options
-------

- `--cgi [path]`: Activates CGI path for web browsers.

- `--http [port]`: Activates HTTP port. Port number is optional.

- `--https [port]`: Activates HTTPS port. Port number is optional.

- `--https-cert [file]`: File path to the HTTPS certificate.

- `--https-key [file]`: File path to the HTTPS key.

- `--root [folder]`: Root folder with files for web browsers.

- `--timeout [seconds]`: Stops the server after the given amount of seconds.
