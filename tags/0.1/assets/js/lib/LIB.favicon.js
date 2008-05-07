/*
LIB.favicon
Doesn't work at the moment - Adobe Air doesn't render .ico's in the same way safari does...
*/

if (typeof LIB == "undefined") {var LIB = {}}

LIB.favicon = {
	setFavicon: function(id,elm) {
		var domain = id.match(/(\w+):\/\/([^/:]+)(:\d*)?([^# ]*)/);
		domain = RegExp.$2;
		var fsrc = "http://"+domain+"/favicon.ico";
		
		air.trace(fsrc);
		
		//elm.setAttribute("src",fsrc);
		$(elm).attr("src",fsrc);
		
		elm.onerror = function (e) {
			//elm.setAttribute("src","/assets/imb/icons/default.png");
			$(elm).attr("src","/assets/imb/icons/default.png");
		}
	}
}