// /////////////////////////////////////////////////
// LIB.ajax
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.ajax = {
	getRequest: function(theURL,theCallback,isAsync) {
		var theRequest = new XMLHttpRequest();
		theRequest.onreadystatechange = function() {
			if (this.readyState == 4) {
				theCallback(this);
			} else {
				// loading...
			}
		};
		var isSync;
		isAsync ? isSync = false : isSync = true;
		theRequest.open("GET",theURL,isSync);
		theRequest.send();
	},
	postRequest: function(theURL,theData,theCallback,theContext) {
		var theRequest = new XMLHttpRequest();
		theRequest.onreadystatechange = function() {
			if (this.readyState == 4) {
				theCallback.call(theContext, this);
			} else {
				// loading...
			}
		};
		var theParams = LIB.string.serializeAArray(theData);
		theRequest.open("POST",theURL);
		theRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		theRequest.send(theParams);
	}
}