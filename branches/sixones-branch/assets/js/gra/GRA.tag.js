////////////////////////////////////////////////////////////////////
// GAR.tag
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.tag = function(thePayload) {
	this._XMLNode = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.tag Properties/Methods
////////////////////////////////////////////////////////////////////

GRA.tag.prototype = {
	id: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='id']");
        f.setFromNode(node);
        return f.value();
	},
	isShared: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='shared']");
        f.setFromNode(node);
        return f.value();
	},
	sortId: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='sortid']");
        f.setFromNode(node);
        return f.value();
	},
	title: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='id']");
        f.setFromNode(node);
		return f.value().substr(f.value().lastIndexOf("/") + 1);
	}
}