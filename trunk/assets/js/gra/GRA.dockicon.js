/**
 * @fileoverview Deals with the applications dock icon
 * @author Adam Mcgrath
 * Adds notifications to the Dock Icon
 */

/**
 * @namespace GRA
 */
var GRA = window.GRA || {};

/**
 * GRA.dockicon class.
 * @param {Object} param The atom feed data in JSON or XML format. 
 * @return {Object} Public methods/properties.
 */
GRA.dockicon = function() {
	
	var BMPs = new Array();
	var icon = air.NativeApplication.nativeApplication.icon;
	var count = 0;
	
	function getBMP(url,pos) {
		var BMPLoader = new air.Loader();
		BMPLoader.contentLoaderInfo.addEventListener(air.Event.COMPLETE,function(e,pos) {
			BMPs.push(e.target.content.bitmapData);
			if (pos == count) {
				// reset count
				count = 0;
				updateIcon();
			}
		});
		BMPLoader.load(new air.URLRequest(url));
	}
	
	function updateIcon() {
		
		// 0 - the icon
		// 1 - the little read dot
		// 2 - first digit
		// 3 etc...

		var point = new air.Point();
		var rect = BMPs[0].rect;
		
		for (var i=1; i < BMPs.length; i++) {
			BMPs[0].copyPixels(BMPs[i],rect,point,BMP[i],point,true);
		};

	}
	
	
	return {
		
		showUnread(unread) {
			// set the number of bitmaps required
			count = 2;
			// get a list of all the urls required
			var urls = new Array();
			urls = [
				"assets/img/ReadAir.png",
				"assets/img/dock/bg.png"
			];
			// loop though the array, when i hits count submit icon
			for (var i=0; i < urls.length; i++) {
				var j = i+1;
				getBMP(urls[i],j);
			};
		}
		
	}
}