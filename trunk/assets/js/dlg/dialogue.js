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
var update = GRA.encryptedstore.getBooleanItem("update");
var email = GRA.encryptedstore.getItem("email");
var passwd = GRA.encryptedstore.getItem("passwd");
var remember = GRA.encryptedstore.getBooleanItem("remember");

var theme = GRA.encryptedstore.getItem("theme");
var savePosition = GRA.encryptedstore.getBooleanItem("saveposition");

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
			$("button.cancel").click(function(e) {
				e.preventDefault();
				window.nativeWindow.close();
			});
		},
		
		/* setupForms:Void
		------------------------------------------ */
		setupForms: function() {
			if (GRA.encryptedstore.savedLoginDetails()) {	
				$("#email").val(email);
				$("#passwd").val(passwd);
				
				if ( remember )
					$("#remember").attr( { "checked" : "checked" } );
			}
			
			if ( refresh != false ) {
				$("#refreshtime").val(refresh);
				$("select[@name='checkatstart'] option[@value='" + ( update ? 1 : 0 ) + "']").attr( { "selected": "selected" } );

				// val isn't working with letters =/
				$("select[@name='theme'] option[@value='" + theme + "']").attr( { "selected": "selected" } );
				if ( savePosition )
					$("#position").attr( { "checked" : "checked" } );
			}
		},
		
		/* set prefs and return login
		e:Event - Prefs form submit event
		------------------------------------------ */
		setPrefs: function(e) {
			e.preventDefault();
			GRA.encryptedstore.setPrefs(
				( e.target.checkatstart.value == 1 ) ? true : false,
				e.target.refreshtime.value,
				e.target.theme.value,
				e.target.position.checked);
				
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