/**
 * @fileoverview Abstraction of google readers atom feed
 * @author Adam McGrath
 * takes atom in either XML or JSON
 */

/**
 * @namespace GRA
 */
if (typeof GRA == "undefined") {var GRA = {};}

/**
 * Constructor of the GRA.atom class.
 * @constructor
 * @param {XML|Object} payload The atom feed data in JSON or XML format. 
 * @return {Object} An instance of the GRA.atom class.
 */
GRA.atom = function(payload) {
	this._ns = "http://www.w3.org/2005/Atom";
	this._currentEntries = new Array();
	this._allEntries = new Array();
	this.setData(payload);
}

GRA.atom.prototype = {
	
	/**
	 * Checks to say whether this instance of the GRA.atom object is in 'JSON mode'
	 * @private
	 * @return {Boolean} True if the atom was constructed with JSON.
	 */
	_isJSON: function() {
		return Boolean(this._json);
	},
	
	/**
	 * Checks to say whether this instance of the GRA.atom object is in 'XML mode'
	 * @private
	 * @return {Boolean} True if the atom was constructed with JSON.
	 */
	_isXML: function() {
		return Boolean(this._xml);
	},
	
	/**
	 * Checks the type of data the sets the correct property; JSON or XML.
	 * @param {Object|XML} payload The atom feed data in JSON or XML format.
	 */
	setData: function(payload) {
		this._json = null;
		this._xml = null;
		if (payload instanceof Object) {
			this._json = payload;
		} else {
			this._xml = LIB.dom.parseFromString(payload);
		}
		this.setEntries();
	},

	/**
	 * Gets either all feeds or current feeds associated with atom instance
	 * @param {Boolean} all Switch to say whether to return all or current. 
	 * @return {Array} Array of GRA.atomentry instances.
	 */
	getEntries: function(all) {
		return all ? this._allEntries : this._currentEntries;
	},

	/**
	 * Sets the entries array properties
	 * (Reader returns sets of 20 entries at a time)
	 */
    setEntries: function() {
		var entries = new Array();
		if (this._isXML()) {
			entries = LIB.dom.evaluateXPath(this._xml, "/atom:feed/atom:entry", this._ns);
		} else if (this._isJSON()) {
			entries = this._json['items'];
		}
		this._currentEntries = entries;
		this._allEntries = this._allEntries.concat(entries);
	},

	/**
	 * Gets the id of the atom feed
	 * @return {String} The atom feed's id.
	 */	
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

	/**
	 * Gets the continuation id of the atom feed
	 * This is the id that tells Reader what atom entrys to return
	 * @return {String} The atom feed's continiation id.
	 */
	continuation: function() {
		var str = new String();
		if (this._isXML()) {
			str = this._xml.getElementsByTagName("continuation")[0].firstChild.data;
		} else if (this._isJSON()) {
			str = this._json['continuation'];
		}
		return str;
	},
	
	/**
	 * Generates the html for the items table either by XSLT or String concatenation
	 * @return {String} string of html table rows, 1 per atom item.
	 */
	HTML: function() {
		var HTML = "";
		if (this._isXML()) {
			tempString = LIB.dom.toString(this._xml).replace(/&nbsp;/g, ' ');
			HTML = LIB.xslt.transformToFragment("/assets/xslt/atom.xslt",tempString);
		} else if (this._isJSON()) {
			var entries = this.getEntries();
			for (var i=0; i < entries.length; i++) {
				var atomEntryObj = new GRA.atomentry(entries[i]);
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
	
	/**
	 * Returns a GRA.atomentry Instance with the corresponding id
	 * @param {String} id The Id of the atom item. 
	 * @return {Object|Boolean} Instance of GRA.atomentry class or false.
	 */
	getItemById: function(id) {
		var entries = this.getEntries(true);
		//var entries = this._allEntries;
		for (var i=0; i < entries.length; i++) {
			var entry = new GRA.atomentry(entries[i]);
			if (entry.id() == id) {
				return entries[i];
			}
		};
        return false;		
	}

}