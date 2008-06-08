/**
 * @fileoverview Abstraction of google readers atom feed item
 * @author Adam McGrath
 * takes atom item as either an XML Node or JSON
 */

if (typeof GRA == "undefined") {var GRA = {}}

/**
 * Constructor of the atomentry class.
 * @constructor
 * @param {Node|Object} payload The atom feed data as JSON or XML Node. 
 * @return {Object} An instance of the GRA.atomentry class.
 */
GRA.atomentry = function(payload) {
	if (Boolean(payload['id'])) {
		this._json = payload;
	} else {
		this._xml = payload;
		this._ns = "http://www.w3.org/2005/Atom";
	}
}

/* 
Methods
------------------------------------------ */

GRA.atomentry.prototype = {
   
	/**
	 * Checks to say whether this instance of the GRA.atomentry object is in 'JSON mode'
	 * @private
	 * @return {Boolean} True if the atom was constructed with JSON.
	 */
	_isJSON: function() {
		return Boolean(this._json);
	},

	/**
	 * Checks to say whether this instance of the GRA.atomentry object is in 'XML mode'
	 * @private
	 * @return {Boolean} True if the atom was constructed with JSON.
	 */	
	_isXML: function() {
		return Boolean(this._xml);		
	},

	/**
	 * Gets the id of the atom feed item
	 * @return {String} The atom feed's id.
	 */
	id: function() {
		var id = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:id", this._ns);
			f.setFromNode(node);
			id = f.value();
		} else if (this._isJSON()) {
			id = this._json['id'];
		}
		return id;
	},
	
	/**
	 * Gets the tags associated with the atom feed item
	 * @return {Array} An array of tag Objects/Nodes.
	 */
	tags: function() {
		var tags = new Array();
		if (this._isXML()) {
			var nodes = LIB.dom.evaluateXPath(this._xml, "./atom:category[contains(@term,'/label/')]", this._ns);
			for (var i=0; i < nodes.length; i++) {
				tags.push(nodes[i].getAttribute("label"));
			};
		} else if (this._isJSON()) {
			tags = this._json['categories'];
		}
		return tags;
	},
	
	/**
	 * Checks whether this item is starred or not
	 * @return {Boolean} True if the item is starred
	 */
	isStarred: function() {
		var isStarred = new Boolean();
		if (this._isXML()) {
			var nodes = LIB.dom.evaluateXPath(this._xml, "./atom:category[@label='starred']", this._ns);
			isStarred = Boolean(nodes.length);			
		} else if (this._isJSON()) {
			isStarred = false;
			for (var i=0; i < this.tags().length; i++) {
				if (this.tags()[i].indexOf('state/com.google/starred') !=-1) {
					isStarred = true;
				}
			};
		}
		return isStarred;
	},
	
	/**
	 * Checks whether this item is read or not
	 * @return {Boolean} True if the item is read
	 */
	isRead: function() {
		var isRead = false;
		if (this._isXML()) {
			var nodes = LIB.dom.evaluateXPath(this._xml, "./atom:category[@label='read']", this._ns);
			isRead = nodes.length > 0 ? true : false;
		} else if (this._isJSON()) {
			for (var i=0; i < this.tags().length; i++) {
				if (LIB.string.endsWith(this.tags()[i],"state/com.google/read")) {	
					return true;
				}
			};
		}
		return isRead;
	},
	
	/**
	 * Some feeds keep their conent in a 'content' tag, some a 'summary' tag
	 * This checks whether it's 'content' (if false it's 'summary')
	 * @return {Boolean} True if item has a content tag.
	 */
	hasContentTag: function() {
		var hasContentTag = new Boolean();
		if (this._isXML()) {
			var nodes = LIB.dom.evaluateXPath(this._xml, "./atom:content", this._ns);
			hasContentTag = Boolean(nodes.length);
		} else if (this._isJSON()) {
			hasContentTag = Boolean(this._json['content']);
		}
		return hasContentTag;
	},
	
	/**
	 * Gets the title of the atom feed item
	 * @return {String} The atom feed's title.
	 */
	title: function() {
		var title = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:title", this._ns);
			f.setFromNode(node);
			title = f.value();
		} else if (this._isJSON()) {
			title = this._json['title'];
		}
		return title;
	},
	
	/**
	 * Gets the date the feed item was published
	 * @return {Date} Date object of when the feed item was published.
	 */
	published: function() {
		var published = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:published", this._ns);
			f.setFromNode(node);
			published = f.value();
		} else if (this._isJSON()) {
			published = new Date(this._json['published'] * 1000);
		}
		return Date.parse(published);
	},
	
	/**
	 * Gets the date the feed item was last updated
	 * @return {Date} Date object of when the feed item was last updated.
	 */
	updated: function() {
		var updated = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:updated", this._ns);
			f.setFromNode(node);
			updated = f.value();
		} else if (this._isJSON()) {
			updated = this._json['updated'];
		}
		return Date.parse(updated);
	},
	
	/**
	 * Gets the link to the feed items webpage
	 * @return {String} The URL to the corresponding web page.
	 */
	link: function() {
		var link = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:link/@href", this._ns);
			f.setFromNode(node);
			link =  f.value();
		} else if (this._isJSON()) {
			link = this._json['alternate'][0]['href'];
		}
		return link;
	},
	
	/**
	 * Gets the content (or summary) of the feed item
	 * @return {String} Encoded HTML of the content of feed item
	 */
	content: function() {
		var content = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var xpe = this.hasContentTag() ? "./atom:content" : "./atom:summary"; 
			var node = LIB.dom.nodeForXPath(this._xml, xpe, this._ns);
			f.setFromNode(node);
			content = f.value();
		} else if (this._isJSON()) {
			if (this._json['summary']) {
				content = this._json['summary']['content'];
			} else {
				content = this._json['content']['content'];
			}
		}
		return content;
	},
	
	/**
	 * Gets the name of the author the feed item
	 * @return {String} The authors name.
	 */
	author: function() {
		var author = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:author/atom:name", this._ns);
			f.setFromNode(node);
			author = f.value();
		} else if (this._isJSON()) {
			author = this._json['author'];
		}
		return author;
	},
	
	/**
	 * Gets the name of the website the feed item has come from
	 * @return {String} The name of the author of the feed item.
	 */
	source: function() {
		var source = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:source/atom:title", this._ns);
			f.setFromNode(node);
			source = f.value();
		} else if (this._isJSON()) {
			source = this._json['origin']['title'];
		}
		return source;
	},
	
	/**
	 * Gets the id of the atom feed
	 * @return {String} The id of the atom feed, same as GRA.atom.id();
	 */
	sourceId: function() {
		var sourceId = new String();
		if (this._isXML()) {
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:source", this._ns);
			sourceId = node.getAttribute("gr:stream-id");
		} else if (this._isJSON()) {
			sourceId = this._json['origin']['streamId'];
		}
		return sourceId;
	},
	
	/**
	 * Gets the link to the feed item's author's webpage
	 * @return {String} The URL to the corresponding web page.
	 */
	sourceUrl: function() {
		var sourceUrl = new String();
		if (this._isXML()) {
			var f = new LIB.fields.string();
			var node = LIB.dom.nodeForXPath(this._xml, "./atom:source/atom:link/@href", this._ns);
			f.setFromNode(node);
			sourceUrl = f.value();
		} else if (this._isJSON()) {
			sourceUrl = this._json['origin']['htmlUrl'];
		}
		return sourceUrl;
	},
	
	/**
	 * Returns the HTML to display the atom entry in the item detail viewing pane
	 * @return {String} Formatted HTML string
	 */
	HTML: function() {
		var HTML = ""
		+ "<div id=\"head\">"
		+ "	<h1><a href=\"" + this.link() + "\">" + this.title() + "</a></h1>"
		+ "	<h2><a href=\"" + this.sourceUrl() + "\"><img class=\"favicon\" width=\"16\" height=\"16\" />" + this.source() + " - </a> " + this.published().toString('ddd d MMMM, yyyy h:mm tt') + "</h2>"
		+ "</div>"
		+ "<div id=\"content\">"
		+ this.content()
		+ "</div>";
		return HTML;
	}
}

