const express = require( "express" );
const expressRateLimit = require( "express-rate-limit" );

const async = require( "async" );
const request = require( "request" );

const bodyParser = require( "body-parser" );

const validations = require( "./validations" ).v1;

const config = require( "config" );

const Main = express.Router( );

Main.use( bodyParser.json( { strict: true } ) );

const slackLimiter = new expressRateLimit( {
	windowMs: 5*60*1000, // 5 minutes
	max: 10, // 10 requests.
	delayMs: 0
} );

Main.use( "/slack", slackLimiter );

Main.post( "/slack/invite", validations.expressify( validations.slackInvite ), function( req, res, cb ){
	async.waterfall( [ function( cb ){

		// If we're testing, just skip and pretend that we made
		// the call to slack.
		if( config.testing ){ return cb( null ); }

		
		console.log( "Got here; I have req.body.email of " );
		console.log( req.body.email );

		return cb( null );
	} ], function( err, result ){
		if( err ){ return cb( err ); }
		return res.json( { "invited": true } );
	} );
} );

Main.use( function( err, req, res, cb ){

	// Theoretically do something with the error; I don't care
	// right now though.

	if( err.isJoi ){
		return res.status( 400 ).json( { "error": "validation_error" } );
	}

	res.status( 500 ).json( { "error": "unknown_error" } );
} );

module.exports = Main;
