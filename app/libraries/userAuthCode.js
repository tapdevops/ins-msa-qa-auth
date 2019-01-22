module.exports.generate = function( value ) {
	var up_value = value + 1;
	var user_auth_code = '000' + String( up_value );

	if ( String( up_value ).length == 1 ) {
		user_auth_code = '000' + String( up_value );
	}
	else if ( String( up_value ).length == 2 ) {
		user_auth_code = '00' + String( up_value );
	}
	else if ( String( up_value ).length == 3 ) {
		user_auth_code = '0' + String( up_value );
	}
	else if ( String( up_value ).length == 4 ) {
		user_auth_code = String( up_value );
	}
	else if ( String( up_value ).length > 4 ) {
		user_auth_code = String( up_value );
	}

	return String( user_auth_code );
}