/*
GRA.atom
Represents an atom feed
*/

// GRA Namespace
if (typeof GRA == "undefined") {var GRA = {};}

/* Initialize private properties
payload:XML/JSON - 
------------------------------------------ */
GRA.atom = function(payload) {
	this.setData(payload);
	this._ns = "http://www.w3.org/2005/Atom";
	this._allEntries = new Array();
}

/* 
Methods
------------------------------------------ */

GRA.atom.prototype = {
	
	_isJSON: function() {
		return Boolean(this._json);
	},
	
	_isXML: function() {
		return Boolean(this._xml);
	},
	
	setData: function(payload) {
		this._json = null;
		this._xml = null;
		if (payload instanceof Object) {
			this._json = payload;
		} else {
			this._xml = LIB.dom.parseFromString(payload);
		}
	},
	
    entries: function(all) {
		var entries = new Array();
		if (this._isXML()) {
			entries = LIB.dom.evaluateXPath(this._xml, "/atom:feed/atom:entry", this._ns);
		} else if (this._isJSON()) {
			entries = this._json['items'];
		}
		this._allEntries = this._allEntries.concat(entries);
		return all ? this._allEntries : entries;
	},
	
	id: function() {
		var id = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "/atom:feed/atom:id", this._ns);
			f.setFromNode(node);
			id = LIB.string.substringAfter(f.value(),":reader/");
		} else if (this._isJSON()) {
			id = this._json['id'];
		}
		return id;
	},
	
	continuation: function() {
		var str = new String();
		if (this._isXML()) {
			str = this._xml.getElementsByTagName("continuation")[0].firstChild.data;
		} else if (this._isJSON()) {
			str = this._json['continuation'];
		}
		return str;
	},
	
	HTML: function() {
		var HTML = "";
		if (this._isXML()) {
			HTML = LIB.xslt.transformToFragment("/assets/xslt/atom.xslt",this._xml);
		} else if (this._isJSON()) {
			for (var i=0; i < this.entries().length; i++) {
				var atomEntryObj = new GRA.atomentry(this.entries()[i]);
				var classname = "";
				if (atomEntryObj.isStarred() && atomEntryObj.isRead()) {
					classname = "starred read";
				} else if (atomEntryObj.isStarred()) {
					classname = "starred"
				} else if (atomEntryObj.isRead()) {
					classname="read"
				}
				HTML += "<tr class=\"" + classname + "\" id=\"" + atomEntryObj.id() + "\">" +
					"<td class=\"readTD\">readTD</td>" +
					"<td class=\"star\">starTD</td>" +
					"<td>" + atomEntryObj.title() + "</td>" +
					"<td>" + atomEntryObj.source() + "</td>" +
					"<td>" + atomEntryObj.published().toString("yyyy-MM-dd") + "</td>" +
				"</tr>";
			};
		}
		return HTML;
	},
	
	getItemById: function(id) {
		var entries = this.entries(true);
		for (var i=0; i < entries.length; i++) {
			var entry = new GRA.atomentry(entries[i]);
			air.trace(entry.id());
			if (entry.id() == id) {
				return entries[i];
			}
		};
        return false;		
	}
}