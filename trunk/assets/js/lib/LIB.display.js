// /////////////////////////////////////////////////
// LIB.dom
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.display = {
	
	isShowing: function(el) {
	    return "none" != el.style.display;
	},
	
	toggle: function(el) {
		if (typeof el == "string") {el = document.getElementById(el)}
		
	    if (LIB.display.isShowing(el))
	        el.style.display = "none";
	    else
	        el.style.display = "";
	}
	
}