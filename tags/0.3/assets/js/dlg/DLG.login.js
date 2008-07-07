////////////////////////////////////////////////////////////////////
// DLG.login
////////////////////////////////////////////////////////////////////

if (typeof DLG == "undefined") {var DLG = {};}

DLG.login = function(email,password) {
	this.email = email;
	this.passwd = password;
}

////////////////////////////////////////////////////////////////////
// DLG.login Methods
////////////////////////////////////////////////////////////////////

DLG.login.prototype = {
	
	getEmail: function() {
		return this.email;
	},
	
	getPasswd: function() {
		return this.passwd;
	},

	data: function() {
		return {
			service: "reader",
			source: "ReadAir",
			'continue': "http://www.google.com/",
			Email: this.email,
			Passwd: this.passwd
		}
	}
	
}

