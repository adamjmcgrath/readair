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

	var icons = new Array();
	var total = 0;
	
	function getRootIcon() {
		return {
			point: new air.Point(0,0),
			url: "assets/img/ReadAir.png"
		}
	}
	
	function getStarIcon(num) {
		var url = "assets/img/dock/bg";
		if (num < 100) {
			url += "10.png";
		} else if (num < 1000) {
			url += "100.png";
		} else {
			url += "1000.png";
		}
		return {
			point: new air.Point(0,0),
			url: url
		}
	};
	
	function getIconByNumber(num,pos,length) {
		var x = length == 1 ? 93 : 112 - ((length-pos)*13);
		return {
			point: new air.Point(x,15),
			url: "assets/img/dock/" + num + ".png"
		}
	}
	
	function getBmps() {
		for (var i=0; i < icons.length; i++) {
			var loader = new air.Loader();
			loader.contentLoaderInfo.addEventListener(air.Event.COMPLETE, function(e) {
				for (var j=0; j < icons.length; j++) {
					if (("app:/" + icons[j].url) == e.target.url && !icons[j].done) {
						icons[j].bmp = e.target.content.bitmapData;
						icons[j].done = true;
						total++;
					}
				};
				if (total == icons.length){setBmps();}
			});			
			loader.load(new air.URLRequest(icons[i].url));
		};
	}
	
	function setBmps() {
		for (var i=0; i < icons.length; i++) {
			var bmp =  icons[i].bmp;
			icons[0].bmp.copyPixels(bmp,bmp.rect,icons[i].point,null,null,true);
		};
		air.NativeApplication.nativeApplication.icon.bitmaps = [icons[0].bmp];
		
		air.trace(air.NativeApplication.nativeApplication.icon.bitmaps);
		
	}
	
	return {
		
		init: function(count) {
			if (count > 9999) {
				count = 9999;
			}
			icons = new Array();
			icons.push(getRootIcon());
			total = 0;
			if (count > 0) {
				icons.push(getStarIcon(count));
				var str = LIB.string.trim(count.toString());
				var numbers = str.split("");
				for (var i=0; i < numbers.length; i++) {
					icons.push(getIconByNumber(numbers[i],i,numbers.length));
				};
			}
			getBmps();
		}
		
	}
}(); 