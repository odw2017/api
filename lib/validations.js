const async = require( "async" );
const Joi = require( "joi" );

module.exports = {
	v1: {
		slackInvite: {
			"body": Joi.object( ).keys( {
				"email": Joi.string( ).email( ).required( )
			} ).required( )
		},
		expressify: function( validationObj ){
			return function( req, res, cb ){
				async.each( Object.keys( validationObj ), function( validationKey, cb ){
					Joi.validate( req[validationKey], validationObj[validationKey], function( err, result ){
						if( err ){ return cb( err ); }
						req[validationKey] = result;
						return cb( null );
					} );
				}, cb );
			}
		}
	}
};
