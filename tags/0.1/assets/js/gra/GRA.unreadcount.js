////////////////////////////////////////////////////////////////////
// GRA.unreadcount
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.unreadcount = function(thePayload) {
	this.XMLDocument = LIB.dom.parseFromString(thePayload);
}

////////////////////////////////////////////////////////////////////
// GRA.unreadcount Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.unreadcount.prototype = {
    feeds: function() {
		// returns array of feed objects
		var nodes = LIB.dom.evaluateXPath(this.XMLDocument, "/object/list/object");
		return nodes;
	},
	states: function() {
		var nodes = LIB.dom.evaluateXPath(this.XMLDocument, "/object/list/object[contains(string[@name='id'],'/state/com.google/')]");
		return nodes;
	},
	labels: function() {
		var nodes = LIB.dom.evaluateXPath(this.XMLDocument, "/object/list/object[contains(string[@name='id'],'/label/')]");
		return nodes;
	},
	getAllId: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLDocument, "/object/list/object/string[@name='id'][contains(.,'/state/com.google/reading-list')]");
		f.setFromNode(node);
		return f.value();
	}
}