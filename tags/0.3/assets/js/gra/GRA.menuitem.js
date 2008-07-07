/*
GRA.menuitem
A slightly abstracted version of air.NativeMenuItem
http://livedocs.adobe.com/air/1/jslr/
*/

if (typeof GRA == "undefined") {var GRA = {};}

GRA.menuitem = function(title,callback,checked,disabled,separator,data) {
	this._title = title;
	this._callback = callback;
	this._checked = checked;
	this._disabled = disabled;
	this._separator = separator;
	this._data = data;
}

////////////////////////////////////////////////////////////////////
// GRA.menuitem Properties/Methods
////////////////////////////////////////////////////////////////////

GRA.menuitem.prototype = {
	get: function() {
		var item = new air.NativeMenuItem(this._title, Boolean(this._separator));
		item.enabled = (!Boolean(this._disabled));
		item.checked = (Boolean(this._checked));
		if (this._data) {
			item.data = this._data;
		}
		if (this._callback) {
			item.addEventListener(air.Event.SELECT,this._callback);
		}
		return item;
	}
}