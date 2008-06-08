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
	
	// save window position
	_SAVEPOSITION: "saveposition",
	
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
	 * get boolean item
	 * @param {String} property name
	 */
	getBooleanItem: function( prop ) {
		var item = air.EncryptedLocalStore.getItem(prop);
		if (item) {
			var value = item.readByte(); 
			return value == 1;
		}

		return false;
	},
	
	/*
	 * get string item
	 * @param {String} property name
	 */
	getItem: function(prop) {
		var value = false;
		var item = air.EncryptedLocalStore.getItem(prop);
		if (item) {
			value = item.readUTFBytes(item.bytesAvailable);
		}

		return value;
	},
	
	/*
	 * set boolean item value
	 * @param {String} property name
	 * @param {Boolean} property value
	 */
	setBooleanItem: function(prop, value) {
		var data = new air.ByteArray();
		data.writeByte( ( value ) ? 1 : 0 );
		air.EncryptedLocalStore.setItem(prop, data);
	},
	
	/*
	 * set string item value
	 * @param {String} property name
	 * @param {String} property value
	 */
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
			maximized: this.getBooleanItem(this._MAXIMIZED)
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
		this.setBooleanItem(this._MAXIMIZED, maximized);
		
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
		return this.getBooleanItem(this._UPDATE);
	},
	
	/*
	refreshTime:Number
	------------------------------------------ */
	refreshTime: function() {
		return Number(this.getItem(this._REFRESH));
	},
	
	/*
	setPrefs:Void
	------------------------------------------ */
	setPrefs: function(i_update, i_refresh, i_theme, i_savePosition) {
		this.setBooleanItem(this._UPDATE, i_update);
		this.setItem(this._REFRESH, i_refresh);
		
		this.setItem(this._THEME, i_theme);
		this.setBooleanItem(this._SAVEPOSITION, i_savePosition);
	},
	
	/*
	 * ------------------------------------------
	 * Appearance settings
	 * ------------------------------------------
	 */
	
	/*
	 * used theme
	 * @return {String} theme name
	 */
	theme: function() {
		return String(this.getItem(this._THEME));
	},
	
	/*
	 * save window position
	 * @return {Boolean} save window position on close
	 */
	savePosition: function() {
		return this.getBooleanItem( this._SAVEPOSITION );
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
		return this.getBooleanItem(this._REMEMBER);
	},
	
	/*
	 * set login details
	 * @param {String} users email
	 * @param {String} users password
	 * @param {Boolean} remember login details
	 */
	setLoginDetails: function(i_email,i_passwd,i_remember) {
		this.setItem(this._EMAIL,i_email);
		this.setItem(this._PASSWD,i_passwd);
		this.setBooleanItem(this._REMEMBER,i_remember);
	},
	
	/*
	 * remove login details
	 */
	removeLoginDetails: function() {
		air.EncryptedLocalStore.removeItem(this._EMAIL);
		air.EncryptedLocalStore.removeItem(this._PASSWD);
		air.EncryptedLocalStore.removeItem(this._REMEMBER);
		air.EncryptedLocalStore.removeItem(this._COOKIE);
	}	
}

