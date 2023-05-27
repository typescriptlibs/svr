#!/usr/bin/env node

import CLI from '../lib/CLI.js';

CLI
    .run( process.argv.slice( 1 ) )
    .catch( error => {
        console.error( error.toString() );
        process.exit( 1 );
    } );
