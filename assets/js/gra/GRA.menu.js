/*
GRA.menu
A slightly abstracted version of air.NativeMenu
http://livedocs.adobe.com/air/1/jslr/
*/

if (typeof GRA == "undefined") {var GRA = {};}

GRA.menu = function(items) {
	this._menu = new air.NativeMenu();
	if (items) {
		for (var i=0; i < items.length; i++) {		
			this._menu.addItem(items[i].get());
		};
	}
}

////////////////////////////////////////////////////////////////////
// GRA.menu Properties/Methods
////////////////////////////////////////////////////////////////////

GRA.menu.prototype = {
	get: function() {
		return this._menu;
	},
	show: function(posX,posY) {
		this._menu.display(window.nativeWindow.stage,posX,posY);
	},
	addItem: function(title,callback,checked,disabled,separator,data) {
		var item = new GRA.menuitem(title,callback,checked,disabled,separator,data);
		this._menu.addItem(item.get());
	},
	addSubMenu: function(items,label) {
		var subMenu = new GRA.menu(items);
		this._menu.addSubmenu(subMenu.get(),label);
	}
}