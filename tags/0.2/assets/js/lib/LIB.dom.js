// /////////////////////////////////////////////////
// LIB.dom
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.dom = {

    _parser:     new DOMParser(),
    _serializer: new XMLSerializer(),

    _xdoc:       (function () {
        var p = new DOMParser();
        if (p) {
            var doc = p.parseFromString('<factory />', 'application/xml');
            return doc;
        }
        throw new Error("No DOMParser available.");
    })(),


    // firstChildWithTagName //////////////////////////
    //  moved from Object.js to avoid extending inbuilt types
    firstChildWithTagName: function(theObject, theTagName) {
        // check to see if we can .childNodes on the object... 
        if (!theObject.hasChildNodes) {
            alert('no hasChildNodes function');
            return null;	
        }
        // or if there are any...
        if (theObject.hasChildNodes() == false) {
            return null;	
        }
        var theChildNodes = theObject.childNodes;
        for (var i=0; i < theChildNodes.length; i++) {
            var theNode = theChildNodes[i];
            if (theNode.tagName == theTagName.toUpperCase()) {
                return theNode;
            }
            // recurse...
            var theReturn = LIB.dom.firstChildWithTagName(theNode, theTagName);
            if (theReturn) {
                return theReturn;	
            }
        }
        return null;
    },
	
	getElementsByClassName: function(className, tag, elm){
		var testClass = new RegExp("(^|\\\\s)" + className + "(\\\\s|$)");
		var tag = tag || "*";
		var elm = elm || document;
		var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
		var returnElements = [];
		var current;
		var length = elements.length;
		for(var i=0; i<length; i++){
			current = elements[i];
			if(testClass.test(current.className)){
				returnElements.push(current);
			}
		}
		return returnElements;
	},

    // firstChildWithTagName //////////////////////////
    //  moved from Object.js to avoid extending inbuilt types
    firstChildWithClassName: function(theObject, theClassName) {
        // check to see if we can .childNodes on the object... 
        if (!theObject.hasChildNodes) {
            alert('no hasChildNodes function');
            return null;	
        }
        // or if there are any...
        if (theObject.hasChildNodes() == false) {
            return null;	
        }
        var theChildNodes = theObject.childNodes;
        for (var i=0; i < theChildNodes.length; i++) {
            var theNode = theChildNodes[i];
            if (theNode.className == theClassName)	{
                return theNode;
            }
            // recurse...
            var theReturn = LIB.dom.firstChildWithClassName(theNode, theClassName);
            if (theReturn) {
                return theReturn;	
            }
        }
        return null;	
    },

	nextSiblingByClassName: function(element, className) {
		while (element = element.nextSibling) {
		    if (element.nodeType == Node.ELEMENT_NODE) {
		        if (-1 != element.className.indexOf(className)) {
		            return element;
		        }
		    }
		}
		return null;
	},

    // isWellFormedXML ////////////////////////////////
    // takes: string to parse, errornode to return, 
    //          optional boolean rootNode for testing
    // returns: - true if well-formed (no change to theError)
    //          - false if not well-formed
    //            theObj.errornode is the parsererror node
    // if it returns false, with no change to theObj, there must have been an exception in
    // parsing, or no theObj passed in.
    isWellFormedXML: function (theXMLString, theParseError, addXMLRootNodeForTesting) {
        function setParseErrorNode (theError, theNode) {
            // if (theNode && theError && theError.constructor == ParseError) {
            if (theError) {
                try {
                    theError.node = theNode;
                } catch (e) {
                    // never mind...
                }
            }
        }

        // wrap node for xml testing?
        var wrapXMLString = true; // default
        if (!LIB.lang.isUndefined(addXMLRootNodeForTesting)) {
            wrapXMLString = addXMLRootNodeForTesting;
        }
        if (wrapXMLString) {
            theXMLString = '<rootnodefortesting>' + theXMLString + '</rootnodefortesting>';
        }

        // do the test...
        var p = LIB.dom._parser;
        try {
            var xdoc = p.parseFromString(theXMLString, 'application/xml');
            // var result = LIB.dom.nodeForXPath(xdoc, 'parsererror');
            var nodeList = xdoc.getElementsByTagName('parsererror');
            if (nodeList.length) {
                // alert('result length ' + nodeList.length + ' - must have hit a failure! return false');
                setParseErrorNode(theParseError, nodeList[0]);
                return false;
            }
            if (xdoc.documentElement && xdoc.documentElement.tagName == 'parsererror') {
                // If the documentElement is parsererror, it's failed to
                // parse.
                // alert('result docElement is parsererror');
                setParseErrorNode(theParseError, xdoc.documentElement);
                return false;
            }
            // OK, then...
            return true;
        } catch (e) {
            // something went very wrong - must have failed
            // alert('something went very wrong - must have failed');
            return false;

        }
    },

    ParseError: function () {
        this.node = null; 
    },

    createXMLCDATASection: function (theNodeContent) {
        var x = LIB.dom._xdoc;
        return x.createCDATASection(theNodeContent);
    },

    createXMLTextNode: function (theNodeTextContent) {
        var x = LIB.dom._xdoc;
        return x.createTextNode(theNodeTextContent);
    },

    createXMLElement: function (theNodeName) {
        var x = LIB.dom._xdoc;
        return x.createElement(theNodeName);
    },

    parseFromString: function (theString, theXMLType) {
        theXMLType = theXMLType || 'application/xml';
        var p = LIB.dom._parser;
        if (p) {
            var doc = p.parseFromString(theString, theXMLType);
            return doc;
        }
        return null;
    },

    toString: function (theXMLDoc) {
        var s = LIB.dom._serializer;
        var theString = null;
        if (s) {
            try {
                theString = s.serializeToString(theXMLDoc);
            } catch (e) {
                // pass - wasn't a valid theXMLDoc
            }
        }
        return theString;
    },

    innerToString: function (theXMLDoc) {
        var dl = null;
        if (theXMLDoc.documentElement) { // we're an xmldoc - use the documentElement
            dl = theXMLDoc.documentElement;
        } else if (LIB.dom.isNode(theXMLDoc)) { // we're a node 
            dl = theXMLDoc;    
        } else { // we're something else
            return;
        }

        if (!dl.childNodes) {
            return '';
        }
        var l = dl.childNodes; 
        var s = '';
        try {
            for (i = 0; i < l.length; i++) {
            s += LIB.dom.toString(l[i]);
            }
            return s;
        } catch (e) {
            return;
        }
    },



    // nodeForXPath
    /*
    * nodeForXPath
    * the context node only works if a relative XPath expression is used
    * 
    * e.g. if the XML is 
    * <document>
    *     <id>...
    *     <section>...
    *     <properties>
    *         <property><id>one</id></property>
    *         <property><id>two</id></property>
    *     </properties>
    * </document>
    * 
    * and the context node is set to <property> then it needs './id' as the
    * XPath expression to find in that context node.
    * 
    * 'property/id', '/property/id' etc DON'T WORK
    */
    nodeForXPath: function (aNode, thePath, customResolver) {
        var xpe  = aNode.ownerDocument || aNode;
		var theType = XPathResult.FIRST_ORDERED_NODE_TYPE;
		var nsResolver = function() {
			return customResolver ? customResolver : null;        
		}
        var theResult = xpe.evaluate(thePath, aNode, nsResolver, theType, null);
		if(theResult) {
            return theResult.singleNodeValue; 
        }
    },

    // http://developer.mozilla.org/en/docs/Using_XPath
    // http://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript#Implementing_a_User_Defined_Namespace_Resolver
	//
    // Evaluate an XPath expression aExpr against a given DOM node
    // or Document object (aNode), returning the results as an array
    // thanks wanderingstan at morethanwarm dot mail dot com for the
    // initial work.
    evaluateXPath: function (aNode, aExpr, customResolver) {
        // var xpe = new XPathEvaluator();
        var xpe = aNode.ownerDocument || aNode;        
		var nsResolver = function() {
			return customResolver ? customResolver : xpe.createNSResolver(xpe.documentElement);        
		}
		var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
		var found = [];
        var res;
        while (res = result.iterateNext()) {
            found.push(res);
        }
        return found;
    },

    emptyNode: function(aNode) {
        if (LIB.dom.isNode(aNode)) {
            while (aNode && aNode.hasChildNodes()) { 
                aNode.removeChild(aNode.firstChild); 
            }
            return true;
        }
    },

    replaceNode: function (oldNode, newNode) {
        if (LIB.dom.isNode(oldNode) && LIB.dom.isNode(newNode)) {
            var parentNode = oldNode.parentNode;
            if (LIB.dom.isNode(parentNode)) {
                parentNode.replaceChild(newNode, oldNode);
                return true;
            }
        }
        
    },

	getParentByTagName: function(el, tagName) {
		if (el == null) return null;
		while (el = el.parentNode) {
		    if (el.nodeName && tagName.toUpperCase() == el.nodeName) return el;
		}
		return null;
	}, 

    isNode: function (aNode) {
        return aNode && aNode.nodeType;
    }

};