/**
 * Example JSON:
 * "isReadStateLocked": true,
 * "crawlTimeMsec": "1195432974812",
 * "id": "tag: google.com,2005:reader/item/30e94eba76158308",
 * "categories": [
 * 	"user/15011393148747346249/state/com.google/read",
 * 	"user/15011393148747346249/state/com.google/reading-list",
 * 	"user/15011393148747346249/label/Design",
 * 	"user/15011393148747346249/label/Web Standards"
 * ],
 * "title": "A follow up on CSS frameworks",
 * "published": 1195429014,
 * "updated": 1195429014,
 * "alternate": [{
 * 	"href": "http: //feeds.feedburner.com/~r/jeffcroft/blog/~3/186881684/",
 * 	"type": "text/html"
 * }],
 * "summary": {
 * 	"direction": "ltr",
 * 	"content": "<p>The Feeds Summary</p>"
 * },
 * "author": "jcroft",
 * "comments": [],
 * "origin": {
 * 	"streamId": "feed/http: //www2.jeffcroft.com/feeds/blog/",
 * 	"title": "JeffCroft.com:  Latest blog entries",
 * 	"htmlUrl": "http: //jeffcroft.com/"
 * }
 * 
 * Example XML:
 * <entry xmlns="http://www.w3.org/2005/Atom" xmlns:gr="http://www.google.com/schemas/reader/atom/" gr:crawl-timestamp-msec="1208979835402">
 * 	<id gr:original-id="http://jeffcroft.com/blog/2008/apr/23/who-owns-javascript/">tag:google.com,2005:reader/item/62184ed641652ee9</id>
 * 	<category term="user/15011393148747346249/state/com.google/read" scheme="http://www.google.com/reader/" label="read"/>
 * 	<category term="user/15011393148747346249/state/com.google/tracking-igoogle-module-read" scheme="http://www.google.com/reader/" label="tracking-igoogle-module-read"/>
 * 	<category term="user/15011393148747346249/state/com.google/reading-list" scheme="http://www.google.com/reader/" label="reading-list"/>
 * 	<category term="user/15011393148747346249/label/Design" scheme="http://www.google.com/reader/" label="Design"/>
 * 	<category term="user/15011393148747346249/label/Web Standards" scheme="http://www.google.com/reader/" label="Web Standards"/>
 * 	<category term="user/15011393148747346249/state/com.google/fresh" scheme="http://www.google.com/reader/" label="fresh"/>
 * 	<title type="html">But who owns Javascript?</title>
 * 	<published>2008-04-23T19:30:52Z</published>
 * 	<updated>2008-04-23T19:30:52Z</updated>
 * 	<link rel="alternate" href="http://feeds.feedburner.com/~r/jeffcroft/blog/~3/276382506/" type="text/html"/>
 * 	<summary xml:base="http://jeffcroft.com/" type="html">&lt;p&gt;Item Summary&lt;p&gt;</summary>
 * 	<author>
 * 		<name>jcroft</name>
 * 	</author>
 * 	<source gr:stream-id="feed/http://www2.jeffcroft.com/feeds/blog/">
 * 		<id>tag:google.com,2005:reader/feed/http://www2.jeffcroft.com/feeds/blog/</id>
 * 		<title type="html">JeffCroft.com: Latest blog entries</title>
 * 		<link rel="alternate" href="http://jeffcroft.com/" type="text/html"/>
 * 	</source>
 * </entry>
 */
