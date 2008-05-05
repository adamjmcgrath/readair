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
		},
		
		
		/* setup event listeners
		------------------------------------------ */
		setupEventListeners: function() {
			$("#prefs-form").submit(Dialogue.setPrefs);
			$("#prompt-form").submit(Dialogue.setPrompt);
			$("button.cancel").click(function() {window.nativeWindow.close()});
		},
		
		/* set prefs and return login
		e:Event - Prefs form submit event
		------------------------------------------ */
		setPrefs: function(e) {
			GRA.encryptedstore.setLoginDetails(e.target.email.value, e.target.passwd.value);
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