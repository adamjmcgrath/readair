////////////////////////////////////////////////////////////////////
// DLG.session
////////////////////////////////////////////////////////////////////

if (typeof DLG == "undefined") {var DLG = {};}

DLG.session = function(data) {
	this.sessionString = data;
}

////////////////////////////////////////////////////////////////////
// DLG.unreadcount Getters/Setters
////////////////////////////////////////////////////////////////////

DLG.session.prototype = {
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
		return "SID=" + this._id(this.sessionString);
	}
}