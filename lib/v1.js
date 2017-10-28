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

		// Yes I'm using a legacy slack api, because I'm lazy
		// and found this url that works.
		request( {
			url: "https://" + config.slack.teamName + ".slack.com/api/users.admin.invite?t=" + new Date( ).getTime( ),
			method: "POST",
			form: {
				token: config.slack.token,
				email: req.body.email,
				set_active: true
			}
		}, function( err, response, body ){
			if( err ){ return cb( err ); }

			try{
				const _obj = JSON.parse( body );

				// Should get an { ok: true } back.
				// or an already inivted error, which is also fine.
				if( !_obj.ok && !(_obj.error == "already_invited" ) ){ return cb( _obj ); }
				return cb( null );
			}catch( err ){
				return cb( err );
			}
		} );

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
