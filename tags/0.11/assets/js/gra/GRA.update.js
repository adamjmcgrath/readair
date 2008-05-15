//////////////////////////////////////////////////////////////////
// GRA.update //

if (typeof GRA == "undefined") {var GRA = {};}

var latestVersion = "";
var latestFileName = "";

//////////////////////////////////////////////////////////////////
// properties/methods //

GRA.update = {

	init: function() {
		LIB.httpr.getRequest(GRA.cons.URI_UPDATE_VERSIONS(),this.check);
	},

	check: function(e) {
		// latest version
		var versionsObj = new GRA.versions(e.target.data);
		var latestVersionObj = versionsObj.latestVersion();
		latestVersion = latestVersionObj.version();
		latestFileName = latestVersionObj.filename();
		// this version
		var appXML = air.NativeApplication.nativeApplication.applicationDescriptor;
		var appDescriptorObj = new GRA.appdescriptor(appXML);
		var currentVersion = appDescriptorObj.version();
		air.trace("latestVersion: " + latestVersion + "\n" + "currentVersion: " + currentVersion);
		var msg = "You have version " + currentVersion + ",\n Would you like to upgrade to version " + latestVersion + "?";
		if (latestVersion > currentVersion && confirm(msg)) {
			var fileUrl = latestVersionObj.fileUrl();
			air.trace("fileUrl: " + fileUrl);
			GRA.update.fileGet(fileUrl,GRA.update.gotLatestFile);
		}
		
	},

	gotLatestFile: function(e) {
		var fileData = new air.ByteArray();
		var URLStream = e.target;
		URLStream.readBytes(fileData, 0, URLStream.bytesAvailable);
		GRA.update.writeAirFile(fileData);
	},
	
	writeAirFile: function(fileData) {
		var airFile = air.File.desktopDirectory.resolvePath(latestFileName);
	    var fileStream = new air.FileStream();
	    fileStream.addEventListener(air.Event.CLOSE, this.fileSaved);
	    fileStream.openAsync(airFile, air.FileMode.WRITE);
	    fileStream.writeBytes(fileData, 0, fileData.length);
	    fileStream.close();
	},
	
	fileSaved: function() {
		// run the updater
		var airFile = air.File.desktopDirectory.resolvePath(latestFileName);
		var updater = new air.Updater();
		var version = latestVersion;
		//run the update
		updater.update(airFile, version);
	},
	
	fileGet: function(url,callback) {
		var urlReq = new air.URLRequest(url);
		urlReq.method = air.URLRequestMethod.GET;
		var urlStream = new air.URLStream();
		urlStream.addEventListener(air.Event.COMPLETE, callback);
		urlStream.addEventListener(air.ProgressEvent.PROGRESS, function(e) {
			air.trace("====================\nPROGRESS: " + (e.bytesLoaded/e.bytesTotal)*100);
		});
		urlStream.load(urlReq);
	}
		
}
