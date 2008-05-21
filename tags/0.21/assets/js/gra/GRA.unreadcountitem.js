////////////////////////////////////////////////////////////////////
// GRA.unreadcountitem
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.unreadcountitem = function(thePayload) {
	this.XMLnode = thePayload;
}

////////////////////////////////////////////////////////////////////
// GRA.unreadcountitem Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.unreadcountitem.prototype = {
    id: function() {
		var f = new LIB.fields.string();
        var node = LIB.dom.nodeForXPath(this.XMLnode, "./string[@name='id']");
        f.setFromNode(node);
        return f.value();
	},
	count: function() {
		var f = new LIB.fields.number();
        var node = LIB.dom.nodeForXPath(this.XMLnode, "./number[@name='count']");
        f.setFromNode(node);
        return f.value();
	}
}