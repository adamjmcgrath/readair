////////////////////////////////////////////////////////////////////
// GRA.login
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.login = function(theEmail,thePassword,saveDetails) {
	this.email = theEmail;
	this.passwd = thePassword;
	this.saveDetails = saveDetails;
}

////////////////////////////////////////////////////////////////////
// GRA.login Methods
////////////////////////////////////////////////////////////////////

GRA.login.prototype = {
	
	getEmail: function() {
		return this.email;
	},
	
	getPasswd: function() {
		return this.passwd;
	},
	
	saveLogin: function() {
		return this.saveDetails;
	},
	
	data: function() {
		var theData = GRA.cons.LOGIN_DATA();
		theData['Email'] = this.email;
		theData['Passwd'] = this.passwd;
		return theData;
	}
	
}

