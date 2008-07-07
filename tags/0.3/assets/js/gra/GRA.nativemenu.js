/**
 * @fileoverview Abstraction of the Adobe air native menu class
 * @author Adam McGrath
 * Creates cross platform menu's. Usage:
 * new GRA.nativemenu(type);
 */

/**
 * @namespace GRA
 */
var GRA = window.GRA || {};

/**
 * Constructor of the GRA.nativemenu class
 * @constructor
 * @param {String} type The type of menu you want to create dock(mac), application(mac), window(PC), systemtray(PC)
 * @param {String} label The label of the menu
 * @param {Array} items Array of GRA.nativemenuitem instances
 * @return {Object} Instance of the GRA.nativemenu class.
 */
GRA.nativemenu = function(type,label,items) {
	this._items = items;
	this._type = type;
	this._label = label;
	this._menu = new air.NativeMenu();
	if (type == GRA.nativemenu.APP) {
		this._doAppMenu();
	} else if (type == GRA.nativemenu.DOCK) {
		this._doDockMenu();
	} else if (type == GRA.nativemenu.SYST) {
		this._doSystMenu();
	}
}

GRA.nativemenu.DOCK = "dock";
GRA.nativemenu.APP = "application";
GRA.nativemenu.WIN = "window";
GRA.nativemenu.SYST = "systemtray";

GRA.nativemenu.prototype = {
	_doAppMenu: function() {
		if (this._label == "ReadAir") {
			this._menu = air.NativeApplication.nativeApplication.menu.getItemAt(0).submenu;
			var items = this._items;
			for (var i=0; i < items.length; i++) {
				var j = i+1;
				this._menu.addItemAt(items[i],j);
			};
		}
	},
	_doDockMenu: function() {
		var items = this._items;
		for (var i=0; i < items.length; i++) {
			this._menu.addItem(items[i]);
		};
		air.NativeApplication.nativeApplication.icon.menu = this._menu;
	},
	_doSystMenu: function() {
		var items = this._items;
		for (var i=0; i < items.length; i++) {
			air.trace(items[i]);
			this._menu.addItem(items[i]);
		};
		air.NativeApplication.nativeApplication.icon.tooltip = this._label;
		air.NativeApplication.nativeApplication.icon.menu = this._menu;
	}
}

