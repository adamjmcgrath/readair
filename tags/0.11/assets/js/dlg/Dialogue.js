/*
Dialogue
The main application file for the dialogues
*/

// cludge
var feedId;

var Dialogue = function() {

/*
-----------------------------------------------------------
	Private Properties
-----------------------------------------------------------
*/

var GRA = theOpener.GRA;
var Application = theOpener.Application;

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
		},
		
		
		/* setupEventListeners:Void
		------------------------------------------ */
		setupEventListeners: function() {
			$("#prefs-form").submit(Dialogue.setPrefs);
			$("#prompt-form").submit(Dialogue.setPrompt);
			$("button.cancel").click(function() {window.nativeWindow.close()});
		},
		
		/* setupForms:Void
		------------------------------------------ */
		setupForms: function() {
			if (GRA.encryptedstore.savedLoginDetails()) {	
				$("#refreshtime").val(GRA.encryptedstore.getItem("refresh"));
				$("#checkatstart").val(GRA.encryptedstore.getItem("update"));
				$("#email").val(GRA.encryptedstore.getItem("email"));
				$("#passwd").val(GRA.encryptedstore.getItem("passwd"));
				$("#rememeber").val(GRA.encryptedstore.getItem("rememeber"));
			}
		},
		
		/* set prefs and return login
		e:Event - Prefs form submit event
		------------------------------------------ */
		setPrefs: function(e) {
			GRA.encryptedstore.setLoginDetails(e.target.email.value, e.target.passwd.value, e.target.remember.checked);
			GRA.encryptedstore.setPrefs(e.target.checkatstart.value, e.target.refreshtime.value)
			window.close();
			e.preventDefault();
		},
		
		/* return the prompt
		e:Event - Prefs form submit event
		------------------------------------------ */
		setPrompt: function(e) {
			var str = e.target.myprompt.value;
			Application.setPromptCludge(str,feedId);
			window.close();
			e.preventDefault();
		}
		
	}
	
}();

$(document).ready(Dialogue.init);