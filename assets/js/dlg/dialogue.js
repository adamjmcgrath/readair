/*
Dialogue
The main application file for the dialogues
*/

var Dialogue = function() {

/*
-----------------------------------------------------------
	Private Properties
-----------------------------------------------------------
*/

var GRA = theOpener.GRA;
var Application = theOpener.Application;

var refresh = GRA.encryptedstore.getItem("refresh");
var update = GRA.encryptedstore.getItem("update");
var theme = GRA.encryptedstore.getItem("theme");
var email = GRA.encryptedstore.getItem("email");
var passwd = GRA.encryptedstore.getItem("passwd");
var remember = GRA.encryptedstore.getItem("rememeber");

/*
-----------------------------------------------------------
	Public Methods
-----------------------------------------------------------
*/
	return {
		
		/* initialise
		------------------------------------------ */
		init: function() {
			Dialogue.setupEventListeners();
			Dialogue.setupForms();
			Dialogue.updateTheme();
		},
		
		updateTheme: function() {		
			$("#theme", "html head").attr( { "href" : "assets/css/themes/" + theme + ".css" } );
		},
		
		
		/* setupEventListeners:Void
		------------------------------------------ */
		setupEventListeners: function() {
			$("#prefs-form").submit(Dialogue.setPrefs);
			// isn't needed (?)
			//$("button.cancel").click(function() {window.nativeWindow.close()});
		},
		
		/* setupForms:Void
		------------------------------------------ */
		setupForms: function() {
			if (GRA.encryptedstore.savedLoginDetails()) {	
				$("#refreshtime").val(refresh);
				$("#checkatstart").val(update);
				// val isn't working with letters =/
				$("option[@value='" + theme + "']").attr( { "selected" : "selected" } );
				$("#email").val(email);
				$("#passwd").val(passwd);
				$("#rememeber").val(remember);
			}
		},
		
		/* set prefs and return login
		e:Event - Prefs form submit event
		------------------------------------------ */
		setPrefs: function(e) {
			e.preventDefault();
			GRA.encryptedstore.setPrefs(e.target.checkatstart.value, e.target.refreshtime.value, e.target.theme.value);
			Application.updateTheme();			
			GRA.encryptedstore.setLoginDetails(e.target.email.value, e.target.passwd.value, e.target.remember.checked);
			var login = new DLG.login(e.target.email.value,e.target.passwd.value);
			LIB.httpr.postRequest(GRA.cons.URI_LOGIN(),Dialogue.checkLogin,login.data());	
		},
		
		checkLogin: function(e) {
			var data = e.target.data
			if (data.indexOf("Error=BadAuthentication") > -1) {
				alert("Please check your login details and try again. (N.B You need a Google Reader account in order to login)")
			} else {
				var session = new DLG.session(data);
				GRA.encryptedstore.setItem("cookie",session.cookie());
				window.close();
			}
		},
		
	}
	
}();

$(document).ready(Dialogue.init);