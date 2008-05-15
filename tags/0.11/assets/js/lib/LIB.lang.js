// /////////////////////////////////////////////////
// LIB.lang (from YAHOO.lang)
// /////////////////////////////////////////////////

if (typeof LIB == "undefined") {var LIB = {};}

LIB.lang = {

    isArray: function(o) { 
        if (o) {
           var l = LIB.lang;
           return l.isNumber(o.length) && l.isFunction(o.splice) && !l.hasOwnProperty(o.length);
        }
        return false;
    },
    isBoolean: function(o) { return typeof o === 'boolean'; },
    isFunction: function(o) { return typeof o === 'function'; },
    isNull: function(o) { return o === null; },
    isNumber: function(o) { return typeof o === 'number' && isFinite(o); },
    isObject: function(o) { return (o && (typeof o === 'object' || LIB.lang.isFunction(o))) || false; },
    isString: function(o) { return typeof o === 'string'; },
    isUndefined: function(o) { return typeof o === 'undefined'; },
    hasOwnProperty: function(o, prop) {
        if (Object.prototype.hasOwnProperty) {
            return o.hasOwnProperty(prop);
        }
        return !LIB.lang.isUndefined(o[prop]) && o.constructor.prototype[prop] !== o[prop];
    },
    dump: function(o, d) {
        var l=LIB.lang,i,len,s=[],OBJ="{...}",FUN="f(){...}",
            COMMA=', ', ARROW=' => ';

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump 
        // an element will cause an unhandled exception in FF 2.x

        // LIB usage - Override this 
        // I want to see HTML type elements, and not using FF ***

        if (!l.isObject(o)) {
            return o + "";
        // } else if (o instanceof Date || ("nodeType" in o && "tagName" in o)) {
        } else if (o instanceof Date ) {
            return o;
        } else if  (l.isFunction(o)) {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (l.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (l.isArray(o)) {
            s.push("[");
            for (i=0,len=o.length;i<len;i=i+1) {
                if (l.isObject(o[i])) {
                    s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("]");
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push("{");
            for (i in o) {
                if (l.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (l.isObject(o[i])) {
                        s.push((d > 0) ? l.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push("}");
        }

        return s.join("");
    },

    substitute: function (s, o, f) {
        var i, j, k, key, v, meta, l=LIB.lang, saved=[], token, 
            DUMP='dump', SPACE=' ', LBRACE='{', RBRACE='}';

        for (;;) {
            i = s.lastIndexOf(LBRACE);
            if (i < 0) {
                break;
            }
            j = s.indexOf(RBRACE, i);
            if (i + 1 >= j) {
                break;
            }
            //Extract key and meta info 
            token = s.substring(i + 1, j);
            key = token;
            meta = null;
            k = key.indexOf(SPACE);
            if (k > -1) {
                meta = key.substring(k + 1);
                key = key.substring(0, k);
            }
            // lookup the value
            v = o[key];
            // if a substitution function was provided, execute it
            if (f) {
                v = f(key, v, meta);
            }
            if (l.isObject(v)) {
                if (l.isArray(v)) {
                    v = l.dump(v, parseInt(meta, 10));
                } else {
                    meta = meta || "";
                    // look for the keyword 'dump', if found force obj dump
                    var dump = meta.indexOf(DUMP);
                    if (dump > -1) {
                        meta = meta.substring(4);
                    }
                    // use the toString if it is not the Object toString 
                    // and the 'dump' meta info was not found
                    if (v.toString===Object.prototype.toString||dump>-1) {
                        v = l.dump(v, parseInt(meta, 10));
                    } else {
                        v = v.toString();
                    }
                }
            } else if (!l.isString(v) && !l.isNumber(v)) {
                // This {block} has no replace string. Save it for later.
                v = "~-" + saved.length + "-~";
                saved[saved.length] = token;
                // break;
            }
            s = s.substring(0, i) + v + s.substring(j + 1);
        }
        // restore saved {block}s
        for (i=saved.length-1; i>=0; i=i-1) {
            s = s.replace(new RegExp("~-" + i + "-~"), "{"  + saved[i] + "}", "g");
        }
        return s;
    },

    trim: function(s){ try { return s.replace(/^\s+|\s+$/g, ""); } catch(e) { return s; } },
    ltrim: function(s){ try { return s.replace(/^\s+/, ""); } catch(e) { return s; } },
    rtrim: function(s){ try { return s.replace(/\s+$/, ""); } catch(e) { return s; } },

    isValue: function(o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
        var l = LIB.lang;
        return (l.isObject(o) || l.isString(o) || l.isNumber(o) || l.isBoolean(o));
    },
    isDate: function(o) {
        var l = LIB.lang;
        return (l.isObject(o) && o.constructor == Date);
    }

};