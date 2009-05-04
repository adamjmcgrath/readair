/*
LIB.favicon
Doesn't work at the moment - Adobe Air doesn't render .ico's in the same way safari does...
*/

if (typeof LIB == "undefined") {var LIB = {}}

LIB.favicon = {
	
	/* get the favorite icon link
	 * @param {String} feed url
	 */
	getFavicon: function( url ) {
		var domain = url.match(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/i);
		if (domain != null) {
			var domname = domain[2];
			
			var file = air.File.applicationStorageDirectory.resolvePath("favicons/" + domname + '.png');
			if (file.exists) {
				return file.url;
			}
			
			var fav = "http://www.sectorprime.com/cgi-bin/fav2png.pl?fav=" + domname;
			air.trace('loading new icon from ' + fav);
			
			var request = new air.URLRequest(fav);
			
			var loader = new air.URLLoader();
			loader.dataFormat = air.URLLoaderDataFormat.BINARY;
			loader.addEventListener(air.Event.COMPLETE, function( e ) {
				var loader = e.target;
				var file = air.File.applicationStorageDirectory.resolvePath("favicons/" + domname + '.png');
				var fileStream = new air.FileStream();
				fileStream.open(file, air.FileMode.WRITE); 
				fileStream.writeBytes(loader.data);
				fileStream.close();

			} );
			
			loader.load(request);
		}

		// default
		
		return air.Capabilities.os.indexOf('Windows') != -1 ? "/assets/img/themes/windows/icon_item.png" : "/assets/img/themes/macos/icon_item.png";
	}
}