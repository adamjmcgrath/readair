////////////////////////////////////////////////////////////////////
// GRAConst
////////////////////////////////////////////////////////////////////

if (typeof GRA == "undefined") {var GRA = {};}

(function() {

	if(!window.GRA.cons) { window["GRA"]["cons"] = {} }
	
// Constants
//////////////////////////////
	
	// Update Details
	var URI_UPDATE = "http://grair/bin/";
	var UPDATE_VERSIONS = "versions.xml";
	
	// Main URI's
	var URI_LOGIN = "https://www.google.com/accounts/ClientLogin";
	var URI_LOGOUT = "https://www.google.com/accounts/Logout?service=reader";
	var URI_READER = "http://www.google.com/reader/";
 	var URI_ATOM = URI_READER + "atom/";
 	var URI_API = URI_READER + "api/0/";
 	var URI_VIEW = URI_READER + "view/";
	var URI_SETTINGS = URI_READER + "settings/";

	// Atom
	var ATOM_FEED = "feed/";
	var ATOM_USER = "user/-/";
	var ATOM_LABEL = ATOM_USER + "label/";
	var ATOM_STATE = ATOM_USER + "state/com.google/";
	var ATOM_STATE_READ =  ATOM_STATE + "read";
	var ATOM_STATE_UNREAD =  ATOM_STATE + "kept-unread";
	var ATOM_STATE_FRESH =  ATOM_STATE + "fresh";
	var ATOM_STATE_READING_LIST =  ATOM_STATE + "reading-list";
	var ATOM_STATE_BROADCAST =  ATOM_STATE + "broadcast";
	var ATOM_STATE_STARRED =  ATOM_STATE + "starred";
	var ATOM_SUBSCRIPTIONS =  ATOM_STATE + "subscriptions";
	
	// API
	var API_EDIT_SUBSCRIPTION = "subscription/edit";
	var API_ADD_SUBSCRIPTION = "subscription/quickadd";
	var API_EDIT_TAG = "edit-tag";
	var API_DISABLE_TAG = "disable-tag";
	var API_LIST_PREFERENCE = "preference/list";
	var API_LIST_STREAM_PREFERENCE = "preference/stream/list";
	var API_LIST_STREAM_PREFERENCE_SET = "preference/stream/set";
	var API_LIST_SUBSCRIPTION = "subscription/list";
	var API_LIST_TAG = "tag/list";
	var API_LIST_UNREAD_COUNT = "unread-count";
	var API_TOKEN = "token";
	var API_SEARCH_ITEM_IDS = "search/items/ids";
	var API_STREAM_ITEMS_CONTENTS = "stream/items/contents";
	var API_STREAM_CONTENTS = "stream/contents";
	
	// Login Obj
	var LOGIN_DATA = new Object();
	LOGIN_DATA['service'] = "reader";
	LOGIN_DATA['source'] = "GRAir/a1";
	LOGIN_DATA['continue'] = "http://www.google.com/"

// Getters
//////////////////////////////
	
	// Update
	window["GRA"]["cons"]["URI_UPDATE"] = function() {return URI_UPDATE;}
	window["GRA"]["cons"]["URI_UPDATE_VERSIONS"] = function() {return URI_UPDATE + UPDATE_VERSIONS;}
	
	// Login/Logout
	window["GRA"]["cons"]["URI_LOGIN"] = function() {return URI_LOGIN;}
	window["GRA"]["cons"]["LOGIN_DATA"] = function() {return LOGIN_DATA;}
	window["GRA"]["cons"]["URI_LOGOUT"] = function() {return URI_LOGOUT;}

	// Atom
	window["GRA"]["cons"]["URI_ATOM"] = function() {return URI_ATOM;}
	window["GRA"]["cons"]["URI_ITEMS_READ"] = function() {return URI_ATOM + ATOM_STATE_READ;}
	window["GRA"]["cons"]["URI_ITEMS_UNREAD"] = function() {return URI_ATOM + ATOM_STATE_UNREAD;}
	window["GRA"]["cons"]["URI_ITEMS_FRESH"] = function() {return URI_ATOM + ATOM_STATE_FRESH;}
	window["GRA"]["cons"]["URI_ITEMS_STARRED"] = function() {return URI_ATOM + ATOM_STATE_STARRED;}
	window["GRA"]["cons"]["URI_ITEMS_BROADCAST"] = function() {return URI_ATOM + ATOM_STATE_BROADCAST;}
	window["GRA"]["cons"]["URI_ITEMS_READING_LIST"] = function() {return URI_ATOM + ATOM_STATE_READING_LIST;}
	window["GRA"]["cons"]["URI_ITEMS_TAG"] = function() {return URI_ATOM + ATOM_LABEL;}
		
	// API
	window["GRA"]["cons"]["URI_TOKEN"] = function() {return URI_API + API_TOKEN};
	window["GRA"]["cons"]["URI_TAG_LIST"] = function() {return URI_API + API_LIST_TAG};
	window["GRA"]["cons"]["URI_STREAM_PREFS"] = function() {return URI_API + API_LIST_STREAM_PREFERENCE};
	window["GRA"]["cons"]["URI_STREAM_PREFS_SET"] = function() {return URI_API + API_LIST_STREAM_PREFERENCE_SET};
	window["GRA"]["cons"]["URI_SUBSCRIPTION_LIST"] = function() {return URI_API + API_LIST_SUBSCRIPTION};
	window["GRA"]["cons"]["URI_SUBSCRIPTION_EDIT"] = function() {return URI_API + API_EDIT_SUBSCRIPTION};
	window["GRA"]["cons"]["URI_SUBSCRIPTION_ADD"] = function() {return URI_API + API_ADD_SUBSCRIPTION};
	window["GRA"]["cons"]["URI_UNREAD_COUNT"] = function() {return URI_API + API_LIST_UNREAD_COUNT + "?all=true"};
	window["GRA"]["cons"]["URI_EDIT_TAG"] = function() {return URI_API + API_EDIT_TAG};
	window["GRA"]["cons"]["URI_DISABLE_TAG"] = function() {return URI_API + API_DISABLE_TAG};
	window["GRA"]["cons"]["URI_SEARCH"] = function() {return URI_API + API_SEARCH_ITEM_IDS};
	window["GRA"]["cons"]["URI_CONTENTS"] = function() {return URI_API + API_STREAM_ITEMS_CONTENTS};
	window["GRA"]["cons"]["URI_CONT"] = function() {return URI_API + API_STREAM_CONTENTS};
	
	
})()