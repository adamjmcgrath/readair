/**
 * @fileoverview Abstraction of the Adobe air nativemenuitem class
 * @author Adam McGrath
 * Supports windows, mac native menus
 */

/**
 * @namespace GRA
 */
var GRA = window.GRA || {};

/**
 * Constructor of the GRA.nativemenuitem class.
 * @constructor
 * @param {String|Boolean} label The label of the menu item, or false if separator. 
 * @param {String} key The items keyboard shortcut. 
 * @param {Function} callback The function to call on the items SELECT event. 
 * @param {Boolean} checked true if the item should be checked. 
 * @param {Boolean} disabled true if the item should be disabled. 
 * @param {Object} data Miscelaneous data object to attach to item. 
 * @return {Object} An instance of the GRA.nativemenuitem class.
 */
GRA.nativemenuitem = function(label,key,callback,checked,disabled,data) {
	this._label = label;
	this._key = key;
	this._callback = callback;
	this._checked = checked;
	this._disabled = disabled;
	this._data = data;
	this._item = label ? new air.NativeMenuItem(label) : new air.NativeMenuItem("",true);
	if (this._callback) {this._item.addEventListener(air.Event.SELECT,callback);}
	if (this._checked) {this._item.checked = true;}
	if (this._disabled) {this._item.disabled = true;}
	if (this._data) {this._item.data = data;}
}

GRA.nativemenuitem.prototype = {
	
	/**
	 * Get's the air native menu item
	 * @return {air.NativeMenuItem} Instance of NativeMenuItem item class.
	 */
	getItem: function() {
		return this._item;
	},
	
	clone: function() {
		return (new GRA.nativemenuitem(this._label,this._key,this._callback,this._checked,this._disabled,this._data)).getItem();
	}

}