////////////////////////////////////////////////////////////////////
// GRA.token
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.token = function(thePayload) {
	this.tokenString = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.token Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.token.prototype = {
	getToken: function() {
		return this.tokenString;
	},
	setToken: function(theString) {
		this.tokenString = theString;
	}
}