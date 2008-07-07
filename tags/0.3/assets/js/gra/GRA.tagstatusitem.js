////////////////////////////////////////////////////////////////////
// GRA.tagstatusitem
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.tagstatusitem = function(thePayload) {
	this.XMLnode = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.tagstatusitem Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.tagstatusitem.prototype = {
    id: function() {
		var id = this.XMLnode.getAttribute("name");
		return id;
	},
	isOpen: function() {
		var f = new LIB.fields.string();
		var node = LIB.dom.nodeForXPath(this.XMLnode, "./object[string[@name='id'] = 'is-expanded']/string[@name='value']");
		f.setFromNode(node);
		return f.value() == "true";
	}
}