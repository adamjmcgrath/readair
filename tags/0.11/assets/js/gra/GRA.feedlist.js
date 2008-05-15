////////////////////////////////////////////////////////////////////
// GRA.feedlist
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.feedlist = function(thePayload) {
	this.XMLDocument = LIB.dom.parseFromString(thePayload);
}

////////////////////////////////////////////////////////////////////
// GRA.feedlist Getters/Setters
////////////////////////////////////////////////////////////////////

GRA.feedlist.prototype = {
    feeds: function() {
		// returns array of feed objects
		var nodes = LIB.dom.evaluateXPath(this.XMLDocument, "/object/list/object");
		return nodes;
	},
	getFeedById: function(id) {
		var xpe = "/object/list/object[string[@name='id']='" + id + "']";
		var node = LIB.dom.nodeForXPath(this.XMLDocument, xpe);
		var feedItemObj = new GRA.feeditem(node);
		return feedItemObj;
	},
	HTML: function() {
		var fragment = LIB.xslt.transformToFragment("/assets/xslt/subs-list.xslt",this.XMLDocument);
		return fragment;
	}
}