// /////////////////////////////////////////////////
// LIB.string
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.string = {
 	LTrim: function(value) {
		var re = /\s*((\S+\s*)*)/;
		return value.replace(re, "$1");
	},
	RTrim: function(value) {
		var re = /((\s*\S+)*)\s*/;
		return value.replace(re, "$1");
	},
	trim: function(value) {
		return this.LTrim(this.RTrim(value));
	},
	substringAfter: function(str,separator) {
		var array = str.split(separator)
		return array[1];
	}
}