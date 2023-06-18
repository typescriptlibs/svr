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


test( 'Test FileHandler dot-files', async ( assert: test.Assert ) => {
    const response = await fetch( 'https://localhost:9876/.hidden' );

    assert.strictEqual(
        response.headers.get( 'Content-Type' ),
        'text/html; charset=utf-8',
        'Response header should contain HTML content type and UTF-8.'
    );

    assert.strictEqual(
        response.status,
        403,
        'HTTP status should not reveal file existence.'
    );
} );
