////////////////////////////////////////////////////////////////////
// GRA.versionitem
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.versionitem = function(thePayload) {
	this.XMLNode = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.versionitem Methods
////////////////////////////////////////////////////////////////////

GRA.versionitem.prototype = {
    id: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./id");
		f.setFromNode(node);
		return f.value();
	},
	filename: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./filename");
		f.setFromNode(node);
		return f.value();
	},
	fileUrl: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./url");
		f.setFromNode(node);
		return f.value();
	},
	name: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./name");
		f.setFromNode(node);
		return f.value();
	},
	version: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./version");
		f.setFromNode(node);
		return f.value();
	},
	description: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./description");
		f.setFromNode(node);
		return f.value();
	},
	releasenotes: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLNode, "./release-notes");
		f.setFromNode(node);
		return f.value();
	}
}