// ///////////////////////////////////////////
// LIB.xslt
// ///////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.xslt = {
    _xmldocFromStringOrXMLDoc: function (input) {
        var output = null;
        if (LIB.lang.isString(input)) {
			if (input.indexOf('<') != -1) {
				// it's a string of XML/XSLT
				output = LIB.dom.parseFromString(input);
			} else {
				// it's a URL
				LIB.ajax.getRequest(input, function(theResponse) {
					output = theResponse.responseXML;
				},true);
			}
        } else { // it'll be an xmldoc
            output = input;
        }
        return output;
    },
    transformToDocument: function (theStylesheet, theXMLDoc) {
        // inputs:
        //    theStylesheet: xmldoc or string
        //    theXMLDoc: xmldoc or string
        // returns: 
        //    xmldoc
        var sDoc = LIB.xslt._xmldocFromStringOrXMLDoc(theStylesheet);
        var xDoc = LIB.xslt._xmldocFromStringOrXMLDoc(theXMLDoc);
        var processor = new XSLTProcessor();
        processor.importStylesheet(sDoc);
        return processor.transformToDocument(xDoc);

    },
    transformToFragment: function (theStylesheet, theXMLDoc, showRaw) {
        // inputs:
        //    theStylesheet: xmldoc, xmlstring or url
        //    theXMLDoc: xmldoc, string or url
        //    showRaw: leave as escaped entities?  defaults to false
        // returns: 
        //    documentfragment if showRaw
        //    else: string 
        var sDoc = LIB.xslt._xmldocFromStringOrXMLDoc(theStylesheet);
        var xDoc = LIB.xslt._xmldocFromStringOrXMLDoc(theXMLDoc);
        var processor = new XSLTProcessor();
        processor.importStylesheet(sDoc);
        var newDoc = processor.transformToFragment(xDoc, xDoc);
		return showRaw ? newDoc : LIB.dom.toString(newDoc);
    }
};