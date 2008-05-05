/*
Application
The main application file for google reader air     
*/                                            

// Aliases
var console = air.Introspector.Console;

var Application = function() {

/*
-----------------------------------------------------------
	Private Properties
-----------------------------------------------------------
*/

	/* authentication objects 
	------------------------------------------ */
	
	// Instance of GRA.login (email,password,save)
	var _login = null;
	// Instance of GRA.session (auth cookie)
	var _session = null;
	// Instance of GRA.token (get/set token for editing)
	var _token = null;

	/* data objects 
	------------------------------------------ */
	
	// Instance of GRA.atom (the current feed)
	var _atom = null;
	// Instance of GRA.taglist
	var _tag_list = null;
	// Instance of GRA.feedlist
	var _feed_list = null;
	// Prompt Cludge: fixing the screwed up prompt support I've been experiencing:
	// http://www.adobe.com/cfusion/webforums/forum/messageview.cfm?forumid=75&catid=697&threadid=1359817
	var _promptCludge = null;
	
	/* window objects 
	------------------------------------------ */
	
	// The loading dialogue
	var _dialogue_loading = null;
	// The preferences dialogue
	var _dialogue_prefs = null;
	
	/* HTML elements 
	------------------------------------------ */

	// 3 main containers: feeds/items/item
	var _feeds_wrap = null;
	var _items_wrap = null;
	var _item_wrap = null;

	// tags (inside the _feeds_wrap)
	var _tags_wrap = null;

	// menubar
	var _refresh_btn = null;
	var _prev_btn = null;
	var _next_btn = null;
	var _mark_btn = null;
	var _search_form = null;

	// feeds tool bar
	var _add_btn = null;
	var _subtract_btn = null;

	// labels
	var _all_label = null;
	var _starred_label = null;
	var _shared_label = null;
	
/*
-----------------------------------------------------------
	Public Methods
-----------------------------------------------------------
*/

	return {

		/* 
		------------------------------------------
 		initialise
		------------------------------------------ */
		
		init: function() {
			
			// Set HTML Elements
			_feeds_wrap = $("#feeds-scroll-wrap");
			_items_wrap = $("#atom-table");
			_item_wrap = $("#item-inner-iframe");
			_tags_wrap = $("#tag-list");
			_refresh_btn = $("#refresh");
			_prev_btn = $("#prev");
			_next_btn = $("#next");
			_mark_btn = $("#mark");
			_search_form = $("#search-form");
			_add_btn = $("#add");
			_subtract_btn = $("#subtract");
			_all_label = $("#reading-list");
			_starred_label = $("#starred-items");
			_shared_label = $("#shared-items");			
			
			// Check fo updates
			GRA.update.init();			
			// Initiate the layout
			Layout.init();
			// Set up the event listeners
			Application.setupEventListeners();
			// Check for email/password in the encrypted store
			Application.checkLogin();
		},
		
		/* 
		------------------------------------------
 		event listeners
		
		set up event listeners
		------------------------------------------ */		
		setupEventListeners: function() {
			/* 
			main app clicks */
			// click on a feed
			_feeds_wrap.click(this.feedsClicked);
			// click on an item
			_items_wrap.click(this.itemsClicked);
			// click on an item detail
			_item_wrap.click(this.itemClicked);
			/* 
			menubar */
			// Refresh btn click
			_refresh_btn.click(this.getFeeds);
			// Previous item btn click
			_prev_btn.click(this.getPrevItem);
			// Next item btn click
			_next_btn.click(this.getNextItem);
			// Mark all read item click
			_mark_btn.click(this.readAllItems);
			// search form submit
			_search_form.submit(this.startSearch);
			/* 
			feeds toolbar clicks*/
			// add btn
			_add_btn.click(this.addMenu);
			// subtract btn
			_subtract_btn.click(this.subtractMenu);
		},
		
		/* 
		------------------------------------------
 		event handlers
		
		feeds clicked
		e:Event - the event object
		------------------------------------------ */
		feedsClicked: function(e) {			
			// the element clicked on
			var elm = $(e.target);
			// the feed div
			var div = e.target.nodeName == "DIV" ? elm : elm.parents("div:first");
			// href: the feed/tag id
			var id = div.attr("href");
			// classes: selected
			var isSelected = div.hasClass("selected");
			// the feed li
			var li = $(elm).parents("li:first");
			// expand collapse icons
			if (elm.hasClass("right")) {
				// expand
				Application.openTag(li,id);
			} else if (elm.hasClass("down")) {
				// collapse
				Application.closeTag(li,id);
			} else {
				// showItems by id
				if (id && !isSelected) {
					$("div.selected", _feeds_wrap).removeClass("selected");
					div.addClass("loading").addClass("selected");
					Application.getItems(id);
				}
			}
			e.stopPropagation();
		},
		
		/* items clicked
		e:Event - the event object
		------------------------------------------ */
		itemsClicked: function(e) {
			// the element clicked on
			var elm = e.target;
			// the item tr
			var tr = elm.nodeName == "TR" ? elm : $(elm).parents("tr:first");
			// if star was clicked
			if (elm.nodeName == "TD" && $(elm).hasClass("star")) {
				// you clicked on a star
				Application.starItem(tr);
			} else {
				// display item
				Application.showItem(tr);
			}
			e.stopPropagation();
		},
		
		/* item clicked
		e:Event - the event object
		------------------------------------------ */
		itemClicked: function(e) {
			// open links in browser
			if (e.target.nodeName == "A") {
				request = new air.URLRequest(e.target.href);
				air.navigateToURL(request);
				e.preventDefault();
			}
		},
		
		/* 
		------------------------------------------
 		Login

		Check Login
		------------------------------------------ */
		checkLogin: function() {
			/* If saved details */
			if (GRA.encryptedstore.savedLoginDetails()) {
				// Log in to application
				var details = GRA.encryptedstore.getLoginDetails();
				Application._login = new GRA.login(details['email'],details['pass'],details['remember']);
				LIB.httpr.postRequest(GRA.cons.URI_LOGIN(),Application.loggedIn,Application._login.data());
			} else {
				//Launch application dialogue
				Application._dialogue_prefs = new GRA.dialogue("account", Application);
				// open the dialogue and send onclose callback
				Application._dialogue_prefs.open(Application.checkLogin);
			}
		},
		
		/* Logged in
		e:Event - The login complete event
		------------------------------------------ */
		loggedIn: function(e) {
			Application._session = new GRA.session(e.target.data);
			GRA.encryptedstore.setLoginDetails(Application._login.getEmail(),Application._login.getPasswd(),Application._login.saveLogin());
			Application.getToken();
			Application.getFeeds();	
		},

		/* 
		------------------------------------------
 		Token
			
		Get Token
		------------------------------------------ */
		getToken: function() {
			LIB.httpr.getRequest(GRA.cons.URI_TOKEN(),Application.gotToken,Application._session.cookie());
		},

		/* Got Token
		e:Event - the getToken complete event
		------------------------------------------ */
		gotToken: function(e) {
			if (Application._token) {
				Application._token.setToken(e.target.data);
			} else {
				Application._token = new GRA.token(e.target.data);
			}
		},

		/* 
		------------------------------------------------------------------------------------------------
		Feeds - The list of feeds (The OPML)
		------------------------------------------------------------------------------------------------
 			
		Get Feeds
		------------------------------------------ */
		getFeeds: function() {
			Application.showLoading();
			LIB.httpr.getRequest(GRA.cons.URI_SUBSCRIPTION_LIST(),Application.gotFeeds,Application._session.cookie());
		},

		/* Got Feeds
		e:Event - the getFeeds complete event
		------------------------------------------ */
		gotFeeds: function(e) {
			Application._feed_list = new GRA.feedlist(e.target.data);	
			// display feed list
			$("#tag-list").html(Application._feed_list.HTML());
			// set feed list states
			LIB.httpr.getRequest(GRA.cons.URI_TAG_LIST(),Application.setLabelIds,Application._session.cookie());
			LIB.httpr.getRequest(GRA.cons.URI_UNREAD_COUNT(),Application.setUnreadCount,Application._session.cookie());
			LIB.httpr.getRequest(GRA.cons.URI_STREAM_PREFS(),Application.setFolderStatus,Application._session.cookie());
		},

		/* Set id attributes of labels: starred/shared
		e:Event - complete event
		------------------------------------------ */
		setLabelIds: function(e) {
			Application._tag_list = new GRA.taglist(e.target.data);
			_starred_label.attr("href",Application._tag_list.getStarredId());
			_shared_label.attr("href",Application._tag_list.getSharedId());
		},
		
		/* Set unread count
		e:Event - complete event
		------------------------------------------ */
		setUnreadCount: function(e) {
			var unreadCount = new GRA.unreadcount(e.target.data);
			// set 'All Items' Id
			_all_label.attr("href",unreadCount.getAllId());
			// each unreadcount object
			var feeds = unreadCount.feeds();
			$(feeds).each(function(i) {
				var unreadCountItem = new GRA.unreadcountitem(feeds[i]);
				var id = unreadCountItem.id();
				var count = unreadCountItem.count();
				// populate counts
				$("div[@href='" + id + "']", _feeds_wrap).each(function(i) {
					if (count > 0) {
						$("span:first", this).show().text(count);
					} else {
						$("span:first", this).hide().empty();
					}
				});
			});
		},
		
		/* Set folder open/close status
		e:Event - complete event
		------------------------------------------ */
		setFolderStatus: function(e) {
			var tagStatus = new GRA.tagstatus(e.target.data);
			var tags = tagStatus.tags();
			$(tags).each(function(i) {
				tagStatusItem = new GRA.tagstatusitem(tags[i]);
				if (tagStatusItem.isOpen()) {
					var li = $("div[@href='" + tagStatusItem.id() + "']:first", _tags_wrap).parents("li:first");
					Application.openTag(li);
				}
			})
			Application.hideLoading();
		},
		
		/* Open folder
		elm:Object - jquery li elm
		id:String - tag id
		------------------------------------------ */
		openTag: function(elm,id) {
			$("ul:first", elm).slideDown('normal', function() {
				elm.addClass("open");
				Layout.updateTagScrollBar();
			});
			if (id) {
				Application.sendTagStatus(id,true);
			}
		},
		
		/* Close folder
		elm:Object - jquery li elm
		id:String - tag id
		------------------------------------------ */
		closeTag: function(elm,id) {
			$("ul:first", elm).slideUp('normal', function() {
				elm.removeClass("open");
				Layout.updateTagScrollBar();
			});
			if (id) {
				Application.sendTagStatus(id,false);
			}
		},
		
		/* Send Tag status
		id:String - tag id
		isExpanded:Boolean - the tag is expanded
		------------------------------------------ */
		sendTagStatus: function(id,isExpanded) {
			var data = {
				T: Application._token.getToken(),
				k: "is-expanded",
				s: id,
				v: isExpanded
			}
			LIB.httpr.postRequest(GRA.cons.URI_STREAM_PREFS_SET(),Application.sentEdit,data,Application._session.cookie());	
		},

		/* 
		------------------------------------------------------------------------------------------------
		Items - The List of Articles (RSS Feed)
		------------------------------------------------------------------------------------------------

		Get Items
		id:String - the id of the tag, label or feed
		------------------------------------------ */
		getItems: function(id) {
			var url = GRA.cons.URI_ATOM() + escape(id);
			LIB.httpr.getRequest(url,Application.gotItems,Application._session.cookie());
		},
		
		/* Got Items
		e:Event - getItems complete event
		------------------------------------------ */
		gotItems: function(e) {
			Application._atom = new GRA.atom(e.target.data);
			_items_wrap.html(Application._atom.HTML());
			Application.hideLoading(true);
			Layout.updateItemsScrollBar();
		},
		
		/* Get More Items
		------------------------------------------ */
		getMoreItems: function() {
			var id = Application._atom.id();
			var continuation = Application._atom.continuation();
			var url = GRA.cons.URI_CONT() + "/" + escape(id) + "?c=" + continuation + "&r=n&n=40";
			LIB.httpr.getRequest(url,Application.gotMoreItems,Application._session.cookie());
		},
		
		/* Got More Items
		e:Event - getMoreItems complete event
		------------------------------------------ */
		gotMoreItems: function(e) {
			var json = LIB.json.parse(e.target.data);
			Application._atom.setData(json);
			_items_wrap.append(Application._atom.HTML());
			Layout.updateItemsScrollBar();
			$("#items-scroll-wrap").scroll(Layout.itemsScrollHandler);
		},

		/* 
		------------------------------------------
 		Search
		
		Start Search
		e:Event - search form onsubmit event
		------------------------------------------ */
		startSearch: function(e) {
			$(e.target).addClass("loading");
			var searchTerm = e.target.q.value;
			var searchUrl = GRA.cons.URI_SEARCH() + "?num=50&q=" + searchTerm;
			LIB.httpr.getRequest(searchUrl,Application.getSearchResults,Application._session.cookie());	
			e.preventDefault();
		},
		
		/* Get search results
		e:Event - startSearch event object
		------------------------------------------ */
		getSearchResults: function(e) {
			var searchResults = new GRA.searchresults(e.target.data);
			var searchResultItems = searchResults.ids();
			var data = new Object();
			data['T'] = Application._token.getToken();
			data['output'] = "xml";
			data['i'] = new Array();
			for (var i=0; i < searchResultItems.length; i++) {
				var id = $(searchResultItems[i]).text();
				data['i'].push(id);
			};
			LIB.httpr.postRequest(GRA.cons.URI_CONTENTS(),Application.gotSearchResults,data,Application._session.cookie());
		},
		
		/* Display the search results
		e:Event - getSearchResults event object
		------------------------------------------ */
		gotSearchResults: function(e) {
			Application._atom = new GRA.atom(LIB.json.parse(e.target.data));	
			_items_wrap.html(Application._atom.HTML());
			Layout.updateItemsScrollBar();
			Application.hideLoading(true);
		},

		/* 
		------------------------------------------
 		Items status (Add/Remove Tags/Feeds)
		
		Shows the 'Add' Menu to Add Tags/Feeds
		e:Event - the click event of the add button
		------------------------------------------ */
		addMenu: function(e) {
			// create menu
			var menu = new GRA.menu();

			// if there is a selected feed (not tag)
			if ($(".selected", _tags_wrap).length > 0 && !$(".selected", _tags_wrap).hasClass("folder")) {
				// the feed id
				var id = $(".selected:first", _tags_wrap).attr("href");
				var feedItem = Application._feed_list.getFeedById(id);
				var tags = Application._tag_list.tags();
				// create an array for the menu items
				var items = new Array();
				var data = new Object();
				data['feedId'] = id;
				items.push(new GRA.menuitem("Create New Tag",Application.createTag,false,false,false,data));
				items.push(new GRA.menuitem("",false,false,false,true));
				for (var i=0; i < tags.length; i++) {
					var tagObj = new GRA.tag(tags[i]);
					var title = tagObj.title();
					var callback = Application.addTag;
					var checked = feedItem.hasTag(title);
					data['tagId'] = tagObj.id();
					items.push(new GRA.menuitem(title,callback,checked,false,false,data));
				};
				menu.addSubMenu(items,"Add/Remove Tag");
			} else {
				menu.addItem("Add/Remove Tag",false,false,true);
			}
			menu.addItem("Add Feed",Application.addFeed);
			menu.show(e.clientX,e.clientY);
			e.preventDefault();
		},
		
		/* Shows the 'Remove' Menu to Delete Tags, Unsubscribe from feeds
		e:Event - the click event of the subtract button
		------------------------------------------ */
		subtractMenu: function(e) {
			var menu = new GRA.menu();
			if ($(".selected", _tags_wrap).length > 0) {
				var data = new Object();
				// TO DO: remove the total from span
				data['title'] = $(".selected:first", _tags_wrap).text();
				// Delete Tag Menu
				if ($(".selected", _tags_wrap).hasClass("folder")) {
					data['tagId'] = $(".selected:first", _tags_wrap).attr("href");
					menu.addItem("Delete Tag",Application.deleteTag,false,false,false,data);
					menu.addItem("Delete Feed",false,false,true);
				} else {
				// Delet Feed Menu
					data['feedId'] = $(".selected:first", _tags_wrap).attr("href");
					menu.addItem("Delete Tag",false,false,true);
					// disabled until I can work out why I get permission denied
					menu.addItem("Delete Feed",Application.deleteFeed,false,true,false,data);
				}
			} else {
				menu.addItem("Delete Tag",false,false,true);
				menu.addItem("Delete Feed",false,false,true);
			}
			menu.show(e.clientX,e.clientY);
			e.preventDefault();	
		},
		
		/* Delete's the Tag
		e:Event - the click event of the menu item
		------------------------------------------ */
		deleteTag: function(e) {
			var bool = confirm("Are you sure you want to delete: " + e.target.data['title']);
			if (bool) {
				var data =  {
					T: Application._token.getToken(),
					ac: "disable-tags",
					i: null,
					s: e.target.data['tagId']
				}
				LIB.httpr.postRequest(GRA.cons.URI_DISABLE_TAG(),Application.sentEdit,data,Application._session.cookie());
			}
		},

		/* Unsubscribe's from the Feed
		e:Event - the click event of the menu item
		------------------------------------------ */
		deleteFeed: function(e) {
			var bool = confirm("Are you sure you want to delete: " + e.target.data['title']);
			if (bool) {
				var data = {
					T: Application._token.getToken(),
					ac: "unsubscribe",
					i: null,
					s: e.target.data['feedId']
				}
				// TO DO: CHECK THIS URL
				LIB.httpr.postRequest(GRA.cons.URI_DISABLE_TAG(),Application.sentEdit,data,Application._session.cookie());
			}
		},
		
		/* Adds a tag to the Feed
		e:Event - the click event of the menu item
		------------------------------------------ */
		addTag: function(e) {
			var add = false;
			var remove = false;
			e.target.checked ? remove = e.target.data['tagId'] : add = e.target.data['tagId'];
			Application.editFeedTag(e.target.data['feedId'], add, remove);
		},
		
		/* Creates a tag, then adds it to the feed
		e:Event - the click event of the menu item
		------------------------------------------ */
		createTag: function(e) {
			// need to send
			// feedId: e.target.data['feedId']
			_promptCludge = null;
			var tagPrompt = new GRA.dialogue("prompt");		
			tagPrompt.open(Application.doPromptCludge,e.target.data['feedId']);
		},
		
		/* Gets a feed URL, the subscribes to it
		TO DO: Validate URL
		e:Event - the click event of the menu item
		------------------------------------------ */
		addFeed: function(e) {
			_promptCludge = null;
			var feedPrompt = new GRA.dialogue("prompt");
			feedPrompt.open(doPromptCludge);
		},
		
		/* 
		Prompt Returned from GRA.dialogue.
		str:String - the value returned from the prompt dialogue
		id:String - the Feed id (required if editing tag)
		------------------------------------------ */
		setPromptCludge: function(str,id) {
			_promptCludge = {
				str: str,
				id: id
			}
		},
		
		/* Executes on prompt close and picks up cludge object
		------------------------------------------ */
		doPromptCludge: function() {
			// get values from _promptCludge Object
			var str = _promptCludge['str'];
			var id = _promptCludge['id'];
			alert(str + " : " + id);
			// if there is a value for id, the prompt was for a new tag
			if (id) {
				Application.editFeedTag(id,"user/-/label/" + str);
			} else {
				// else it was for a new subscription
				data = {
					T: Application._token.getToken(),
					quickadd: str
				}
				LIB.httpr.postRequest(GRA.cons.URI_SUBSCRIPTION_ADD(),Application.sentEdit,data,Application._session.cookie());
			}
		},
		
		/* Gets a feed URL, then subscribes to it
		id:String - The id of the Feed
		add:String - The Tag Id to add
		remove:String - The Tag Id to remove
		------------------------------------------ */
		editFeedTag: function(id,add,remove) {
			data = {
				T: Application._token.getToken(),
				ac: "edit",
				i: null,
				s: id
			}
			add ? data['a'] = add : data['r'] = remove;
			LIB.httpr.postRequest(GRA.cons.URI_SUBSCRIPTION_EDIT(),Application.sentEdit,data,Application._session.cookie());
		},
		
		/* 
		------------------------------------------
 		Items Scroll

		Handle Items Scroll
		e:Event - the scroll event of items
		------------------------------------------ */
		itemsScrollHandler: function(e) {
			var height = e.target.scrollHeight;
			var amount = e.target.offsetTop - e.target.parentNode.offsetHeight;
			// if there's no items left
			if (height + amount == 0) {
				$(e.target).unbind("scroll");
				Application.getMoreItems();
			}
		},
		
		/* 
		------------------------------------------------------------------------------------------------
		Item - The Article itself
		------------------------------------------------------------------------------------------------

		Get the next item
		------------------------------------------ */
		getNextItem: function() {
			// get the currently selected item
			var current = $("tr.selected:first", _items_wrap);
			var next;
			// if no item is selected, choose the top item
			if (!current.attr("id")) {
				next = $("tr:first", _items_wrap);
			} else {
				// else choose the next item
				next = current.next("tr");
			}
			if(!next.attr("id")) {return false;}
			Application.showItem(next);
		},

		/* Get the previous item
		------------------------------------------ */
		getPrevItem: function() {
			// get the currently selected item
			var current = $("tr.selected:first", _items_wrap);
			var prev;
			if (!current.attr("id")) {
				return false;
			} else {
				prev = current.prev("tr");
			}
			if(!prev.attr("id")) {return false;}
			Application.showItem(prev);
		},
		
		/* Show the item
		elm:Object - jQuery Object of selected item
		------------------------------------------ */
		showItem: function(elm) {
			Layout.updateScroll(elm);
			var id = elm.attr("id");
			var atomEntry = new GRA.atomentry(Application._atom.getItemById(id));
			Application.readItem(elm,atomEntry);	
			_item_wrap.html(atomEntry.HTML());
			Layout.updateItemScrollBar();
		},

		/* 
		------------------------------------------
 		Item status (Star/Read)

		star item
		elm:Object - jquery tr elm
		id:String - the id of the tag, label or feed
		------------------------------------------ */
		starItem: function(elm) {
			var id = elm.attr("id");
			var atomEntry = new GRA.atomentry(Application._atom.getItemById(id));
			var atomid = atomEntry.id();
			var source = atomEntry.sourceId();
			var add = elm.hasClass("starred") ? null : "user/-/state/com.google/starred";
			var remove = !elm.hasClass("starred") ? null : "user/-/state/com.google/starred";
			Application.sendItemStatus(atomid,source,add,remove);
			elm.toggleClass("starred");
		},
		
		/* read item
		elm:Object - jquery tr elm
		id:String - the id of the tag, label or feed
		------------------------------------------ */
		readItem: function(elm,atomEntry) {
			$("tr", _items_wrap).removeClass("selected");
			elm.addClass("selected").addClass("read");
			if (!atomEntry.isRead()) {
				var add = "user/-/state/com.google/read";
				var id = atomEntry.id();
				var source = atomEntry.sourceId();
				Application.sendItemStatus(id,source,add);
			}
		},
		
		/* read all items
		------------------------------------------ */
		readAllItems: function() {
			// go through all items that are NOT read
			$("tr:not(.read)", _items_wrap).each(function(i) {
				var id = $(this).attr("id");
				var atomEntry = new GRA.atomentry(Application._atom.getItemById(id));
				Application.readItem($(this),atomEntry);
			});
		},
		
		/* Send Item status
		id:String - item id
		source:String - the id of items feed
		add:String - the google state label to add
		remove:String - the google state label to remove
		------------------------------------------ */
		sendItemStatus: function(id,source,add,remove) {
			var data = {
				T: Application._token.getToken(),
				ac: "edit-tags",
				async: "true",
				i: id,
				s: source
			}
			add ? data['a'] = add : data['r'] = remove;
			LIB.httpr.postRequest(GRA.cons.URI_EDIT_TAG(),Application.sentEdit,data,Application._session.cookie());
		},
		
		/* 
		------------------------------------------
		edit response handler
		
		sentEdit
		e:Event - complete event
		------------------------------------------ */		
		sentEdit: function(e) {
			air.trace(e.target.data);
		},
		
		/* 
		------------------------------------------
		loading
		
		show loading indicator
		------------------------------------------ */
		showLoading: function() {
			this._dialogue_loading = new GRA.dialogue("loading");
			this._dialogue_loading.open();
		},
		
		/* hide loading indicator
		isIcon:Boolean - the loading indicator is an icon
		------------------------------------------ */
		hideLoading: function(isIcon) {
			if (isIcon) {
				$(".loading").removeClass("loading");
			} else {
				Application._dialogue_loading.close();
			}
		}
		
	}

}();
