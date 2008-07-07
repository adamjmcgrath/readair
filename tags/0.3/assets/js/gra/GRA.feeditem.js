////////////////////////////////////////////////////////////////////
// GRA.feeditem
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.feeditem = function(node) {
	this._XMLNode = node;
}

////////////////////////////////////////////////////////////////////
// GRA.feeditem Properties/Methods
////////////////////////////////////////////////////////////////////

GRA.feeditem.prototype = {
	id: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='id']");
        f.setFromNode(node);
        return f.value();
	},
	title: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='title']");
        f.setFromNode(node);
        return f.value();
	},
	sortId: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this._XMLNode, "./string[@name='sortid']");
        f.setFromNode(node);
        return f.value();
	},
	tags: function() {
		var tags = new Array();
		var nodes = LIB.dom.evaluateXPath(this._XMLNode, "./list/object");
		for (var i=0; i < nodes.length; i++) {
			tags.push(new GRA.feeditemtag(nodes[i]));
		};
		return tags;
	},
	hasTag: function(tag) {
		var xpe = "./list/object[string[@name='label']='" + tag + "']";
		var nodes = LIB.dom.evaluateXPath(this._XMLNode, xpe);
		return Boolean(nodes.length);
	}
}