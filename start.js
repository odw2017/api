const config = require( "config" );
const versionOne = require( "./lib/v1" );

const express = require( "express" );

const app = express( );
app.use( "/v1", versionOne );

app.use( "/", function( req, res, cb ){
	res.redirect( "https://odw2017.ca" );
} );

app.use( function( err, req, res, cb ){
	console.log( err );
	res.status( 500 ).json( { "error": "unknown_error" } );
} );

app.listen( config.port );
