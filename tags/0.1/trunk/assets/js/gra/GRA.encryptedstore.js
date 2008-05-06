////////////////////////////////////////////////////////////////////
// GRA.encryptedstore
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

GRA.encryptedstore = {
	
	_getItem: function(prop) {
		var value = false;
		var item = air.EncryptedLocalStore.getItem(prop);
		if (item) {
			var value = item.readUTFBytes(item.bytesAvailable);
		}
		return value;
	},
	
	_setItem: function(prop,value) {
		var data = new air.ByteArray();
		data.writeUTFBytes(value);
		air.EncryptedLocalStore.setItem(prop,data);
	},
	
	savedLoginDetails: function() {
		return this._getItem('email') != false;
	},

	getLoginDetails: function() {
		var details = new Object();
		details['email'] = this._getItem("email");
		details['pass'] = this._getItem("passwd");
		return details;
	},

	setLoginDetails: function(email,passwd,remember) {
		this._setItem("email",email);
		this._setItem("passwd",passwd);
		this._setItem("remember",String(remember));
	},

	removeLoginDetails: function() {
		air.EncryptedLocalStore.removeItem('email');
		air.EncryptedLocalStore.removeItem('passwd');
		air.EncryptedLocalStore.removeItem('remember');
	}
	
}

