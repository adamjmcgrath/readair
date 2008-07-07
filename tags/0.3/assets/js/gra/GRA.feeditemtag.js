////////////////////////////////////////////////////////////////////
// GRA.feeditemtag
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.feeditemtag = function(node) {
	this._XMLNode = node;
}

////////////////////////////////////////////////////////////////////
// GRA.feeditemtag Properties/Methods
////////////////////////////////////////////////////////////////////

GRA.feeditemtag.prototype = {
	id: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='id']");
        f.setFromNode(node);
        return f.value();
	},
	title: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='label']");
        f.setFromNode(node);
        return f.value();
	}
}