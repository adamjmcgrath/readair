////////////////////////////////////////////////////////////////////
// ASB.login
////////////////////////////////////////////////////////////////////

if (typeof ASB == "undefined") {var ASB = {};}

(function() {
	if(!window.ASB.login) { window["ASB"]["login"] = {} }

	function savedLoginDetails() {
		return (air.EncryptedLocalStore.getItem('email') != undefined);
	}
	
	function getLoginDetails() {
		var user = air.EncryptedLocalStore.getItem('email');
		var pass = air.EncryptedLocalStore.getItem('pass');
		var details = new Array();
		details[0] = user.readUTFBytes(user.bytesAvailable);
		details[1] = pass.readUTFBytes(pass.bytesAvailable);
		return details;
	}
	
	function setLoginDetails(theEmail,thePassword) {
		data = new air.ByteArray();
		data.writeUTFBytes(theEmail);
		air.EncryptedLocalStore.setItem('email',data );
		data = new air.ByteArray();
		data.writeUTFBytes(thePassword);
		air.EncryptedLocalStore.setItem('pass',data);
	}
	
	function removeLoginDetails() {
		air.EncryptedLocalStore.removeItem('email');
		air.EncryptedLocalStore.removeItem('pass');
	}

	window["ASB"]["login"]["getLoginDetails"] = getLoginDetails;
	window["ASB"]["login"]["setLoginDetails"] = setLoginDetails;
	window["ASB"]["login"]["savedLoginDetails"] = savedLoginDetails;
	window["ASB"]["login"]["removeLoginDetails"] = removeLoginDetails;
	
})()

