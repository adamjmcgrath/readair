/*
GRA.dialogue
Manages dialogue windows for loading, preferences etc..
*/

if (typeof GRA == "undefined") {var GRA = {}}

/* 
------------------------------------------
type:String - the type of dialogue box to create
------------------------------------------ */

GRA.dialogue = function(type) {
	this._type = this._getType(type);
	var options = this._getOptions();
	var bounds = new air.Rectangle(this._getXBounds(this._type.width),this._getYBounds(this._type.height),this._type.width,this._type.height);
	this._loader = air.HTMLLoader.createRootWindow(true, options, false, bounds);
	this._nativewindow = this._loader.window.nativeWindow;
	this._nativewindow.title = this._type.title;
}

/* authentication methods/properties 
------------------------------------------ */

GRA.dialogue.prototype = {

	/* private methods */

	_getType: function(type) {
		switch (type) {
		case "loading":
			return this.loading;
		case "general":
			return this.general;
		case "account":
			return this.account;
		default:
			return this.general;
		}
	},
	
	_getOptions: function() {
		var options = new air.NativeWindowInitOptions();
		options.type = air.NativeWindowType.UTILITY;
		options.maximizable = false;
		options.minimizable = false;
		options.resizable = false;
		return options;
	},
	
	_getXBounds: function(width) {
		return window.nativeWindow.x + (window.nativeWindow.width/2) - (width/2);
	},
	
	_getYBounds: function(height) {
		return y = window.nativeWindow.y + (window.nativeWindow.height/2) - ((height+10)/2);
	},
	
	/* public methods */
	
	nativeWindow: function() {
		return this._nativewindow;
	},
	
	open: function(callback,id) {
		this._loader.load(new air.URLRequest(this._type.url));
		if (callback) {
			this._nativewindow.addEventListener(air.Event.CLOSE, callback);
		}
		if (id) {
			this._loader.window.feedId = id;
		}
		this._loader.window.theOpener = window;
	},
	
	close: function() {
		this._nativewindow.close();
	},
	
	closed: function() {
		return this._nativewindow.closed;
	}

}

GRA.dialogue.prototype.loading = {
	url: "app:/dialogue.html#loading",
	title: "",
	height: 70,
	width: 300
}

GRA.dialogue.prototype.general = {
	url: "app:/dialogue.html#general",
	title: "Preferences",
	height: 285,
	width: 420
}

GRA.dialogue.prototype.account = {
	url: "app:/dialogue.html#account",
	title: "Account information",
	height: 280,
	width: 420
}