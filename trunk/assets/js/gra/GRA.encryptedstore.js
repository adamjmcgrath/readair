/*
GRA.encryptedstore
Gets/Sets items in the air.EncryptedLocalStore
*/

// GRA namespace
if (typeof GRA == "undefined") {var GRA = {};}


GRA.encryptedstore = {
	
	/* 
	------------------------------------------
	Constants
	
	Login:
	------------------------------------------ */
	
	// the users google account username
	_EMAIL: "email",
	// the users password
	_PASSWD: "passwd",
	// remember: weather to remember the users details after the app closes (true/false)
	_REMEMBER: "remember",
	
	/* Session:
	------------------------------------------ */
	
	_COOKIE: "cookie",
	
	/* Preferences
	------------------------------------------ */
	
	// weather to check for updates at start or not (true/false)
	_UPDATE: "update",
	// how often to refresh feeds (0/5/10/20/30)
	_REFRESH: "refresh",
	// theme (string)
	_THEME: "theme",

	/*
	 * window position
	 */
	
	// x coordinate
	_LEFT: "left",
	// y coordinate
	_TOP: "top",
	// width
	_WIDTH: "width",
	// height
	_HEIGHT: "height",
	// maximized
	_MAXIMIZED: "maximized",
	
	/*
	getItem:String
	prop:String
	------------------------------------------ */
	getItem: function(prop) {
		var value = false;
		var item = air.EncryptedLocalStore.getItem(prop);
		if (item) {
			var value = item.readUTFBytes(item.bytesAvailable);
		}
		return value;
	},
	
	/*
	setItem:Void
	------------------------------------------ */
	setItem: function(prop,value) {
		var data = new air.ByteArray();
		data.writeUTFBytes(value);
		air.EncryptedLocalStore.setItem(prop,data);
	},
	
	/*
	 * get window position
	 * @return {array} position elements array
	 */
	getWindowPosition: function() {
		// defaults
		if ( !this.getItem(this._LEFT) )
		{
			return {
				x: 200,
				y: 100,
				width: 800,
				height: 600,
				maximized: false
			};
		}
		
		return {
			x: Number(this.getItem(this._LEFT)),
			y: Number(this.getItem(this._TOP)),
			width: Number(this.getItem(this._WIDTH)),
			height: Number(this.getItem(this._HEIGHT)),
			// boolean is not working ? O.o
			maximized: this.getItem(this._MAXIMIZED) == 'true'
		}
	},
	
	/*
	 * set window position
	 * @param {integer} x coordinate
	 * @param {integer} y coordinate
	 * @param {integer} width
	 * @param {integer} height
	 * @param {boolean} maximized state
	 */
	setWindowPosition: function( left, top, width, height, maximized ) {
		this.setItem(this._MAXIMIZED, maximized);
		
		if ( !maximized ) {
			this.setItem(this._LEFT, left);
			this.setItem(this._TOP, top);
			this.setItem(this._WIDTH, width);
			this.setItem(this._HEIGHT, height);
		}
	},
	
	/* 
	------------------------------------------
	Preferences
	
	checkUpdate:Boolean
	------------------------------------------ */
	checkUpdate: function() {
		return Boolean(this.getItem(this._UPDATE));
	},
	
	/*
	refreshTime:Number
	------------------------------------------ */
	refreshTime: function() {
		return Number(this.getItem(this._REFRESH));
	},
	
	/*
	theme:Number
	------------------------------------------ */
	theme: function() {
		return String(this.getItem(this._THEME));
	},
	
	/*
	setPrefs:Void
	------------------------------------------ */
	setPrefs: function(update,refresh,theme) {
		this.setItem(this._UPDATE,String(update));
		this.setItem(this._REFRESH,refresh);
		this.setItem(this._THEME,theme);
	},
	
	/* 
	------------------------------------------
	Login details
	
	savedLoginDetails:Boolean
	------------------------------------------ */	
	savedLoginDetails: function() {
		return this.getItem(this._EMAIL) != false;
	},
	
	/*
	getLoginDetails:Object
	------------------------------------------ */
	getLoginDetails: function() {
		return {
			email: this.getItem(this._EMAIL),
			pass: this.getItem(this._PASSWD)
		}
	},
	
	/*
	rememberLoginDetails:Boolean
	------------------------------------------ */
	saveLogin: function() {
		return this.getItem(this._REMEMBER);
	},
	
	/*
	getLoginDetails:Void
	email:String - users email
	passwd:String - users passwd
	remember:Boolean - wether to remember details
	------------------------------------------ */
	setLoginDetails: function(email,passwd,remember) {
		this.setItem(this._EMAIL,email);
		this.setItem(this._PASSWD,passwd);
		this.setItem(this._REMEMBER,remember);
	},
	
	/*
	removeLoginDetails:Void
	------------------------------------------ */
	removeLoginDetails: function() {
		air.EncryptedLocalStore.removeItem(this._EMAIL);
		air.EncryptedLocalStore.removeItem(this._PASSWD);
		air.EncryptedLocalStore.removeItem(this._REMEMBER);
		air.EncryptedLocalStore.removeItem(this._COOKIE);
	}	
}

