/*
LIB.httpr
Handles the Get/Post Requests
*/

if (typeof LIB == "undefined") {var LIB = {};}

(function() {
	
	if(!window.LIB.httpr) { window["LIB"]["httpr"] = {} }

	function getRequest(url,callback,cookie) {
		var loader = new air.URLLoader();
		var request = new air.URLRequest(url);
		request.method = "GET";
		if (cookie) {
			request.requestHeaders = new Array();
			request.requestHeaders.push(new air.URLRequestHeader("Cookie", cookie));
		}
		request.manageCookies = false;
		loader.addEventListener(air.Event.COMPLETE, callback);
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, ioError);
		loader.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, httpStatus);
		loader.addEventListener(air.ProgressEvent.PROGRESS, progress);
		loader.load(request);
	}

	function postRequest(url,callback,data,cookie) {
		var loader = new air.URLLoader();
		var request = new air.URLRequest(url);
		if (data) {
			var variables = new air.URLVariables();
			for (var prop in data) {
				if (LIB.lang.isArray(data[prop])) {
					var str = "";
					for (var i=0; i < data[prop].length; i++) {
						str += "&" + prop + "=" + data[prop][i];
					};
					variables += str;
				} else {
					variables[prop] = data[prop];
				}
			}
		request.data = variables;
		}
		if (cookie) {
			request.requestHeaders = new Array();
			request.requestHeaders.push(new air.URLRequestHeader("Cookie", cookie));
		}
		request.method = "POST";
		request.manageCookies = false;
		loader.addEventListener(air.Event.COMPLETE, callback);
		loader.addEventListener(air.IOErrorEvent.IO_ERROR, ioError);
		loader.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, httpStatus);
		loader.addEventListener(air.ProgressEvent.PROGRESS, progress);
		loader.load(request);
	}
	
	function ioError(e) {
		// air.trace("====================\nIO ERROR: " + e.text);
	};
	
	function httpStatus(e) {
		// air.trace("====================\nHTTP STATUS:\n" + e.responseURL + "\n" + e.status + "\n" + e.type);
	};
	
	function progress(e) {
		// air.trace("====================\nPROGRESS: " + (e.target.bytesLoaded/e.target.bytesLoaded)*100);
	};

	window["LIB"]["httpr"]["getRequest"] = getRequest;
	window["LIB"]["httpr"]["postRequest"] = postRequest;

})()