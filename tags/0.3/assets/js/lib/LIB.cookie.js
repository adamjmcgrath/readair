// /////////////////////////////////////////////////
// LIB.cookie
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.cookie = {
	
	setCookie: function(name, value, expires, path, domain, secure) { 
		var curCookie = name + "=" + escape(value) + 
		((expires) ? "; expires=" + expires.toGMTString() : "") + 
		((path) ? "; path=" + path : "") + 
		((domain) ? "; domain=" + domain : "") + 
		((secure) ? "; secure" : ""); 
		document.cookie = curCookie; 
	},
	
	testCookies: function() { 
		var exp = new Date(); 
		exp.setTime(exp.getTime() + 1800000); 
		// first write a test cookie 
		this.setCookie("cookies", "cookies", exp, false, false, false); 
		if (document.cookie.indexOf('cookies') != -1) { 
			alert("Got Cookies!"); 
		} 
		else { 
			alert("No Cookies!"); 
		} 
		// now delete the test cookie 
		exp = new Date(); 
		exp.setTime(exp.getTime() - 1800000); 
		this.setCookie("cookies", "cookies", exp, false, false, false); 
	}
}