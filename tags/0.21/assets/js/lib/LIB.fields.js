// /////////////////////////////////////////////////
// LIB fields 
// /////////////////////////////////////////////////

LIB.fields = {};

LIB.fields._model = function (theValue) { 
    this.attType = ''; 
    this.setValue(theValue);
};
LIB.fields._model.prototype = {

    hasValue: function ()  {
        if (this.m_value) { return true; };
    },

    // GETTERS 
    value:  function () { return this.m_value; },
    valueForElement:  function () { return this.value(); },
    valueForNative:  function () { return this.value(); },
    asElement:  function () { 
        // return document.createTextNode(this.valueForElement());
        return LIB.dom.createXMLTextNode(this.valueForElement());
    },
    asNode: function (theNodeName) {
        // var node = document.createElement(theNodeName);
        var node = LIB.dom.createXMLElement(theNodeName);
        node.setAttribute('type', this.attType);
        node.appendChild(this.asElement());
        return node;
    },

    // SETTERS 
    setValue: function  (theValue) { this.m_value = theValue; return true; },
    setFromXML: function (theValue) { this.setValue(theValue); return true; }, 
    setFromNode: function (theNode) { 
        if (theNode) {
            this.setFromXML(theNode.textContent);
            return true;
        }
        
    }

};

// /////////////////////////////////////////
// number
// stored natively as number
LIB.fields.number = function (theValue) { 
    this.attType = 'number'; 
    this.setValue(theValue);
};
LIB.fields.number.prototype = new LIB.fields._model();
// override inherited functions...
LIB.fields.number.prototype.hasValue = function () {
    return LIB.lang.isNumber(this.m_value);
};
LIB.fields.number.prototype.valueForElement = function () {
    return String(this.value());
};
LIB.fields.number.prototype.valueForNative = function () {
    return String(this.value());
};
LIB.fields.number.prototype.setValue = function (theValue) {
    // this.m_value = theValue;
    if (LIB.lang.isNumber(theValue)) {
        this.m_value = theValue;
        return true;
    } else if (LIB.lang.isString(theValue)) {
        this.m_value = parseInt(theValue);
        return true;
    }
};


// /////////////////////////////////////////
// string
// stored natively as string (unicode?)
LIB.fields.string = function (theValue) {
    this.attType = 'string'; 
    this.setValue(theValue);
};
LIB.fields.string.prototype = new LIB.fields._model();
// no overrides 

// /////////////////////////////////////////
// date
// stored natively as js Date
LIB.fields.date = function (theValue) {
    this.attType = 'date'; 
    this.setValue(theValue);
};
LIB.fields.date.prototype = new LIB.fields._model();

// override inherited functions...
LIB.fields.date.prototype.valueForElement = function () {
    return this.value().toLocaleFormat('%Y-%m-%d %H:%M:%S');
};
LIB.fields.date.prototype.valueForNative = function () {
    return this.value().toLocaleFormat('%Y-%m-%d %H:%M:%S');
};
LIB.fields.date.prototype.setValue = function (theValue) {
    // this.m_value = theValue;
    if (!LIB.lang.isValue(theValue)) {
        this.m_value = null;
        return true;
    } else if (LIB.lang.isDate(theValue)) {
        this.m_value = theValue;
        return true;
    } else if (LIB.lang.isString(theValue)) {
        // iso style
        if (LIB.string.trim(theValue) == '') {
            this.m_value = null;
            return true;
        }
        try {
            var re = /:|-/gi;
            var myStringDate = theValue.replace(re, " ");
            var dObj = myStringDate.split(" ");
            var myDate = new Date(dObj[0], (dObj[1]-1), dObj[2], dObj[3], dObj[4], dObj[5]);
            this.m_value = myDate;
            return true;
        } catch (e) {
            return false;
        }
    }
};


// /////////////////////////////////////////
// text
LIB.fields.text = function (theValue) {
    this.attType = 'text'; 
    this.setValue(theValue);
};
LIB.fields.text.prototype = new LIB.fields._model();

// /////////////////////////////////////////
// data
LIB.fields.data = function (theValue) {
    this.attType = 'data'; 
    this.setValue(theValue);
};
LIB.fields.data.prototype = new LIB.fields._model();
// override inherited functions...
LIB.fields.data.prototype.asElement = function () {
    return LIB.dom.createXMLCDATASection(this.valueForElement());
};

// /////////////////////////////////////////
// blob
LIB.fields.blob = function (theValue) {
    this.attType = 'blob'; 
    this.setValue(theValue);
};
LIB.fields.blob.prototype = new LIB.fields._model();
