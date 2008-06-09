/*
Application
The main application file for google reader air     
*/                                            

// Aliases
// var console = air.Introspector.Console;

var Application = function() {

/*
-----------------------------------------------------------
	Private Properties
-----------------------------------------------------------
*/

	/* tray icon
	------------------------------------------ */
	var _tray = null;
	var _trayMenu = null;

	/* authentication objects 
	------------------------------------------ */
	
	// Instance of GRA.login (email,password,save)
	var _login = null;
	// Cookie
	var _cookie = null;
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
	
	/* window objects 
	------------------------------------------ */
	
	// The loading dialogue
	var _dialogue_loading = null;
	// The preferences dialogue
	var _dialogue_prefs = null;
	
	/* timers
	------------------------------------------ */
	
	// Refresh
	var _refresh_timer = null;
	// Token
	var _token_timer = null;
	
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
	
		// operation system
		os: {
			windows: false,
			macos: false,
			linux: false
		},

		/* 
		------------------------------------------
 		initialise
		------------------------------------------ */
		
		init: function() {
			// operation system
			Application.osCheck();
			
			// init window position
			Application.initPosition();	
			
			// add application menu for MacOS
			if ( Application.os.macos )
				Application.initMenu();
			
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

			// Check for updates
			GRA.update.init();	
			// Initiate the layout
			Layout.init();
			// Set up the event listeners
			Application.setupEventListeners();
			// Tray
			Application.initTray();
			// Set theme css
			Application.updateTheme();
			// Check for email/password in the encrypted store
			Application.checkLogin();
		},
		
		/*
		 * initialize window position
		 */
		initPosition: function() {
			var position = GRA.encryptedstore.getWindowPosition();

			if (position.maximized) {
				air.NativeApplication.nativeApplication.activeWindow.maximize();
			} else {
				air.NativeApplication.nativeApplication.activeWindow.x = position.x;
				air.NativeApplication.nativeApplication.activeWindow.y = position.y;
				air.NativeApplication.nativeApplication.activeWindow.width = position.width;
				air.NativeApplication.nativeApplication.activeWindow.height = position.height;
			}
		},
		
		/*
		------------------------------------------
 		tray icon creation
		------------------------------------------ */
		
		trayIconLoadComplete: function(event) {
			air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
		},
		
		initTray: function() {
			_tray = new air.Loader();
			_trayMenu = new air.NativeMenu();
			
			var traySupported = false;
			
		    if (air.NativeApplication.supportsDockIcon) {
				traySupported = true;
		        _tray.contentLoaderInfo.addEventListener(air.Event.COMPLETE, Application.trayIconLoadComplete);
		        _tray.load(new air.URLRequest("/icon/ReadAir_128.png"));
		        air.NativeApplication.nativeApplication.icon.menu = _trayMenu;
		    }
		
		    if (air.NativeApplication.supportsSystemTrayIcon) {
				traySupported = true;
		        _tray.contentLoaderInfo.addEventListener(air.Event.COMPLETE, Application.trayIconLoadComplete);
		        _tray.load(new air.URLRequest("/icon/ReadAir_16.png"));
		        air.NativeApplication.nativeApplication.icon.tooltip = "ReadAIR";
		        air.NativeApplication.nativeApplication.icon.menu = _trayMenu;
		    }
			
			if ( traySupported ) {
				var separator = new air.NativeMenuItem("A", true);
			
				// preferences item
				var preferencesItem = _trayMenu.addItem(new air.NativeMenuItem("Preferences"));
				
				preferencesItem.addEventListener(air.Event.SELECT,function(event){
					Application._dialogue_prefs = new GRA.dialogue("general");
					Application._dialogue_prefs.open();
			    });
				
				// -- separator
				_trayMenu.addItem(separator);
				
				var logoutItem = _trayMenu.addItem(new air.NativeMenuItem("Logout"));
				
				logoutItem.addEventListener(air.Event.SELECT, Application.logout);
				
				// exit item
				var exitItem = _trayMenu.addItem(new air.NativeMenuItem("Exit"));
				
			    exitItem.addEventListener(air.Event.SELECT,function(event){
					air.NativeApplication.nativeApplication.icon.bitmaps = [];
					air.NativeApplication.nativeApplication.exit();
			    });
			}
		},
		
		/*
		------------------------------------------
 		application menu (just for macOs)
		------------------------------------------ */
		
		initMenu: function() {
			if (air.NativeApplication.supportsMenu) {
				var menu = air.NativeApplication.nativeApplication.menu.getItemAt(0).submenu;

				// separator
				menu.addItemAt(new air.NativeMenuItem("", true), 1);

				// prefItem
				var prefItem = menu.addItemAt(new air.NativeMenuItem("Preferences"), 2);
				prefItem.keyEquivalent = ',';
				prefItem.addEventListener(air.Event.SELECT, function(){
					Application._dialogue_prefs = new GRA.dialogue("general");
					Application._dialogue_prefs.open();
				});

				// log out Item
				var loItem = menu.addItemAt(new air.NativeMenuItem("Logout"), 3);
				loItem.addEventListener(air.Event.SELECT, Application.logout);
				
				//separator
				menu.addItemAt(new air.NativeMenuItem("", true), 4);
			}
		},
		
		/* 
		------------------------------------------
 		themes
		------------------------------------------ */
		updateTheme: function() {
			var style = GRA.encryptedstore.theme();
			
			if ( style == "" )
			{
				if ( Application.os.windows )
					style = "windows";
				else
					style = "macos";
			}
			
			$("#theme", "html head").attr( { "href" : "assets/css/themes/" + style + ".css" } );
		},
		
		statusText: function(text) {
			$("div", "#status-bar").fadeOut( "fast", function() {
				if ( text != '' ) 
					$(this)
						.html(text)
						.fadeIn( "fast" );
			} );
		},
		
		/* 
		------------------------------------------
 		event listeners
		
		set up event listeners
		------------------------------------------ */		
		setupEventListeners: function() {
			// update items area when resizing a window
			$(window).resize(Layout.updateScrollBars);
			
			/* main app clicks */
			// click on a feed
			_feeds_wrap.click(this.feedsClicked);
			// click on an item
			_items_wrap.click(this.itemsClicked);
			// click on an item detail
			_item_wrap.click(this.itemClicked);
			
			/* menubar */
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
			
			/* feeds toolbar clicks*/
			// add btn
			_add_btn.click(this.addMenu);
			// subtract btn
			_subtract_btn.click(this.subtractMenu);
			
			/* keypress */
			$(document).keypress(this.shortcuts);

			/* on window closing */
			air.NativeApplication.nativeApplication.activeWindow.addEventListener(air.Event.CLOSING, Application.windowClosing);
			/* on application closing */
			air.NativeApplication.nativeApplication.addEventListener(air.Event.EXITING, Application.closing);
		},
		
		/* 
		------------------------------------------
 		timers
		
		setUpTimers:Void
		------------------------------------------ */		
		setUpTimers: function() {
			if (Application._refresh_timer) {
				clearTimeout(Application._refresh_timer);
			}
			// 1 min = 60000 milliseconds
			var mins = 60000;
			var refreshTime = GRA.encryptedstore.refreshTime();
			// Refresh Feeds
			if (refreshTime > 0) {
				Application._refresh_timer = setTimeout(Application.Application.getFeeds,refreshTime*mins);
			}
			// Token (every 2 mins)
			if (!Application._token_timer) {
				Application._token_timer = setTimeout(Application.getToken,2*mins);
			}
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
			if (e.target.nodeName == "A" || $(e.target).parents("a").length > 0) {
				request = new air.URLRequest(e.target.href || $(e.target).parents("a")[0].href);
				air.navigateToURL(request);
			}
			e.preventDefault();
		},
		
		/* shortcuts:Void
		e:Event - keypress event
		------------------------------------------ */
		shortcuts: function(e) {
			// don't fire keyboard shortcuts when in input element
			if (e.target.nodeName == "INPUT") {return true;}
			switch (e.which) {
			// j - next
			case 106:
				return Application.getNextItem();
			// k - previous
			case 107:
				return Application.getPrevItem();
            // r - refresh
            case 114:
                return Application.getFeeds();
            // shift + a - mark all as read
            case 65:
                return Application.readAllItems();
			default:
				// do nothing
			}
		},
		
		/* closing:Void
		e:Event - the window closing event
		------------------------------------------ */
		windowClosing: function(e) {
			// save position
			if ( GRA.encryptedstore.savePosition() )
				GRA.encryptedstore.setWindowPosition(
					air.NativeApplication.nativeApplication.activeWindow.x,
					air.NativeApplication.nativeApplication.activeWindow.y,
					air.NativeApplication.nativeApplication.activeWindow.width,
					air.NativeApplication.nativeApplication.activeWindow.height,
					air.NativeApplication.nativeApplication.activeWindow.displayState == air.NativeWindowDisplayState.MAXIMIZED
				);
		},
		
		/* closing:Void
		e:Event - the app closing event
		------------------------------------------ */
		closing: function(e) {
			var bool = GRA.encryptedstore.saveLogin() == "false";
			if (bool) {
				GRA.encryptedstore.removeLoginDetails();
			}
		},

		osCheck: function() {
			// operating system check
			var osString = air.Capabilities.os;
			
			if (osString.indexOf('Windows') != -1) {
				Application.os.windows = true;
			} else  if (osString == 'MacOS') {
				Application.os.macos = true;
			} else {				
				Application.os.linux = true;
			}
		},

		/* 
		------------------------------------------
 		Login

		Check Login
		------------------------------------------ */
		checkLogin: function() {
			/* If saved details */
			if (GRA.encryptedstore.getItem("cookie")) {
				_cookie = GRA.encryptedstore.getItem("cookie");
				Application.loggedIn();
			} else {
				if (confirm("You are not currently Logged in, would you like to log in?")) {
					//Launch application dialogue
					Application._dialogue_prefs = new GRA.dialogue("account", Application);
					// open the dialogue and send onclose callback
					Application._dialogue_prefs.open(Application.checkLogin);
				}
			}
		},
		
		/* Logged in
		------------------------------------------ */
		loggedIn: function() {
			Application.getToken();
			Application.getFeeds();
		},
		
		/* Log out
		------------------------------------------ */
		logout: function() {
			GRA.encryptedstore.removeLoginDetails();
			LIB.httpr.postRequest(GRA.cons.URI_LOGOUT(),Application.loggedOut);
		},
		
		/* Logged out
		------------------------------------------ */
		loggedOut: function() {
			//Launch application dialogue
			Application._dialogue_prefs = new GRA.dialogue("account", Application);
			// open the dialogue and send onclose callback
			Application._dialogue_prefs.open(Application.checkLogin);
		},

		/* 
		------------------------------------------
 		Token
			
		Get Token
		------------------------------------------ */
		getToken: function() {
			LIB.httpr.getRequest(GRA.cons.URI_TOKEN(),Application.gotToken,_cookie);
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
			LIB.httpr.getRequest(GRA.cons.URI_SUBSCRIPTION_LIST(),Application.gotFeeds,_cookie);
		},

		/* Got Feeds
		e:Event - the getFeeds complete event
		------------------------------------------ */
		gotFeeds: function(e) {
			Application._feed_list = new GRA.feedlist(e.target.data);	
			// display feed list
			$("#tag-list").html(Application._feed_list.HTML());
			// set feed list states
			LIB.httpr.getRequest(GRA.cons.URI_TAG_LIST(),Application.setLabelIds,_cookie);
			Application.getUnreadCount();
			LIB.httpr.getRequest(GRA.cons.URI_STREAM_PREFS(),Application.setFolderStatus,_cookie);
		},

		/* Set id attributes of labels: starred/shared
		e:Event - complete event
		------------------------------------------ */
		setLabelIds: function(e) {
			Application._tag_list = new GRA.taglist(e.target.data);
			_starred_label.attr("href",Application._tag_list.getStarredId());
			_shared_label.attr("href",Application._tag_list.getSharedId());
		},
		
		/* getUnreadCount:Void
		------------------------------------------ */
		getUnreadCount: function() {
			LIB.httpr.getRequest(GRA.cons.URI_UNREAD_COUNT(),Application.setUnreadCount,_cookie);
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
						$("span:first", this).fadeIn().text(count);
					} else {
						$("span:first", this).fadeOut().empty();
					}
				});
			});
		},
		
		/* Set unread count
		id:String - the id of the feed
		reduce:Number - the number to reduce the count by default 1
		------------------------------------------ */
		setUnreadCountById: function(id,reduce) {
			if (!reduce) { reduce = 1 };
			$("div[@href='" + id + "'], #reading-list", _feeds_wrap).each(function(i) {
				count = ($("span:first", this).text()) - reduce;
				if (count > 0) {
					$("span:first", this).fadeIn().text(count);
				} else {
					$("span:first", this).fadeOut().empty();
				}
			});
			
			// and tag read items count too
			$("div[@href='" + id + "']", _feeds_wrap).each(function(i) {
				// ugly, but works
				var tmp = $(this).parent().parent().parent();
				
				// special check for non-tagged elements
				if ( !tmp.is("div") ) {				
					tmp = tmp.parent();

					count = ($("span:first", tmp).text()) - reduce;
					if (count > 0) {
						$("span:first", tmp).fadeIn().text(count);
					} else {
						$("span:first", tmp).fadeOut().empty();
					}
				}
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
			LIB.httpr.postRequest(GRA.cons.URI_STREAM_PREFS_SET(),Application.sentEdit,data,_cookie);	
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
			LIB.httpr.getRequest(url,Application.gotItems,_cookie);
		},
		
		/* Got Items
		e:Event - getItems complete event
		------------------------------------------ */
		gotItems: function(e) {
			Application._atom = new GRA.atom(e.target.data);
			_items_wrap.html(Application._atom.HTML());
			Application.hideLoading(true);
			Layout.updateItemsScrollBar();
			
			// update stripes
			$("#atom-table tr:even").addClass("stripe");
		},
		
		/* Get More Items
		------------------------------------------ */
		getMoreItems: function() {
			var id = Application._atom.id();
			var continuation = Application._atom.continuation();
			var url = GRA.cons.URI_CONT() + "/" + escape(id) + "?c=" + continuation + "&r=n&n=10";
			LIB.httpr.getRequest(url,Application.gotMoreItems,_cookie);
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
			// update stripes
			$("#atom-table tr:even").addClass("stripe");
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
			LIB.httpr.getRequest(searchUrl,Application.getSearchResults,_cookie);	
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
			LIB.httpr.postRequest(GRA.cons.URI_CONTENTS(),Application.gotSearchResults,data,_cookie);
		},
		
		/* Display the search results
		e:Event - getSearchResults event object
		------------------------------------------ */
		gotSearchResults: function(e) {
			Application._atom = new GRA.atom(LIB.json.parse(e.target.data));	
			_items_wrap.html(Application._atom.HTML());
			Layout.updateItemsScrollBar();
			Application.hideLoading(true);
			
			// update stripes
			$("#atom-table tr:even").addClass("stripe");
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
					menu.addItem("Delete Feed",Application.deleteFeed,false,false,false,data);
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
				LIB.httpr.postRequest(GRA.cons.URI_DISABLE_TAG(),Application.sentFeedEdit,data,_cookie);
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
				LIB.httpr.postRequest(GRA.cons.URI_SUBSCRIPTION_EDIT(),Application.sentFeedEdit,data,_cookie);
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
			var str = prompt("Please enter the name of the tag:");
			if (str) {
				Application.editFeedTag(e.target.data['feedId'],"user/-/label/" + str);
			}
		},
		
		/* Gets a feed URL, the subscribes to it
		TO DO: Validate URL
		e:Event - the click event of the menu item
		------------------------------------------ */
		addFeed: function(e) {
			var str = prompt("Please enter full url of feed:");
			if (str) {
				data = {
					T: Application._token.getToken(),
					quickadd: str
				}
				LIB.httpr.postRequest(GRA.cons.URI_SUBSCRIPTION_ADD(),Application.sentFeedEdit,data,_cookie);
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
			LIB.httpr.postRequest(GRA.cons.URI_SUBSCRIPTION_EDIT(),Application.sentFeedEdit,data,_cookie);
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
			// weird behavior with scroll height?
			//if (height + amount == 0) {
			if (height + amount < 5) {
				$(e.target).unbind("scroll");
				// Do continuation
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
			
			$("a", _item_wrap)
					.mouseover( function() {
						Application.statusText( $(this).attr( "href" ) );
					} )
					.mouseout( function() {
						Application.statusText( "" );
					} );
			
			$("img",_item_wrap).load(Layout.updateItemScrollBar);
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
		readItem: function(elm, atomEntry) {
			$("tr", _items_wrap).removeClass("selected");
			elm.addClass("selected");
			if (!elm.hasClass("read")) {
				var add = "user/-/state/com.google/read";
				var id = atomEntry.id();
				var source = atomEntry.sourceId();
				Application.setUnreadCountById(source);
				Application.sendItemStatus(id, source, add);
				elm.addClass("read");
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
			LIB.httpr.postRequest(GRA.cons.URI_EDIT_TAG(),Application.sentEdit,data,_cookie);
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
		
		/*sentFeedEdit
		e:Event - complete event
		------------------------------------------ */		
		sentFeedEdit: function(e) {
			Application.getFeeds();
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
