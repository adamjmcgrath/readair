////////////////////////////////////////////////////////////////////
// GRA.appdescriptor
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.appdescriptor = function(thePayload) {
	this.XMLDocument = LIB.dom.parseFromString(thePayload);
	this._root = this.XMLDocument.getElementsByTagName('application')[0];
}

////////////////////////////////////////////////////////////////////
// GRA.appdescriptor Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.appdescriptor.prototype = {
    id: function() {
		return this._root.getElementsByTagName("id")[0].firstChild.data;
	},
	filename: function() {
		return this._root.getElementsByTagName("filename")[0].firstChild.data;
	},
	name: function() {
		return this._root.getElementsByTagName("name")[0].firstChild.data;
	},
	version: function() {
		return this._root.getElementsByTagName("version")[0].firstChild.data;
	},
	description: function() {
		return this._root.getElementsByTagName("description")[0].firstChild.data;
	}
}