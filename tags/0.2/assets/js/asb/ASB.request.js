////////////////////////////////////////////////////////////////////
// ASB.request
////////////////////////////////////////////////////////////////////

if (typeof ASB == "undefined") {var ASB = {};}

(function() {
	if(!window.ASB.request) { window["ASB"]["request"] = {} }

	function getRequest(theURL,theCallback,theSID) {
		var loader = new air.URLLoader();
		var request = new air.URLRequest(theURL);
		var data = new air.URLVariables();
		request.method = "GET";
		request.requestHeaders = new Array(new air.URLRequestHeader("Cookie", "SID=" + theSID));
		request.manageCookies = false;
		loader.addEventListener(air.Event.COMPLETE, function(e) {
			callbackHandler(e.target.data);
		});
		loader.load(request);
	}

	window["ASB"]["request"]["getRequest"] = getRequest;

})()