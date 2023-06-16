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


import test from '@typescriptlibs/tst';


/* *
 *
 *  Tests
 *
 * */


test( 'Test CGIHandler body', async ( assert: test.Assert ) => {
    const response = await fetch( 'https://localhost:9876/cgi-bin/test.sh' );

    assert.strictEqual(
        response.headers.get( 'Content-Type' ),
        'image/svg+xml; charset=utf-8',
        'Header of CGI response should contain SVG content type and UTF-8.'
    );

    assert.strictEqual(
        await response.text(),
        '<svg xmlns="http://www.w3.org/2000/svg"><text y="16">🤓</text></svg>\n',
        'Body of CGI response should contain SVG image with UTF-8 emoji.'
    );
} );
