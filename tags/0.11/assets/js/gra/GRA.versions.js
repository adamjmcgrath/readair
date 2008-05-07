////////////////////////////////////////////////////////////////////
// GRA.versions
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.versions = function(thePayload) {
	this.XMLDocument = LIB.dom.parseFromString(thePayload);
}

////////////////////////////////////////////////////////////////////
// GRA.versions Methods
////////////////////////////////////////////////////////////////////

GRA.versions.prototype = {
    items: function() {
		nodes = LIB.dom.evaluateXPath(this.XMLDocument, "./versions/item");
		return nodes;
	},
	latestVersion: function() {
		var items = this.items();
		var latestVersionObj;
		var version = 0;
		for (var i=0; i < items.length; i++) {
			var versionItemObj = new GRA.versionitem(items[i]);
			var thisVersion = Number(versionItemObj.version());			
			if (thisVersion > version) {
				version = thisVersion;
				latestVersionObj = versionItemObj;
			};
		};
		return versionItemObj;
	}
}