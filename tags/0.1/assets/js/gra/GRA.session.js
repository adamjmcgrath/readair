////////////////////////////////////////////////////////////////////
// GRA.session
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.session = function(thePayload) {
	this.sessionString = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.unreadcount Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.session.prototype = {
    _sessionObj: function(theString) {
		var theArray = theString.split("\n");
		var theObj = new Object();
		for (var i=0; i < theArray.length; i++) {
			var kvp = theArray[i].split("=");
			theObj[kvp[0]] = kvp[1];
		};
		return theObj;
	},
	_id: function(theString) {
		var sessionObj = this._sessionObj(theString);
		return sessionObj["SID"];
	},
	cookie: function() {
		var cookie = new Object();
		cookie['Cookie'] = "SID=" + this._id(this.sessionString);
		return cookie;
	}
}