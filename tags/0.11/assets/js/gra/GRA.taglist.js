////////////////////////////////////////////////////////////////////
// GRA.taglist
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.taglist = function(thePayload) {
	this.XMLdocument = LIB.dom.parseFromString(thePayload);
}

////////////////////////////////////////////////////////////////////
// GRA.subslist Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.taglist.prototype = {
    tags: function() {
		// returns array of feed objects
		var nodes = LIB.dom.evaluateXPath(this.XMLdocument, "/object/list/object");
		return nodes;
	},
	states: function() {
		var nodes = LIB.dom.evaluateXPath(this.XMLdocument, "/object/list/object[contains(string[@name='id'],'/state/com.google/')]");
		return nodes;
	},
	labels: function() {
		var nodes = LIB.dom.evaluateXPath(this.XMLdocument, "/object/list/object[contains(string[@name='id'],'/label/')]");
		return nodes;
	},
	getStarredId: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLdocument, "/object/list/object/string[@name='id'][contains(.,'/state/com.google/starred')]");
		f.setFromNode(node);
		return f.value();
	},
	getSharedId: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLdocument, "/object/list/object/string[@name='id'][contains(.,'/state/com.google/broadcast')]");
		f.setFromNode(node);
		return f.value();
	}
}