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
	
	/* Preferences
	------------------------------------------ */
	
	// weather to check for updates at start or not (true/false)
	_UPDATE: "update",
	// how often to refresh feeds (0/5/10/20/30)
	_REFRESH: "refresh",
	
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
	------------------------------------------
	Preferences
	
	checkUpdate:Boolean
	------------------------------------------ */
	checkUpdate: function() {
		return Booelan(this.getItem(this._UPDATE));
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
	setPrefs: function(update,refresh) {
		this.setItem(this._UPDATE,String(update));
		this.setItem(this._REFRESH,refresh);
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
	}
	
}

