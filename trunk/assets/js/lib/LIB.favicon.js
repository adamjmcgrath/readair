/*
LIB.favicon
Doesn't work at the moment - Adobe Air doesn't render .ico's in the same way safari does...
*/

if (typeof LIB == "undefined") {var LIB = {}}

LIB.favicon = {
	
	/* get the favorite icon link
	 * @param {String} feed url
	 */
	getFavicon: function( id ) {
		var domain = id.match(/(\w+):\/\/([^\/:]+)(:\d*)?([^# ]*)/i);
		if ( domain != null )
			var fsrc = "http://www.sectorprime.com/cgi-bin/fav2png.pl?fav=" + domain[2];
		else
			var fsrc = "/assets/img/themes/windows/icon_item.png";
			
		return fsrc;
	}
}