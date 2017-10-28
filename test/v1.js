const versionOne = require( "../lib/v1" );
const config = require( "config" );
const express = require( "express" );
const request = require( "request" );
const assert = require( "assert" );

describe( "Version 1", function( ){
	let _app;
	let _listen;
	before( function( cb ){
		_app = express( );
		_app.use( versionOne );
		_listen = _app.listen( config.port, cb );
	} );

	after( function( cb ){
		_listen.close( cb );
	} );

	const _buildUrl = function( path ){
		return "http://localhost:" + config.port + path;
	};

	describe( "Slack", function( ){
		describe( "Invite", function( ){
			it( "Fails if we don't specify the right data", function( cb ){
				request( {
					url: _buildUrl( "/slack/invite" ),
					method: "POST",
					json: true,
					body: {
						"foo": "bar"
					}
				}, function( err, response, body ){
					if( err ){ return cb( err ); }
					assert.equal( response.statusCode, 400 );
					assert.ok( body.error == "validation_error" );
					return cb( null );
				} );
			} );

			it( "Works if we specify an email address", function( cb ){
				request( {
					url: _buildUrl( "/slack/invite" ),
					method: "POST",
					json: true,
					body: {
						email: "robert+test@keizer.ca"
					}
				}, function( err, response, body ){
					if( err ){ return cb( err ); }
					assert.equal( response.statusCode, 200 );
					assert.ok( body.invited == true );
					return cb( null );
				} );
			} );
		} );
	} );
} );
