/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(12);
const Path = __webpack_require__(7);
const Util = __webpack_require__(17);
const Escape = __webpack_require__(57);


// Declare internals

const internals = {};


// Clone object or array

exports.clone = function (obj, seen) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    seen = seen || new Map();

    const lookup = seen.get(obj);
    if (lookup) {
        return lookup;
    }

    let newObj;
    let cloneDeep = false;

    if (!Array.isArray(obj)) {
        if (Buffer.isBuffer(obj)) {
            newObj = new Buffer(obj);
        }
        else if (obj instanceof Date) {
            newObj = new Date(obj.getTime());
        }
        else if (obj instanceof RegExp) {
            newObj = new RegExp(obj);
        }
        else {
            const proto = Object.getPrototypeOf(obj);
            if (proto &&
                proto.isImmutable) {

                newObj = obj;
            }
            else {
                newObj = Object.create(proto);
                cloneDeep = true;
            }
        }
    }
    else {
        newObj = [];
        cloneDeep = true;
    }

    seen.set(obj, newObj);

    if (cloneDeep) {
        const keys = Object.getOwnPropertyNames(obj);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const descriptor = Object.getOwnPropertyDescriptor(obj, key);
            if (descriptor &&
                (descriptor.get ||
                 descriptor.set)) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else {
                newObj[key] = exports.clone(obj[key], seen);
            }
        }
    }

    return newObj;
};


// Merge all the properties of source into target, source wins in conflict, and by default null and undefined from source are applied

/*eslint-disable */
exports.merge = function (target, source, isNullOverride /* = true */, isMergeArrays /* = true */) {
/*eslint-enable */

    exports.assert(target && typeof target === 'object', 'Invalid target value: must be an object');
    exports.assert(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

    if (!source) {
        return target;
    }

    if (Array.isArray(source)) {
        exports.assert(Array.isArray(target), 'Cannot merge array onto an object');
        if (isMergeArrays === false) {                                                  // isMergeArrays defaults to true
            target.length = 0;                                                          // Must not change target assignment
        }

        for (let i = 0; i < source.length; ++i) {
            target.push(exports.clone(source[i]));
        }

        return target;
    }

    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = source[key];
        if (value &&
            typeof value === 'object') {

            if (!target[key] ||
                typeof target[key] !== 'object' ||
                (Array.isArray(target[key]) !== Array.isArray(value)) ||
                value instanceof Date ||
                Buffer.isBuffer(value) ||
                value instanceof RegExp) {

                target[key] = exports.clone(value);
            }
            else {
                exports.merge(target[key], value, isNullOverride, isMergeArrays);
            }
        }
        else {
            if (value !== null &&
                value !== undefined) {                              // Explicit to preserve empty strings

                target[key] = value;
            }
            else if (isNullOverride !== false) {                    // Defaults to true
                target[key] = value;
            }
        }
    }

    return target;
};


// Apply options to a copy of the defaults

exports.applyToDefaults = function (defaults, options, isNullOverride) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.clone(defaults);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    return exports.merge(copy, options, isNullOverride === true, false);
};


// Clone an object except for the listed keys which are shallow copied

exports.cloneWithShallow = function (source, keys) {

    if (!source ||
        typeof source !== 'object') {

        return source;
    }

    const storage = internals.store(source, keys);    // Move shallow copy items to storage
    const copy = exports.clone(source);               // Deep copy the rest
    internals.restore(copy, source, storage);       // Shallow copy the stored items and restore
    return copy;
};


internals.store = function (source, keys) {

    const storage = {};
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const value = exports.reach(source, key);
        if (value !== undefined) {
            storage[key] = value;
            internals.reachSet(source, key, undefined);
        }
    }

    return storage;
};


internals.restore = function (copy, source, storage) {

    const keys = Object.keys(storage);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        internals.reachSet(copy, key, storage[key]);
        internals.reachSet(source, key, storage[key]);
    }
};


internals.reachSet = function (obj, key, value) {

    const path = key.split('.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        const segment = path[i];
        if (i + 1 === path.length) {
            ref[segment] = value;
        }

        ref = ref[segment];
    }
};


// Apply options to defaults except for the listed keys which are shallow copied from option without merging

exports.applyToDefaultsWithShallow = function (defaults, options, keys) {

    exports.assert(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    exports.assert(!options || options === true || typeof options === 'object', 'Invalid options value: must be true, falsy or an object');
    exports.assert(keys && Array.isArray(keys), 'Invalid keys');

    if (!options) {                                                 // If no options, return null
        return null;
    }

    const copy = exports.cloneWithShallow(defaults, keys);

    if (options === true) {                                         // If options is set to true, use defaults
        return copy;
    }

    const storage = internals.store(options, keys);   // Move shallow copy items to storage
    exports.merge(copy, options, false, false);     // Deep copy the rest
    internals.restore(copy, options, storage);      // Shallow copy the stored items and restore
    return copy;
};


// Deep object or array comparison

exports.deepEqual = function (obj, ref, options, seen) {

    options = options || { prototype: true };

    const type = typeof obj;

    if (type !== typeof ref) {
        return false;
    }

    if (type !== 'object' ||
        obj === null ||
        ref === null) {

        if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
            return obj !== 0 || 1 / obj === 1 / ref;        // -0 / +0
        }

        return obj !== obj && ref !== ref;                  // NaN
    }

    seen = seen || [];
    if (seen.indexOf(obj) !== -1) {
        return true;                            // If previous comparison failed, it would have stopped execution
    }

    seen.push(obj);

    if (Array.isArray(obj)) {
        if (!Array.isArray(ref)) {
            return false;
        }

        if (!options.part && obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (options.part) {
                let found = false;
                for (let j = 0; j < ref.length; ++j) {
                    if (exports.deepEqual(obj[i], ref[j], options)) {
                        found = true;
                        break;
                    }
                }

                return found;
            }

            if (!exports.deepEqual(obj[i], ref[i], options)) {
                return false;
            }
        }

        return true;
    }

    if (Buffer.isBuffer(obj)) {
        if (!Buffer.isBuffer(ref)) {
            return false;
        }

        if (obj.length !== ref.length) {
            return false;
        }

        for (let i = 0; i < obj.length; ++i) {
            if (obj[i] !== ref[i]) {
                return false;
            }
        }

        return true;
    }

    if (obj instanceof Date) {
        return (ref instanceof Date && obj.getTime() === ref.getTime());
    }

    if (obj instanceof RegExp) {
        return (ref instanceof RegExp && obj.toString() === ref.toString());
    }

    if (options.prototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
            return false;
        }
    }

    const keys = Object.getOwnPropertyNames(obj);

    if (!options.part && keys.length !== Object.getOwnPropertyNames(ref).length) {
        return false;
    }

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.get) {
            if (!exports.deepEqual(descriptor, Object.getOwnPropertyDescriptor(ref, key), options, seen)) {
                return false;
            }
        }
        else if (!exports.deepEqual(obj[key], ref[key], options, seen)) {
            return false;
        }
    }

    return true;
};


// Remove duplicate items from array

exports.unique = (array, key) => {

    let result;
    if (key) {
        result = [];
        const index = new Set();
        array.forEach((item) => {

            const identifier = item[key];
            if (!index.has(identifier)) {
                index.add(identifier);
                result.push(item);
            }
        });
    }
    else {
        result = Array.from(new Set(array));
    }

    return result;
};


// Convert array into object

exports.mapToObject = function (array, key) {

    if (!array) {
        return null;
    }

    const obj = {};
    for (let i = 0; i < array.length; ++i) {
        if (key) {
            if (array[i][key]) {
                obj[array[i][key]] = true;
            }
        }
        else {
            obj[array[i]] = true;
        }
    }

    return obj;
};


// Find the common unique items in two arrays

exports.intersect = function (array1, array2, justFirst) {

    if (!array1 || !array2) {
        return [];
    }

    const common = [];
    const hash = (Array.isArray(array1) ? exports.mapToObject(array1) : array1);
    const found = {};
    for (let i = 0; i < array2.length; ++i) {
        if (hash[array2[i]] && !found[array2[i]]) {
            if (justFirst) {
                return array2[i];
            }

            common.push(array2[i]);
            found[array2[i]] = true;
        }
    }

    return (justFirst ? null : common);
};


// Test if the reference contains the values

exports.contain = function (ref, values, options) {

    /*
        string -> string(s)
        array -> item(s)
        object -> key(s)
        object -> object (key:value)
    */

    let valuePairs = null;
    if (typeof ref === 'object' &&
        typeof values === 'object' &&
        !Array.isArray(ref) &&
        !Array.isArray(values)) {

        valuePairs = values;
        values = Object.keys(values);
    }
    else {
        values = [].concat(values);
    }

    options = options || {};            // deep, once, only, part

    exports.assert(arguments.length >= 2, 'Insufficient arguments');
    exports.assert(typeof ref === 'string' || typeof ref === 'object', 'Reference must be string or an object');
    exports.assert(values.length, 'Values array cannot be empty');

    let compare;
    let compareFlags;
    if (options.deep) {
        compare = exports.deepEqual;

        const hasOnly = options.hasOwnProperty('only');
        const hasPart = options.hasOwnProperty('part');

        compareFlags = {
            prototype: hasOnly ? options.only : hasPart ? !options.part : false,
            part: hasOnly ? !options.only : hasPart ? options.part : true
        };
    }
    else {
        compare = (a, b) => a === b;
    }

    let misses = false;
    const matches = new Array(values.length);
    for (let i = 0; i < matches.length; ++i) {
        matches[i] = 0;
    }

    if (typeof ref === 'string') {
        let pattern = '(';
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];
            exports.assert(typeof value === 'string', 'Cannot compare string reference to non-string value');
            pattern += (i ? '|' : '') + exports.escapeRegex(value);
        }

        const regex = new RegExp(pattern + ')', 'g');
        const leftovers = ref.replace(regex, ($0, $1) => {

            const index = values.indexOf($1);
            ++matches[index];
            return '';          // Remove from string
        });

        misses = !!leftovers;
    }
    else if (Array.isArray(ref)) {
        for (let i = 0; i < ref.length; ++i) {
            let matched = false;
            for (let j = 0; j < values.length && matched === false; ++j) {
                matched = compare(values[j], ref[i], compareFlags) && j;
            }

            if (matched !== false) {
                ++matches[matched];
            }
            else {
                misses = true;
            }
        }
    }
    else {
        const keys = Object.getOwnPropertyNames(ref);
        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i];
            const pos = values.indexOf(key);
            if (pos !== -1) {
                if (valuePairs &&
                    !compare(valuePairs[key], ref[key], compareFlags)) {

                    return false;
                }

                ++matches[pos];
            }
            else {
                misses = true;
            }
        }
    }

    let result = false;
    for (let i = 0; i < matches.length; ++i) {
        result = result || !!matches[i];
        if ((options.once && matches[i] > 1) ||
            (!options.part && !matches[i])) {

            return false;
        }
    }

    if (options.only &&
        misses) {

        return false;
    }

    return result;
};


// Flatten array

exports.flatten = function (array, target) {

    const result = target || [];

    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            exports.flatten(array[i], result);
        }
        else {
            result.push(array[i]);
        }
    }

    return result;
};


// Convert an object key chain string ('a.b.c') to reference (object[a][b][c])

exports.reach = function (obj, chain, options) {

    if (chain === false ||
        chain === null ||
        typeof chain === 'undefined') {

        return obj;
    }

    options = options || {};
    if (typeof options === 'string') {
        options = { separator: options };
    }

    const path = chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        if (key[0] === '-' && Array.isArray(ref)) {
            key = key.slice(1, key.length);
            key = ref.length - key;
        }

        if (!ref ||
            !((typeof ref === 'object' || typeof ref === 'function') && key in ref) ||
            (typeof ref !== 'object' && options.functions === false)) {         // Only object and function can have properties

            exports.assert(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
            exports.assert(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
            ref = options.default;
            break;
        }

        ref = ref[key];
    }

    return ref;
};


exports.reachTemplate = function (obj, template, options) {

    return template.replace(/{([^}]+)}/g, ($0, chain) => {

        const value = exports.reach(obj, chain, options);
        return (value === undefined || value === null ? '' : value);
    });
};


exports.formatStack = function (stack) {

    const trace = [];
    for (let i = 0; i < stack.length; ++i) {
        const item = stack[i];
        trace.push([item.getFileName(), item.getLineNumber(), item.getColumnNumber(), item.getFunctionName(), item.isConstructor()]);
    }

    return trace;
};


exports.formatTrace = function (trace) {

    const display = [];

    for (let i = 0; i < trace.length; ++i) {
        const row = trace[i];
        display.push((row[4] ? 'new ' : '') + row[3] + ' (' + row[0] + ':' + row[1] + ':' + row[2] + ')');
    }

    return display;
};


exports.callStack = function (slice) {

    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi

    const v8 = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {

        return stack;
    };

    const capture = {};
    Error.captureStackTrace(capture, this);     // arguments.callee is not supported in strict mode so we use this and slice the trace of this off the result
    const stack = capture.stack;

    Error.prepareStackTrace = v8;

    const trace = exports.formatStack(stack);

    return trace.slice(1 + slice);
};


exports.displayStack = function (slice) {

    const trace = exports.callStack(slice === undefined ? 1 : slice + 1);

    return exports.formatTrace(trace);
};


exports.abortThrow = false;


exports.abort = function (message, hideStack) {

    if (process.env.NODE_ENV === 'test' || exports.abortThrow === true) {
        throw new Error(message || 'Unknown error');
    }

    let stack = '';
    if (!hideStack) {
        stack = exports.displayStack(1).join('\n\t');
    }
    console.log('ABORT: ' + message + '\n\t' + stack);
    process.exit(1);
};


exports.assert = function (condition /*, msg1, msg2, msg3 */) {

    if (condition) {
        return;
    }

    if (arguments.length === 2 && arguments[1] instanceof Error) {
        throw arguments[1];
    }

    let msgs = [];
    for (let i = 1; i < arguments.length; ++i) {
        if (arguments[i] !== '') {
            msgs.push(arguments[i]);            // Avoids Array.slice arguments leak, allowing for V8 optimizations
        }
    }

    msgs = msgs.map((msg) => {

        return typeof msg === 'string' ? msg : msg instanceof Error ? msg.message : exports.stringify(msg);
    });

    throw new Error(msgs.join(' ') || 'Unknown error');
};


exports.Timer = function () {

    this.ts = 0;
    this.reset();
};


exports.Timer.prototype.reset = function () {

    this.ts = Date.now();
};


exports.Timer.prototype.elapsed = function () {

    return Date.now() - this.ts;
};


exports.Bench = function () {

    this.ts = 0;
    this.reset();
};


exports.Bench.prototype.reset = function () {

    this.ts = exports.Bench.now();
};


exports.Bench.prototype.elapsed = function () {

    return exports.Bench.now() - this.ts;
};


exports.Bench.now = function () {

    const ts = process.hrtime();
    return (ts[0] * 1e3) + (ts[1] / 1e6);
};


// Escape string for Regex construction

exports.escapeRegex = function (string) {

    // Escape ^$.*+-?=!:|\/()[]{},
    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
};


// Base64url (RFC 4648) encode

exports.base64urlEncode = function (value, encoding) {

    exports.assert(typeof value === 'string' || Buffer.isBuffer(value), 'value must be string or buffer');
    const buf = (Buffer.isBuffer(value) ? value : new Buffer(value, encoding || 'binary'));
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
};


// Base64url (RFC 4648) decode

exports.base64urlDecode = function (value, encoding) {

    if (typeof value !== 'string') {

        return new Error('Value not a string');
    }

    if (!/^[\w\-]*$/.test(value)) {

        return new Error('Invalid character');
    }

    const buf = new Buffer(value, 'base64');
    return (encoding === 'buffer' ? buf : buf.toString(encoding || 'binary'));
};


// Escape attribute value for use in HTTP header

exports.escapeHeaderAttribute = function (attribute) {

    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "

    exports.assert(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');

    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
};


exports.escapeHtml = function (string) {

    return Escape.escapeHtml(string);
};


exports.escapeJavaScript = function (string) {

    return Escape.escapeJavaScript(string);
};

exports.escapeJson = function (string) {

    return Escape.escapeJson(string);
};

exports.nextTick = function (callback) {

    return function () {

        const args = arguments;
        process.nextTick(() => {

            callback.apply(null, args);
        });
    };
};


exports.once = function (method) {

    if (method._hoekOnce) {
        return method;
    }

    let once = false;
    const wrapped = function () {

        if (!once) {
            once = true;
            method.apply(null, arguments);
        }
    };

    wrapped._hoekOnce = true;

    return wrapped;
};


exports.isInteger = Number.isSafeInteger;


exports.ignore = function () { };


exports.inherits = Util.inherits;


exports.format = Util.format;


exports.transform = function (source, transform, options) {

    exports.assert(source === null || source === undefined || typeof source === 'object' || Array.isArray(source), 'Invalid source object: must be null, undefined, an object, or an array');
    const separator = (typeof options === 'object' && options !== null) ? (options.separator || '.') : '.';

    if (Array.isArray(source)) {
        const results = [];
        for (let i = 0; i < source.length; ++i) {
            results.push(exports.transform(source[i], transform, options));
        }
        return results;
    }

    const result = {};
    const keys = Object.keys(transform);

    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        const path = key.split(separator);
        const sourcePath = transform[key];

        exports.assert(typeof sourcePath === 'string', 'All mappings must be "." delineated strings');

        let segment;
        let res = result;

        while (path.length > 1) {
            segment = path.shift();
            if (!res[segment]) {
                res[segment] = {};
            }
            res = res[segment];
        }
        segment = path.shift();
        res[segment] = exports.reach(source, sourcePath, options);
    }

    return result;
};


exports.uniqueFilename = function (path, extension) {

    if (extension) {
        extension = extension[0] !== '.' ? '.' + extension : extension;
    }
    else {
        extension = '';
    }

    path = Path.resolve(path);
    const name = [Date.now(), process.pid, Crypto.randomBytes(8).toString('hex')].join('-') + extension;
    return Path.join(path, name);
};


exports.stringify = function () {

    try {
        return JSON.stringify.apply(null, arguments);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};


exports.shallow = function (source) {

    const target = {};
    const keys = Object.keys(source);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        target[key] = source[key];
    }

    return target;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {
    STATUS_CODES: Object.setPrototypeOf({
        '100': 'Continue',
        '101': 'Switching Protocols',
        '102': 'Processing',
        '200': 'OK',
        '201': 'Created',
        '202': 'Accepted',
        '203': 'Non-Authoritative Information',
        '204': 'No Content',
        '205': 'Reset Content',
        '206': 'Partial Content',
        '207': 'Multi-Status',
        '300': 'Multiple Choices',
        '301': 'Moved Permanently',
        '302': 'Moved Temporarily',
        '303': 'See Other',
        '304': 'Not Modified',
        '305': 'Use Proxy',
        '307': 'Temporary Redirect',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '402': 'Payment Required',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '407': 'Proxy Authentication Required',
        '408': 'Request Time-out',
        '409': 'Conflict',
        '410': 'Gone',
        '411': 'Length Required',
        '412': 'Precondition Failed',
        '413': 'Request Entity Too Large',
        '414': 'Request-URI Too Large',
        '415': 'Unsupported Media Type',
        '416': 'Requested Range Not Satisfiable',
        '417': 'Expectation Failed',
        '418': 'I\'m a teapot',
        '422': 'Unprocessable Entity',
        '423': 'Locked',
        '424': 'Failed Dependency',
        '425': 'Unordered Collection',
        '426': 'Upgrade Required',
        '428': 'Precondition Required',
        '429': 'Too Many Requests',
        '431': 'Request Header Fields Too Large',
        '451': 'Unavailable For Legal Reasons',
        '500': 'Internal Server Error',
        '501': 'Not Implemented',
        '502': 'Bad Gateway',
        '503': 'Service Unavailable',
        '504': 'Gateway Time-out',
        '505': 'HTTP Version Not Supported',
        '506': 'Variant Also Negotiates',
        '507': 'Insufficient Storage',
        '509': 'Bandwidth Limit Exceeded',
        '510': 'Not Extended',
        '511': 'Network Authentication Required'
    }, null)
};


exports.boomify = function (error, options) {

    Hoek.assert(error instanceof Error, 'Cannot wrap non-Error object');

    options = options || {};

    if (!error.isBoom) {
        return internals.initialize(error, options.statusCode || 500, options.message);
    }

    if (options.override === false ||                           // Defaults to true
        (!options.statusCode && !options.message)) {

        return error;
    }

    return internals.initialize(error, options.statusCode || error.output.statusCode, options.message);
};


exports.wrap = function (error, statusCode, message) {

    Hoek.assert(error instanceof Error, 'Cannot wrap non-Error object');
    Hoek.assert(!error.isBoom || (!statusCode && !message), 'Cannot provide statusCode or message with boom error');

    return (error.isBoom ? error : internals.initialize(error, statusCode || 500, message));
};


exports.create = function (statusCode, message, data) {

    return internals.create(statusCode, message, data, exports.create);
};


internals.create = function (statusCode, message, data, ctor) {

    if (message instanceof Error) {
        if (data) {
            message.data = data;
        }

        return exports.wrap(message, statusCode);
    }

    const error = new Error(message ? message : undefined);         // Avoids settings null message
    Error.captureStackTrace(error, ctor);                           // Filter the stack to our external API
    error.data = data || null;
    internals.initialize(error, statusCode);
    error.typeof = ctor;

    return error;
};


internals.initialize = function (error, statusCode, message) {

    const numberCode = parseInt(statusCode, 10);
    Hoek.assert(!isNaN(numberCode) && numberCode >= 400, 'First argument must be a number (400+):', statusCode);

    error.isBoom = true;
    error.isServer = numberCode >= 500;

    if (!error.hasOwnProperty('data')) {
        error.data = null;
    }

    error.output = {
        statusCode: numberCode,
        payload: {},
        headers: {}
    };

    error.reformat = internals.reformat;

    if (!message &&
        !error.message) {

        error.reformat();
        message = error.output.payload.error;
    }

    if (message) {
        error.message = (message + (error.message ? ': ' + error.message : ''));
        error.output.payload.message = error.message;
    }

    error.reformat();
    return error;
};


internals.reformat = function () {

    this.output.payload.statusCode = this.output.statusCode;
    this.output.payload.error = internals.STATUS_CODES[this.output.statusCode] || 'Unknown';

    if (this.output.statusCode === 500) {
        this.output.payload.message = 'An internal server error occurred';              // Hide actual error from user
    }
    else if (this.message) {
        this.output.payload.message = this.message;
    }
};


// 4xx Client Errors

exports.badRequest = function (message, data) {

    return internals.create(400, message, data, exports.badRequest);
};


exports.unauthorized = function (message, scheme, attributes) {          // Or function (message, wwwAuthenticate[])

    const err = internals.create(401, message, undefined, exports.unauthorized);

    if (!scheme) {
        return err;
    }

    let wwwAuthenticate = '';

    if (typeof scheme === 'string') {

        // function (message, scheme, attributes)

        wwwAuthenticate = scheme;

        if (attributes || message) {
            err.output.payload.attributes = {};
        }

        if (attributes) {
            if (typeof attributes === 'string') {
                wwwAuthenticate = wwwAuthenticate + ' ' + Hoek.escapeHeaderAttribute(attributes);
                err.output.payload.attributes = attributes;
            }
            else {
                const names = Object.keys(attributes);
                for (let i = 0; i < names.length; ++i) {
                    const name = names[i];
                    if (i) {
                        wwwAuthenticate = wwwAuthenticate + ',';
                    }

                    let value = attributes[name];
                    if (value === null ||
                        value === undefined) {              // Value can be zero

                        value = '';
                    }
                    wwwAuthenticate = wwwAuthenticate + ' ' + name + '="' + Hoek.escapeHeaderAttribute(value.toString()) + '"';
                    err.output.payload.attributes[name] = value;
                }
            }
        }


        if (message) {
            if (attributes) {
                wwwAuthenticate = wwwAuthenticate + ',';
            }
            wwwAuthenticate = wwwAuthenticate + ' error="' + Hoek.escapeHeaderAttribute(message) + '"';
            err.output.payload.attributes.error = message;
        }
        else {
            err.isMissing = true;
        }
    }
    else {

        // function (message, wwwAuthenticate[])

        const wwwArray = scheme;
        for (let i = 0; i < wwwArray.length; ++i) {
            if (i) {
                wwwAuthenticate = wwwAuthenticate + ', ';
            }

            wwwAuthenticate = wwwAuthenticate + wwwArray[i];
        }
    }

    err.output.headers['WWW-Authenticate'] = wwwAuthenticate;

    return err;
};


exports.paymentRequired = function (message, data) {

    return internals.create(402, message, data, exports.paymentRequired);
};


exports.forbidden = function (message, data) {

    return internals.create(403, message, data, exports.forbidden);
};


exports.notFound = function (message, data) {

    return internals.create(404, message, data, exports.notFound);
};


exports.methodNotAllowed = function (message, data, allow) {

    const err = internals.create(405, message, data, exports.methodNotAllowed);

    if (typeof allow === 'string') {
        allow = [allow];
    }

    if (Array.isArray(allow)) {
        err.output.headers.Allow = allow.join(', ');
    }

    return err;
};


exports.notAcceptable = function (message, data) {

    return internals.create(406, message, data, exports.notAcceptable);
};


exports.proxyAuthRequired = function (message, data) {

    return internals.create(407, message, data, exports.proxyAuthRequired);
};


exports.clientTimeout = function (message, data) {

    return internals.create(408, message, data, exports.clientTimeout);
};


exports.conflict = function (message, data) {

    return internals.create(409, message, data, exports.conflict);
};


exports.resourceGone = function (message, data) {

    return internals.create(410, message, data, exports.resourceGone);
};


exports.lengthRequired = function (message, data) {

    return internals.create(411, message, data, exports.lengthRequired);
};


exports.preconditionFailed = function (message, data) {

    return internals.create(412, message, data, exports.preconditionFailed);
};


exports.entityTooLarge = function (message, data) {

    return internals.create(413, message, data, exports.entityTooLarge);
};


exports.uriTooLong = function (message, data) {

    return internals.create(414, message, data, exports.uriTooLong);
};


exports.unsupportedMediaType = function (message, data) {

    return internals.create(415, message, data, exports.unsupportedMediaType);
};


exports.rangeNotSatisfiable = function (message, data) {

    return internals.create(416, message, data, exports.rangeNotSatisfiable);
};


exports.expectationFailed = function (message, data) {

    return internals.create(417, message, data, exports.expectationFailed);
};


exports.teapot = function (message, data) {

    return internals.create(418, message, data, exports.teapot);
};


exports.badData = function (message, data) {

    return internals.create(422, message, data, exports.badData);
};


exports.locked = function (message, data) {

    return internals.create(423, message, data, exports.locked);
};


exports.preconditionRequired = function (message, data) {

    return internals.create(428, message, data, exports.preconditionRequired);
};


exports.tooManyRequests = function (message, data) {

    return internals.create(429, message, data, exports.tooManyRequests);
};


exports.illegal = function (message, data) {

    return internals.create(451, message, data, exports.illegal);
};


// 5xx Server Errors

exports.internal = function (message, data, statusCode) {

    return internals.serverError(message, data, statusCode, exports.internal);
};


internals.serverError = function (message, data, statusCode, ctor) {

    if (data instanceof Error &&
        !data.isBoom) {

        return exports.wrap(data, statusCode, message);
    }

    const error = internals.create(statusCode || 500, message, undefined, ctor);
    error.data = data;
    return error;
};


exports.notImplemented = function (message, data) {

    return internals.serverError(message, data, 501, exports.notImplemented);
};


exports.badGateway = function (message, data) {

    return internals.serverError(message, data, 502, exports.badGateway);
};


exports.serverUnavailable = function (message, data) {

    return internals.serverError(message, data, 503, exports.serverUnavailable);
};


exports.gatewayTimeout = function (message, data) {

    return internals.serverError(message, data, 504, exports.gatewayTimeout);
};


exports.badImplementation = function (message, data) {

    const err = internals.serverError(message, data, 500, exports.badImplementation);
    err.isDeveloperError = true;
    return err;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Any = __webpack_require__(4);
const Cast = __webpack_require__(8);
const Errors = __webpack_require__(18);
const Lazy = __webpack_require__(66);
const Ref = __webpack_require__(5);


// Declare internals

const internals = {
    alternatives: __webpack_require__(20),
    array: __webpack_require__(67),
    boolean: __webpack_require__(33),
    binary: __webpack_require__(68),
    date: __webpack_require__(19),
    number: __webpack_require__(32),
    object: __webpack_require__(34),
    string: __webpack_require__(30)
};


internals.root = function () {

    const any = new Any();

    const root = any.clone();
    root.any = function () {

        Hoek.assert(arguments.length === 0, 'Joi.any() does not allow arguments.');

        return any;
    };

    root.alternatives = root.alt = function () {

        return arguments.length ? internals.alternatives.try.apply(internals.alternatives, arguments) : internals.alternatives;
    };

    root.array = function () {

        Hoek.assert(arguments.length === 0, 'Joi.array() does not allow arguments.');

        return internals.array;
    };

    root.boolean = root.bool = function () {

        Hoek.assert(arguments.length === 0, 'Joi.boolean() does not allow arguments.');

        return internals.boolean;
    };

    root.binary = function () {

        Hoek.assert(arguments.length === 0, 'Joi.binary() does not allow arguments.');

        return internals.binary;
    };

    root.date = function () {

        Hoek.assert(arguments.length === 0, 'Joi.date() does not allow arguments.');

        return internals.date;
    };

    root.func = function () {

        Hoek.assert(arguments.length === 0, 'Joi.func() does not allow arguments.');

        return internals.object._func();
    };

    root.number = function () {

        Hoek.assert(arguments.length === 0, 'Joi.number() does not allow arguments.');

        return internals.number;
    };

    root.object = function () {

        return arguments.length ? internals.object.keys.apply(internals.object, arguments) : internals.object;
    };

    root.string = function () {

        Hoek.assert(arguments.length === 0, 'Joi.string() does not allow arguments.');

        return internals.string;
    };

    root.ref = function () {

        return Ref.create.apply(null, arguments);
    };

    root.isRef = function (ref) {

        return Ref.isRef(ref);
    };

    root.validate = function (value /*, [schema], [options], callback */) {

        const last = arguments[arguments.length - 1];
        const callback = typeof last === 'function' ? last : null;

        const count = arguments.length - (callback ? 1 : 0);
        if (count === 1) {
            return any.validate(value, callback);
        }

        const options = count === 3 ? arguments[2] : {};
        const schema = root.compile(arguments[1]);

        return schema._validateWithOptions(value, options, callback);
    };

    root.describe = function () {

        const schema = arguments.length ? root.compile(arguments[0]) : any;
        return schema.describe();
    };

    root.compile = function (schema) {

        try {
            return Cast.schema(schema);
        }
        catch (err) {
            if (err.hasOwnProperty('path')) {
                err.message = err.message + '(' + err.path + ')';
            }
            throw err;
        }
    };

    root.assert = function (value, schema, message) {

        root.attempt(value, schema, message);
    };

    root.attempt = function (value, schema, message) {

        const result = root.validate(value, schema);
        const error = result.error;
        if (error) {
            if (!message) {
                if (typeof error.annotate === 'function') {
                    error.message = error.annotate();
                }
                throw error;
            }

            if (!(message instanceof Error)) {
                if (typeof error.annotate === 'function') {
                    error.message = `${message} ${error.annotate()}`;
                }
                throw error;
            }

            throw message;
        }

        return result.value;
    };

    root.reach = function (schema, path) {

        Hoek.assert(schema && schema instanceof Any, 'you must provide a joi schema');
        Hoek.assert(typeof path === 'string', 'path must be a string');

        if (path === '') {
            return schema;
        }

        const parts = path.split('.');
        const children = schema._inner.children;
        if (!children) {
            return;
        }

        const key = parts[0];
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            if (child.key === key) {
                return this.reach(child.schema, path.substr(key.length + 1));
            }
        }
    };

    root.lazy = function (fn) {

        return Lazy.set(fn);
    };

    root.extend = function () {

        const extensions = Hoek.flatten(Array.prototype.slice.call(arguments));
        Hoek.assert(extensions.length > 0, 'You need to provide at least one extension');

        this.assert(extensions, root.extensionsSchema);

        const joi = Object.create(this.any());
        Object.assign(joi, this);

        for (let i = 0; i < extensions.length; ++i) {
            let extension = extensions[i];

            if (typeof extension === 'function') {
                extension = extension(joi);
            }

            this.assert(extension, root.extensionSchema);

            const base = (extension.base || this.any()).clone(); // Cloning because we're going to override language afterwards
            const ctor = base.constructor;
            const type = class extends ctor { // eslint-disable-line no-loop-func

                constructor() {

                    super();
                    if (extension.base) {
                        Object.assign(this, base);
                    }

                    this._type = extension.name;

                    if (extension.language) {
                        this._settings = this._settings || { language: {} };
                        this._settings.language = Hoek.applyToDefaults(this._settings.language, {
                            [extension.name]: extension.language
                        });
                    }
                }

            };

            if (extension.coerce) {
                type.prototype._coerce = function (value, state, options) {

                    if (ctor.prototype._coerce) {
                        const baseRet = ctor.prototype._coerce.call(this, value, state, options);

                        if (baseRet.errors) {
                            return baseRet;
                        }

                        value = baseRet.value;
                    }

                    const ret = extension.coerce.call(this, value, state, options);
                    if (ret instanceof Errors.Err) {
                        return { value, errors: ret };
                    }

                    return { value: ret };
                };
            }
            if (extension.pre) {
                type.prototype._base = function (value, state, options) {

                    if (ctor.prototype._base) {
                        const baseRet = ctor.prototype._base.call(this, value, state, options);

                        if (baseRet.errors) {
                            return baseRet;
                        }

                        value = baseRet.value;
                    }

                    const ret = extension.pre.call(this, value, state, options);
                    if (ret instanceof Errors.Err) {
                        return { value, errors: ret };
                    }

                    return { value: ret };
                };
            }

            if (extension.rules) {
                for (let j = 0; j < extension.rules.length; ++j) {
                    const rule = extension.rules[j];
                    const ruleArgs = rule.params ?
                        (rule.params instanceof Any ? rule.params._inner.children.map((k) => k.key) : Object.keys(rule.params)) :
                        [];
                    const validateArgs = rule.params ? Cast.schema(rule.params) : null;

                    type.prototype[rule.name] = function () { // eslint-disable-line no-loop-func

                        if (arguments.length > ruleArgs.length) {
                            throw new Error('Unexpected number of arguments');
                        }

                        const args = Array.prototype.slice.call(arguments);
                        let hasRef = false;
                        let arg = {};

                        for (let k = 0; k < ruleArgs.length; ++k) {
                            arg[ruleArgs[k]] = args[k];
                            if (!hasRef && Ref.isRef(args[k])) {
                                hasRef = true;
                            }
                        }

                        if (validateArgs) {
                            arg = joi.attempt(arg, validateArgs);
                        }

                        let schema;
                        if (rule.validate) {
                            const validate = function (value, state, options) {

                                return rule.validate.call(this, arg, value, state, options);
                            };

                            schema = this._test(rule.name, arg, validate, {
                                description: rule.description,
                                hasRef
                            });
                        }
                        else {
                            schema = this.clone();
                        }

                        if (rule.setup) {
                            const newSchema = rule.setup.call(schema, arg);
                            if (newSchema !== undefined) {
                                Hoek.assert(newSchema instanceof Any, `Setup of extension Joi.${this._type}().${rule.name}() must return undefined or a Joi object`);
                                schema = newSchema;
                            }
                        }

                        return schema;
                    };
                }
            }

            if (extension.describe) {
                type.prototype.describe = function () {

                    const description = ctor.prototype.describe.call(this);
                    return extension.describe.call(this, description);
                };
            }

            const instance = new type();
            joi[extension.name] = function () {

                return instance;
            };
        }

        return joi;
    };

    root.extensionSchema = internals.object.keys({
        base: internals.object.type(Any, 'Joi object'),
        name: internals.string.required(),
        coerce: internals.object._func().arity(3),
        pre: internals.object._func().arity(3),
        language: internals.object,
        describe: internals.object._func().arity(1),
        rules: internals.array.items(internals.object.keys({
            name: internals.string.required(),
            setup: internals.object._func().arity(1),
            validate: internals.object._func().arity(4),
            params: [
                internals.object.pattern(/.*/, internals.object.type(Any, 'Joi object')),
                internals.object.type(internals.object.constructor, 'Joi object')
            ],
            description: [internals.string, internals.object._func().arity(1)]
        }).or('setup', 'validate'))
    }).strict();

    root.extensionsSchema = internals.array.items([internals.object, internals.object._func().arity(1)]).strict();

    root.version = __webpack_require__(69).version;

    return root;
};


module.exports = internals.root();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Ref = __webpack_require__(5);
const Errors = __webpack_require__(18);
let Alternatives = null;                // Delay-loaded to prevent circular dependencies
let Cast = null;


// Declare internals

const internals = {
    Set: __webpack_require__(29)
};


internals.defaults = {
    abortEarly: true,
    convert: true,
    allowUnknown: false,
    skipFunctions: false,
    stripUnknown: false,
    language: {},
    presence: 'optional',
    strip: false,
    noDefaults: false

    // context: null
};


module.exports = internals.Any = class {

    constructor() {

        Cast = Cast || __webpack_require__(8);

        this.isJoi = true;
        this._type = 'any';
        this._settings = null;
        this._valids = new internals.Set();
        this._invalids = new internals.Set();
        this._tests = [];
        this._refs = [];
        this._flags = {
            /*
             presence: 'optional',                   // optional, required, forbidden, ignore
             allowOnly: false,
             allowUnknown: undefined,
             default: undefined,
             forbidden: false,
             encoding: undefined,
             insensitive: false,
             trim: false,
             case: undefined,                        // upper, lower
             empty: undefined,
             func: false,
             raw: false
             */
        };

        this._description = null;
        this._unit = null;
        this._notes = [];
        this._tags = [];
        this._examples = [];
        this._meta = [];

        this._inner = {};                           // Hash of arrays of immutable objects
    }

    createError(type, context, state, options) {

        return Errors.create(type, context, state, options, this._flags);
    }

    createOverrideError(type, context, state, options, message, template) {

        return Errors.create(type, context, state, options, this._flags, message, template);
    }

    checkOptions(options) {

        const Schemas = __webpack_require__(65);
        const result = Schemas.options.validate(options);
        if (result.error) {
            throw new Error(result.error.details[0].message);
        }
    }

    clone() {

        const obj = Object.create(Object.getPrototypeOf(this));

        obj.isJoi = true;
        obj._type = this._type;
        obj._settings = internals.concatSettings(this._settings);
        obj._baseType = this._baseType;
        obj._valids = Hoek.clone(this._valids);
        obj._invalids = Hoek.clone(this._invalids);
        obj._tests = this._tests.slice();
        obj._refs = this._refs.slice();
        obj._flags = Hoek.clone(this._flags);

        obj._description = this._description;
        obj._unit = this._unit;
        obj._notes = this._notes.slice();
        obj._tags = this._tags.slice();
        obj._examples = this._examples.slice();
        obj._meta = this._meta.slice();

        obj._inner = {};
        const inners = Object.keys(this._inner);
        for (let i = 0; i < inners.length; ++i) {
            const key = inners[i];
            obj._inner[key] = this._inner[key] ? this._inner[key].slice() : null;
        }

        return obj;
    }

    concat(schema) {

        Hoek.assert(schema instanceof internals.Any, 'Invalid schema object');
        Hoek.assert(this._type === 'any' || schema._type === 'any' || schema._type === this._type, 'Cannot merge type', this._type, 'with another type:', schema._type);

        let obj = this.clone();

        if (this._type === 'any' && schema._type !== 'any') {

            // Reset values as if we were "this"
            const tmpObj = schema.clone();
            const keysToRestore = ['_settings', '_valids', '_invalids', '_tests', '_refs', '_flags', '_description', '_unit',
                '_notes', '_tags', '_examples', '_meta', '_inner'];

            for (let i = 0; i < keysToRestore.length; ++i) {
                tmpObj[keysToRestore[i]] = obj[keysToRestore[i]];
            }

            obj = tmpObj;
        }

        obj._settings = obj._settings ? internals.concatSettings(obj._settings, schema._settings) : schema._settings;
        obj._valids.merge(schema._valids, schema._invalids);
        obj._invalids.merge(schema._invalids, schema._valids);
        obj._tests = obj._tests.concat(schema._tests);
        obj._refs = obj._refs.concat(schema._refs);
        Hoek.merge(obj._flags, schema._flags);

        obj._description = schema._description || obj._description;
        obj._unit = schema._unit || obj._unit;
        obj._notes = obj._notes.concat(schema._notes);
        obj._tags = obj._tags.concat(schema._tags);
        obj._examples = obj._examples.concat(schema._examples);
        obj._meta = obj._meta.concat(schema._meta);

        const inners = Object.keys(schema._inner);
        const isObject = obj._type === 'object';
        for (let i = 0; i < inners.length; ++i) {
            const key = inners[i];
            const source = schema._inner[key];
            if (source) {
                const target = obj._inner[key];
                if (target) {
                    if (isObject && key === 'children') {
                        const keys = {};

                        for (let j = 0; j < target.length; ++j) {
                            keys[target[j].key] = j;
                        }

                        for (let j = 0; j < source.length; ++j) {
                            const sourceKey = source[j].key;
                            if (keys[sourceKey] >= 0) {
                                target[keys[sourceKey]] = {
                                    key: sourceKey,
                                    schema: target[keys[sourceKey]].schema.concat(source[j].schema)
                                };
                            }
                            else {
                                target.push(source[j]);
                            }
                        }
                    }
                    else {
                        obj._inner[key] = obj._inner[key].concat(source);
                    }
                }
                else {
                    obj._inner[key] = source.slice();
                }
            }
        }

        return obj;
    }

    _test(name, arg, func, options) {

        const obj = this.clone();
        obj._tests.push({ func, name, arg, options });
        return obj;
    }

    options(options) {

        Hoek.assert(!options.context, 'Cannot override context');
        this.checkOptions(options);

        const obj = this.clone();
        obj._settings = internals.concatSettings(obj._settings, options);
        return obj;
    }

    strict(isStrict) {

        const obj = this.clone();
        obj._settings = obj._settings || {};
        obj._settings.convert = isStrict === undefined ? false : !isStrict;
        return obj;
    }

    raw(isRaw) {

        const value = isRaw === undefined ? true : isRaw;

        if (this._flags.raw === value) {
            return this;
        }

        const obj = this.clone();
        obj._flags.raw = value;
        return obj;
    }

    error(err) {

        Hoek.assert(err && (err instanceof Error || typeof err === 'function'), 'Must provide a valid Error object or a function');

        const obj = this.clone();
        obj._flags.error = err;
        return obj;
    }

    allow() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
            obj._invalids.remove(value);
            obj._valids.add(value, obj._refs);
        }
        return obj;
    }

    valid() {

        const obj = this.allow.apply(this, arguments);
        obj._flags.allowOnly = true;
        return obj;
    }

    invalid(value) {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call allow/valid/invalid with undefined');
            obj._valids.remove(value);
            obj._invalids.add(value, this._refs);
        }

        return obj;
    }

    required() {

        if (this._flags.presence === 'required') {
            return this;
        }

        const obj = this.clone();
        obj._flags.presence = 'required';
        return obj;
    }

    optional() {

        if (this._flags.presence === 'optional') {
            return this;
        }

        const obj = this.clone();
        obj._flags.presence = 'optional';
        return obj;
    }


    forbidden() {

        if (this._flags.presence === 'forbidden') {
            return this;
        }

        const obj = this.clone();
        obj._flags.presence = 'forbidden';
        return obj;
    }


    strip() {

        if (this._flags.strip) {
            return this;
        }

        const obj = this.clone();
        obj._flags.strip = true;
        return obj;
    }

    applyFunctionToChildren(children, fn, args, root) {

        children = [].concat(children);

        if (children.length !== 1 || children[0] !== '') {
            root = root ? (root + '.') : '';

            const extraChildren = (children[0] === '' ? children.slice(1) : children).map((child) => {

                return root + child;
            });

            throw new Error('unknown key(s) ' + extraChildren.join(', '));
        }

        return this[fn].apply(this, args);
    }

    default(value, description) {

        if (typeof value === 'function' &&
            !Ref.isRef(value)) {

            if (!value.description &&
                description) {

                value.description = description;
            }

            if (!this._flags.func) {
                Hoek.assert(typeof value.description === 'string' && value.description.length > 0, 'description must be provided when default value is a function');
            }
        }

        const obj = this.clone();
        obj._flags.default = value;
        Ref.push(obj._refs, value);
        return obj;
    }

    empty(schema) {

        const obj = this.clone();
        obj._flags.empty = schema === undefined ? undefined : Cast.schema(schema);
        return obj;
    }

    when(ref, options) {

        Hoek.assert(options && typeof options === 'object', 'Invalid options');
        Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');

        const then = options.hasOwnProperty('then') ? this.concat(Cast.schema(options.then)) : undefined;
        const otherwise = options.hasOwnProperty('otherwise') ? this.concat(Cast.schema(options.otherwise)) : undefined;

        Alternatives = Alternatives || __webpack_require__(20);
        const obj = Alternatives.when(ref, { is: options.is, then, otherwise });
        obj._flags.presence = 'ignore';
        obj._baseType = this;

        return obj;
    }

    description(desc) {

        Hoek.assert(desc && typeof desc === 'string', 'Description must be a non-empty string');

        const obj = this.clone();
        obj._description = desc;
        return obj;
    }

    notes(notes) {

        Hoek.assert(notes && (typeof notes === 'string' || Array.isArray(notes)), 'Notes must be a non-empty string or array');

        const obj = this.clone();
        obj._notes = obj._notes.concat(notes);
        return obj;
    }

    tags(tags) {

        Hoek.assert(tags && (typeof tags === 'string' || Array.isArray(tags)), 'Tags must be a non-empty string or array');

        const obj = this.clone();
        obj._tags = obj._tags.concat(tags);
        return obj;
    }

    meta(meta) {

        Hoek.assert(meta !== undefined, 'Meta cannot be undefined');

        const obj = this.clone();
        obj._meta = obj._meta.concat(meta);
        return obj;
    }

    example(value) {

        Hoek.assert(arguments.length, 'Missing example');
        const result = this._validate(value, null, internals.defaults);
        Hoek.assert(!result.errors, 'Bad example:', result.errors && Errors.process(result.errors, value));

        const obj = this.clone();
        obj._examples.push(value);
        return obj;
    }

    unit(name) {

        Hoek.assert(name && typeof name === 'string', 'Unit name must be a non-empty string');

        const obj = this.clone();
        obj._unit = name;
        return obj;
    }

    _prepareEmptyValue(value) {

        if (typeof value === 'string' && this._flags.trim) {
            return value.trim();
        }

        return value;
    }

    _validate(value, state, options, reference) {

        const originalValue = value;

        // Setup state and settings

        state = state || { key: '', path: '', parent: null, reference };

        if (this._settings) {
            options = internals.concatSettings(options, this._settings);
        }

        let errors = [];
        const finish = () => {

            let finalValue;

            if (value !== undefined) {
                finalValue = this._flags.raw ? originalValue : value;
            }
            else if (options.noDefaults) {
                finalValue = value;
            }
            else if (Ref.isRef(this._flags.default)) {
                finalValue = this._flags.default(state.parent, options);
            }
            else if (typeof this._flags.default === 'function' &&
                !(this._flags.func && !this._flags.default.description)) {

                let args;

                if (state.parent !== null &&
                    this._flags.default.length > 0) {

                    args = [Hoek.clone(state.parent), options];
                }

                const defaultValue = internals._try(this._flags.default, args);
                finalValue = defaultValue.value;
                if (defaultValue.error) {
                    errors.push(this.createError('any.default', defaultValue.error, state, options));
                }
            }
            else {
                finalValue = Hoek.clone(this._flags.default);
            }

            if (errors.length && typeof this._flags.error === 'function') {
                const change = this._flags.error.call(this, errors);

                if (typeof change === 'string') {
                    errors = [this.createOverrideError('override', { reason: errors }, state, options, change)];
                }
                else {
                    errors = [].concat(change)
                        .map((err) => {

                            return err instanceof Error ?
                                err :
                                this.createOverrideError(err.type || 'override', err.context, state, options, err.message, err.template);
                        });
                }
            }

            return {
                value: this._flags.strip ? undefined : finalValue,
                finalValue,
                errors: errors.length ? errors : null
            };
        };

        if (this._coerce) {
            const coerced = this._coerce.call(this, value, state, options);
            if (coerced.errors) {
                value = coerced.value;
                errors = errors.concat(coerced.errors);
                return finish();                            // Coerced error always aborts early
            }

            value = coerced.value;
        }

        if (this._flags.empty && !this._flags.empty._validate(this._prepareEmptyValue(value), null, internals.defaults).errors) {
            value = undefined;
        }

        // Check presence requirements

        const presence = this._flags.presence || options.presence;
        if (presence === 'optional') {
            if (value === undefined) {
                const isDeepDefault = this._flags.hasOwnProperty('default') && this._flags.default === undefined;
                if (isDeepDefault && this._type === 'object') {
                    value = {};
                }
                else {
                    return finish();
                }
            }
        }
        else if (presence === 'required' &&
            value === undefined) {

            errors.push(this.createError('any.required', null, state, options));
            return finish();
        }
        else if (presence === 'forbidden') {
            if (value === undefined) {
                return finish();
            }

            errors.push(this.createError('any.unknown', null, state, options));
            return finish();
        }

        // Check allowed and denied values using the original value

        if (this._valids.has(value, state, options, this._flags.insensitive)) {
            return finish();
        }

        if (this._invalids.has(value, state, options, this._flags.insensitive)) {
            errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
            if (options.abortEarly ||
                value === undefined) {          // No reason to keep validating missing value

                return finish();
            }
        }

        // Convert value and validate type

        if (this._base) {
            const base = this._base.call(this, value, state, options);
            if (base.errors) {
                value = base.value;
                errors = errors.concat(base.errors);
                return finish();                            // Base error always aborts early
            }

            if (base.value !== value) {
                value = base.value;

                // Check allowed and denied values using the converted value

                if (this._valids.has(value, state, options, this._flags.insensitive)) {
                    return finish();
                }

                if (this._invalids.has(value, state, options, this._flags.insensitive)) {
                    errors.push(this.createError(value === '' ? 'any.empty' : 'any.invalid', null, state, options));
                    if (options.abortEarly) {
                        return finish();
                    }
                }
            }
        }

        // Required values did not match

        if (this._flags.allowOnly) {
            errors.push(this.createError('any.allowOnly', { valids: this._valids.values({ stripUndefined: true }) }, state, options));
            if (options.abortEarly) {
                return finish();
            }
        }

        // Helper.validate tests

        for (let i = 0; i < this._tests.length; ++i) {
            const test = this._tests[i];
            const ret = test.func.call(this, value, state, options);
            if (ret instanceof Errors.Err) {
                errors.push(ret);
                if (options.abortEarly) {
                    return finish();
                }
            }
            else {
                value = ret;
            }
        }

        return finish();
    }

    _validateWithOptions(value, options, callback) {

        if (options) {
            this.checkOptions(options);
        }

        const settings = internals.concatSettings(internals.defaults, options);
        const result = this._validate(value, null, settings);
        const errors = Errors.process(result.errors, value);

        if (callback) {
            return callback(errors, result.value);
        }

        return { error: errors, value: result.value };
    }

    validate(value, options, callback) {

        if (typeof options === 'function') {
            return this._validateWithOptions(value, null, options);
        }

        return this._validateWithOptions(value, options, callback);
    }

    describe() {

        const description = {
            type: this._type
        };

        const flags = Object.keys(this._flags);
        if (flags.length) {
            if (['empty', 'default', 'lazy', 'label'].some((flag) => this._flags.hasOwnProperty(flag))) {
                description.flags = {};
                for (let i = 0; i < flags.length; ++i) {
                    const flag = flags[i];
                    if (flag === 'empty') {
                        description.flags[flag] = this._flags[flag].describe();
                    }
                    else if (flag === 'default') {
                        if (Ref.isRef(this._flags[flag])) {
                            description.flags[flag] = this._flags[flag].toString();
                        }
                        else if (typeof this._flags[flag] === 'function') {
                            description.flags[flag] = this._flags[flag].description;
                        }
                        else {
                            description.flags[flag] = this._flags[flag];
                        }
                    }
                    else if (flag === 'lazy' || flag === 'label') {
                        // We don't want it in the description
                    }
                    else {
                        description.flags[flag] = this._flags[flag];
                    }
                }
            }
            else {
                description.flags = this._flags;
            }
        }

        if (this._settings) {
            description.options = Hoek.clone(this._settings);
        }

        if (this._baseType) {
            description.base = this._baseType.describe();
        }

        if (this._description) {
            description.description = this._description;
        }

        if (this._notes.length) {
            description.notes = this._notes;
        }

        if (this._tags.length) {
            description.tags = this._tags;
        }

        if (this._meta.length) {
            description.meta = this._meta;
        }

        if (this._examples.length) {
            description.examples = this._examples;
        }

        if (this._unit) {
            description.unit = this._unit;
        }

        const valids = this._valids.values();
        if (valids.length) {
            description.valids = valids.map((v) => {

                return Ref.isRef(v) ? v.toString() : v;
            });
        }

        const invalids = this._invalids.values();
        if (invalids.length) {
            description.invalids = invalids.map((v) => {

                return Ref.isRef(v) ? v.toString() : v;
            });
        }

        description.rules = [];

        for (let i = 0; i < this._tests.length; ++i) {
            const validator = this._tests[i];
            const item = { name: validator.name };

            if (validator.arg !== void 0) {
                item.arg = Ref.isRef(validator.arg) ? validator.arg.toString() : validator.arg;
            }

            const options = validator.options;
            if (options) {
                if (options.hasRef) {
                    item.arg = {};
                    const keys = Object.keys(validator.arg);
                    for (let j = 0; j < keys.length; ++j) {
                        const key = keys[j];
                        const value = validator.arg[key];
                        item.arg[key] = Ref.isRef(value) ? value.toString() : value;
                    }
                }

                if (typeof options.description === 'string') {
                    item.description = options.description;
                }
                else if (typeof options.description === 'function') {
                    item.description = options.description(item.arg);
                }
            }

            description.rules.push(item);
        }

        if (!description.rules.length) {
            delete description.rules;
        }

        const label = this._getLabel();
        if (label) {
            description.label = label;
        }

        return description;
    }

    label(name) {

        Hoek.assert(name && typeof name === 'string', 'Label name must be a non-empty string');

        const obj = this.clone();
        obj._flags.label = name;
        return obj;
    }

    _getLabel(def) {

        return this._flags.label || def;
    }

};


internals.Any.prototype.isImmutable = true;     // Prevents Hoek from deep cloning schema objects

// Aliases

internals.Any.prototype.only = internals.Any.prototype.equal = internals.Any.prototype.valid;
internals.Any.prototype.disallow = internals.Any.prototype.not = internals.Any.prototype.invalid;
internals.Any.prototype.exist = internals.Any.prototype.required;


internals._try = function (fn, args) {

    let err;
    let result;

    try {
        result = fn.apply(null, args);
    }
    catch (e) {
        err = e;
    }

    return {
        value: result,
        error: err
    };
};

internals.concatSettings = function (target, source) {

    // Used to avoid cloning context

    if (!target &&
        !source) {

        return null;
    }

    const obj = {};

    if (target) {
        Object.assign(obj, target);
    }

    if (source) {
        const sKeys = Object.keys(source);
        for (let i = 0; i < sKeys.length; ++i) {
            const key = sKeys[i];
            if (key !== 'language' ||
                !obj.hasOwnProperty(key)) {

                obj[key] = source[key];
            }
            else {
                obj[key] = Hoek.applyToDefaults(obj[key], source[key]);
            }
        }
    }

    return obj;
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports.create = function (key, options) {

    Hoek.assert(typeof key === 'string', 'Invalid reference key:', key);

    const settings = Hoek.clone(options);         // options can be reused and modified

    const ref = function (value, validationOptions) {

        return Hoek.reach(ref.isContext ? validationOptions.context : value, ref.key, settings);
    };

    ref.isContext = (key[0] === ((settings && settings.contextPrefix) || '$'));
    ref.key = (ref.isContext ? key.slice(1) : key);
    ref.path = ref.key.split((settings && settings.separator) || '.');
    ref.depth = ref.path.length;
    ref.root = ref.path[0];
    ref.isJoi = true;

    ref.toString = function () {

        return (ref.isContext ? 'context:' : 'ref:') + ref.key;
    };

    return ref;
};


exports.isRef = function (ref) {

    return typeof ref === 'function' && ref.isJoi;
};


exports.push = function (array, ref) {

    if (exports.isRef(ref) &&
        !ref.isContext) {

        array.push(ref.root);
    }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.serial = function (array, method, callback) {

    if (!array.length) {
        callback();
    }
    else {
        let i = 0;
        const iterate = function () {

            const done = function (err) {

                if (err) {
                    callback(err);
                }
                else {
                    i = i + 1;
                    if (i < array.length) {
                        iterate();
                    }
                    else {
                        callback();
                    }
                }
            };

            method(array[i], done, i);
        };

        iterate();
    }
};


exports.parallel = function (array, method, callback) {

    if (!array.length) {
        callback();
    }
    else {
        let count = 0;
        let errored = false;

        const done = function (err) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                }
                else {
                    count = count + 1;
                    if (count === array.length) {
                        callback();
                    }
                }
            }
        };

        for (let i = 0; i < array.length; ++i) {
            method(array[i], done, i);
        }
    }
};


exports.parallel.execute = function (fnObj, callback) {

    const result = {};
    if (!fnObj) {
        return callback(null, result);
    }

    const keys = Object.keys(fnObj);
    let count = 0;
    let errored = false;

    if (!keys.length) {
        return callback(null, result);
    }

    const done = function (key) {

        return function (err, val) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                }
                else {
                    result[key] = val;
                    if (++count === keys.length) {
                        callback(null, result);
                    }
                }
            }
        };
    };

    for (let i = 0; i < keys.length; ++i) {
        if (!errored) {
            const key = keys[i];
            fnObj[key](done(key));
        }
    }
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Ref = __webpack_require__(5);

// Type modules are delay-loaded to prevent circular dependencies


// Declare internals

const internals = {
    any: null,
    date: __webpack_require__(19),
    string: __webpack_require__(30),
    number: __webpack_require__(32),
    boolean: __webpack_require__(33),
    alt: null,
    object: null
};


exports.schema = function (config) {

    internals.any = internals.any || new (__webpack_require__(4))();
    internals.alt = internals.alt || __webpack_require__(20);
    internals.object = internals.object || __webpack_require__(34);

    if (config !== undefined && config !== null && typeof config === 'object') {

        if (config.isJoi) {
            return config;
        }

        if (Array.isArray(config)) {
            return internals.alt.try(config);
        }

        if (config instanceof RegExp) {
            return internals.string.regex(config);
        }

        if (config instanceof Date) {
            return internals.date.valid(config);
        }

        return internals.object.keys(config);
    }

    if (typeof config === 'string') {
        return internals.string.valid(config);
    }

    if (typeof config === 'number') {
        return internals.number.valid(config);
    }

    if (typeof config === 'boolean') {
        return internals.boolean.valid(config);
    }

    if (Ref.isRef(config)) {
        return internals.any.valid(config);
    }

    Hoek.assert(config === null, 'Invalid schema content:', config);

    return internals.any.valid(null);
};


exports.ref = function (id) {

    return Ref.isRef(id) ? id : Ref.create(id);
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Joi = __webpack_require__(3);


// Declare internals

const internals = {
    schema: {
        base: Joi.object({
            name: Joi.string().required(),
            clone: Joi.boolean(),
            tags: Joi.boolean(),
            spread: Joi.boolean(),
            channels: Joi.array().items(Joi.string()).single().unique().min(1)
        })
    }
};


internals.schema.event = internals.schema.base.keys({
    shared: Joi.boolean()
});


internals.schema.listener = internals.schema.event.keys({
    listener: Joi.func().required(),
    block: Joi.number().integer().min(1).allow(true),
    count: Joi.number().integer().min(1),
    filter: {
        tags: Joi.array().items(Joi.string()).single().unique().min(1).required(),
        all: Joi.boolean()
    }
});


exports = module.exports = internals.Podium = function (events) {

    // Use descriptive names to avoid conflict when inherited

    this._eventListeners = Object.create(null);
    this._notificationsQueue = [];
    this._eventsProcessing = false;
    this._sourcePodiums = [];

    this.onPodiumError = null;

    if (events) {
        this.registerEvent(events);
    }
};


internals.Podium.decorate = function (target, source) {

    internals.Podium.call(target, null);

    Object.keys(source._eventListeners).forEach((name) => {

        target._eventListeners[name] = {
            handlers: null,
            flags: source._eventListeners[name].flags
        };
    });
};


internals.Podium.prototype.registerEvent = function (events) {

    events = Hoek.flatten([].concat(events));
    events.forEach((event) => {

        if (!event) {
            return;
        }

        if (event instanceof internals.Podium) {
            return this.registerPodium(event);
        }

        if (typeof event === 'string') {
            event = { name: event };
        }

        event = Joi.attempt(event, internals.schema.event, 'Invalid event options');

        const name = event.name;
        if (this._eventListeners[name]) {
            Hoek.assert(event.shared, `Event ${name} exists`);
            return;
        }

        this._eventListeners[name] = { handlers: null, flags: event };
        this._sourcePodiums.forEach((podium) => {

            if (!podium._eventListeners[name]) {
                podium._eventListeners[name] = { handlers: null, flags: event };
            }
        });
    });
};


internals.Podium.prototype.registerPodium = function (podiums) {

    [].concat(podiums).forEach((podium) => {

        if (podium._sourcePodiums.indexOf(this) !== -1) {
            return;
        }

        podium._sourcePodiums.push(this);
        Object.keys(podium._eventListeners).forEach((name) => {

            if (!this._eventListeners[name]) {
                this._eventListeners[name] = { handlers: null, flags: podium._eventListeners[name].flags };
            }
        });
    });
};


internals.Podium.prototype.emit = function (criteria, data, callback) {

    return this._emit(criteria, data, false, callback);
};


internals.Podium.prototype._emit = function (criteria, data, generated, callback) {

    criteria = internals.criteria(criteria);

    const name = criteria.name;
    Hoek.assert(name, 'Criteria missing event name');

    const event = this._eventListeners[name];
    Hoek.assert(event, `Unknown event ${name}`);
    Hoek.assert(!event.flags.spread || Array.isArray(data) || typeof data === 'function', 'Data must be an array for spread event');
    Hoek.assert(!criteria.channel || typeof criteria.channel === 'string', 'Invalid channel name');
    Hoek.assert(!criteria.channel || !event.flags.channels || event.flags.channels.indexOf(criteria.channel) !== -1, `Unknown ${criteria.channel} channel`);

    if (typeof criteria.tags === 'string') {
        criteria.tags = [criteria.tags];
    }

    if (criteria.tags &&
        Array.isArray(criteria.tags)) {

        criteria.tags = Hoek.mapToObject(criteria.tags);
    }

    internals.emit(this, { criteria, data, callback, generated });
};


internals.emit = function (emitter, notification) {

    if (notification) {
        emitter._notificationsQueue.push(notification);
    }

    if (emitter._eventsProcessing ||
        !emitter._notificationsQueue.length) {

        return;
    }

    emitter._eventsProcessing = true;
    const item = emitter._notificationsQueue.shift();

    const event = emitter._eventListeners[item.criteria.name];
    const handlers = event.handlers;

    const finalize = () => {

        if (item.callback) {
            process.nextTick(internals.itemCallback, item);
        }

        emitter._eventsProcessing = false;
        process.nextTick(internals.emitEmitter, emitter);
    };

    let data = item.data;
    let generated = item.generated;

    const relay = () => {

        if (!emitter._sourcePodiums.length) {
            return finalize();
        }

        const each = (podium, next) => podium._emit(item.criteria, data, generated, next);        // User _emit() in case emit() was modified
        Items.parallel(emitter._sourcePodiums.slice(), each, finalize);
    };

    if (!handlers) {
        return relay();
    }

    const each = (handler, next) => {

        if (handler.count) {
            --handler.count;
            if (handler.count < 1) {
                internals.removeHandler(emitter, item.criteria.name, handler);
            }
        }

        const invoke = (func) => {

            if (handler.channels &&
                (!item.criteria.channel || handler.channels.indexOf(item.criteria.channel) === -1)) {

                return;
            }

            if (handler.filter) {
                if (!item.criteria.tags) {
                    return;
                }

                const match = Hoek.intersect(item.criteria.tags, handler.filter.tags, !handler.filter.all);
                if (!match ||
                    (handler.filter.all && match.length !== handler.filter.tags.length)) {

                    return;
                }
            }

            if (!generated &&
                typeof data === 'function') {

                data = item.data();
                generated = true;
            }

            const update = (internals.flag('clone', handler, event) ? Hoek.clone(data) : data);
            const args = (internals.flag('spread', handler, event) && Array.isArray(update) ? update : [update]);

            if (internals.flag('tags', handler, event) &&
                item.criteria.tags) {

                args.push(item.criteria.tags);
            }

            if (func) {
                args.push(func);
            }

            internals.handler(handler, args, emitter);
        };

        if (!handler.block) {
            invoke();
            return next();
        }

        let timer = null;
        if (handler.block !== true) {
            next = Hoek.once(next);
            timer = setTimeout(next, handler.block);
        }

        invoke(() => {

            clearTimeout(timer);
            return next();
        });
    };

    return Items.parallel(handlers.slice(), each, relay);        // Clone in case handlers are changed by listeners
};


internals.handler = function (handler, args, emitter) {

    if (!emitter.onPodiumError) {
        return handler.listener.apply(null, args);
    }

    try {
        handler.listener.apply(null, args);
    }
    catch (err) {
        emitter.onPodiumError(err);
    }
};


internals.itemCallback = function (item) {

    item.callback();
};


internals.emitEmitter = function (emitter) {

    internals.emit(emitter);
};


internals.Podium.prototype.on = internals.Podium.prototype.addListener = function (criteria, listener) {

    criteria = internals.criteria(criteria);
    criteria.listener = listener;

    if (criteria.filter &&
        (typeof criteria.filter === 'string' || Array.isArray(criteria.filter))) {

        criteria.filter = { tags: criteria.filter };
    }

    criteria = Joi.attempt(criteria, internals.schema.listener, 'Invalid event listener options');

    const name = criteria.name;
    const event = this._eventListeners[name];
    Hoek.assert(event, `Unknown event ${name}`);
    Hoek.assert(!criteria.channels || !event.flags.channels || Hoek.intersect(event.flags.channels, criteria.channels).length === criteria.channels.length, `Unknown event channels ${criteria.channels && criteria.channels.join(', ')}`);

    this._eventListeners[name].handlers = this._eventListeners[name].handlers || [];
    this._eventListeners[name].handlers.push(criteria);

    return this;
};


internals.Podium.prototype.once = function (criteria, listener) {

    criteria = internals.criteria(criteria);
    return this.on(Object.assign(criteria, { count: 1 }), listener);
};


internals.Podium.prototype.removeListener = function (name, listener) {

    Hoek.assert(this._eventListeners[name], `Unknown event ${name}`);
    Hoek.assert(typeof listener === 'function', 'Listener must be a function');

    const handlers = this._eventListeners[name].handlers;
    if (!handlers) {
        return this;
    }

    const filtered = handlers.filter((handler) => handler.listener !== listener);
    this._eventListeners[name].handlers = (filtered.length ? filtered : null);
    return this;
};


internals.Podium.prototype.removeAllListeners = function (name) {

    Hoek.assert(this._eventListeners[name], `Unknown event ${name}`);
    this._eventListeners[name].handlers = null;
    return this;
};


internals.Podium.prototype.hasListeners = function (name) {

    Hoek.assert(this._eventListeners[name], `Unknown event ${name}`);
    return !!this._eventListeners[name].handlers;
};


internals.removeHandler = function (emitter, name, handler) {

    const handlers = emitter._eventListeners[name].handlers;
    const filtered = handlers.filter((item) => item !== handler);
    emitter._eventListeners[name].handlers = (filtered.length ? filtered : null);
};


internals.criteria = function (criteria) {

    return (typeof criteria === 'string' ? { name: criteria } : criteria);
};


internals.flag = function (name, handler, event) {

    return (handler[name] !== undefined ? handler[name] : event.flags[name]) || false;
};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Joi = __webpack_require__(3);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports.apply = function (type, options, message) {

    const result = Joi.validate(options, internals[type]);
    Hoek.assert(!result.error, 'Invalid', type, 'options', message ? '(' + message + ')' : '', result.error && result.error.annotate());
    return result.value;
};


internals.access = Joi.object({
    entity: Joi.string().valid('user', 'app', 'any'),
    scope: [false, Joi.array().items(Joi.string()).single().min(1)]
});


internals.auth = Joi.alternatives([
    Joi.string(),
    internals.access.keys({
        mode: Joi.string().valid('required', 'optional', 'try'),
        strategy: Joi.string(),
        strategies: Joi.array().items(Joi.string()).min(1),
        access: Joi.array().items(internals.access.min(1)).single().min(1),
        payload: [
            Joi.string().valid('required', 'optional'),
            Joi.boolean()
        ]
    })
        .without('strategy', 'strategies')
        .without('access', ['scope', 'entity'])
]);


internals.event = Joi.object({
    method: Joi.array().items(Joi.func()).single(),
    options: Joi.object({
        before: Joi.array().items(Joi.string()).single(),
        after: Joi.array().items(Joi.string()).single(),
        bind: Joi.any(),
        sandbox: Joi.string().valid('connection', 'plugin')
    })
        .default({})
});


internals.exts = Joi.array().items(internals.event.keys({ type: Joi.string().required() })).single();


internals.routeBase = Joi.object({
    app: Joi.object().allow(null),
    auth: internals.auth.allow(false),
    bind: Joi.object().allow(null),
    cache: Joi.object({
        expiresIn: Joi.number(),
        expiresAt: Joi.string(),
        privacy: Joi.string().valid('default', 'public', 'private'),
        statuses: Joi.array().items(Joi.number().integer().min(200)).min(1).single(),
        otherwise: Joi.string().required()
    })
        .allow(false),
    compression: Joi.object().pattern(/.+/, Joi.object()),
    cors: Joi.object({
        origin: Joi.array().min(1),
        maxAge: Joi.number(),
        headers: Joi.array().items(Joi.string()),
        additionalHeaders: Joi.array().items(Joi.string()),
        exposedHeaders: Joi.array().items(Joi.string()),
        additionalExposedHeaders: Joi.array().items(Joi.string()),
        credentials: Joi.boolean()
    })
        .allow(false, true),
    ext: Joi.object({
        onPreAuth: Joi.array().items(internals.event).single(),
        onPostAuth: Joi.array().items(internals.event).single(),
        onPreHandler: Joi.array().items(internals.event).single(),
        onPostHandler: Joi.array().items(internals.event).single(),
        onPreResponse: Joi.array().items(internals.event).single()
    })
        .default({}),
    files: Joi.object({
        relativeTo: Joi.string().regex(/^([\/\.])|([A-Za-z]:\\)|(\\\\)/).required()
    }),
    json: Joi.object({
        replacer: Joi.alternatives(Joi.func(), Joi.array()).allow(null),
        space: Joi.number().allow(null),
        suffix: Joi.string().allow(null)
    }),
    jsonp: Joi.string(),
    log: Joi.boolean(),
    payload: Joi.object({
        output: Joi.string().valid('data', 'stream', 'file'),
        parse: Joi.boolean().allow('gunzip'),
        multipart: Joi.object({
            output: Joi.string().valid('data', 'stream', 'file', 'annotated').required()
        })
            .allow(false),
        allow: [
            Joi.string(),
            Joi.array()
        ],
        override: Joi.string(),
        maxBytes: Joi.number().integer().positive(),
        uploads: Joi.string(),
        failAction: [
            Joi.string().valid('error', 'log', 'ignore'),
            Joi.func()
        ],
        timeout: Joi.number().integer().positive().allow(false),
        defaultContentType: Joi.string(),
        compression: Joi.object().pattern(/.+/, Joi.object())
    }),
    plugins: Joi.object(),
    response: Joi.object({
        emptyStatusCode: Joi.number().valid(200, 204),
        failAction: [
            Joi.string().valid('error', 'log'),
            Joi.func()
        ],
        modify: Joi.boolean(),
        options: Joi.object(),
        ranges: Joi.boolean(),
        sample: Joi.number().min(0).max(100),
        schema: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(true, false),
        status: Joi.object().pattern(/\d\d\d/, Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(true, false))
    })
        .without('modify', 'sample')
        .assert('options.stripUnknown', Joi.when('modify', { is: true, otherwise: Joi.forbidden() }), 'meet requirement of having peer modify set to true'),
    security: Joi.object({
        hsts: [
            Joi.object({
                maxAge: Joi.number(),
                includeSubdomains: Joi.boolean(),
                includeSubDomains: Joi.boolean(),
                preload: Joi.boolean()
            }),
            Joi.boolean(),
            Joi.number()
        ],
        xframe: [
            Joi.boolean(),
            Joi.string().valid('sameorigin', 'deny'),
            Joi.object({
                rule: Joi.string().valid('sameorigin', 'deny', 'allow-from'),
                source: Joi.string()
            })
        ],
        xss: Joi.boolean(),
        noOpen: Joi.boolean(),
        noSniff: Joi.boolean()
    })
        .allow(null, false, true),
    state: Joi.object({
        parse: Joi.boolean(),
        failAction: Joi.string().valid('error', 'log', 'ignore')
    }),
    timeout: Joi.object({
        socket: Joi.number().integer().positive().allow(false),
        server: Joi.number().integer().positive().allow(false).required()
    }),
    validate: Joi.object({
        headers: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        params: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        query: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        payload: Joi.alternatives(Joi.object(), Joi.array(), Joi.func()).allow(null, false, true),
        failAction: [
            Joi.string().valid('error', 'log', 'ignore'),
            Joi.func()
        ],
        errorFields: Joi.object(),
        options: Joi.object()
    })
});


internals.connectionBase = Joi.object({
    app: Joi.object().allow(null),
    compression: Joi.boolean(),
    load: Joi.object(),
    plugins: Joi.object(),
    router: Joi.object({
        isCaseSensitive: Joi.boolean(),
        stripTrailingSlash: Joi.boolean()
    }),
    routes: internals.routeBase,
    state: Joi.object()                                     // Cookie defaults
});


internals.server = Joi.object({
    app: Joi.object().allow(null),
    cache: Joi.allow(null),                                 // Validated elsewhere
    connections: internals.connectionBase,
    debug: Joi.object({
        request: Joi.array().items(Joi.string()).single().allow(false),
        log: Joi.array().items(Joi.string()).single().allow(false)
    }).allow(false),
    load: Joi.object(),
    mime: Joi.object(),
    plugins: Joi.object(),
    useDomains: Joi.boolean()
});


internals.connection = internals.connectionBase.keys({
    autoListen: Joi.boolean(),
    host: Joi.string().hostname(),
    address: Joi.string().hostname(),
    labels: Joi.array().items(Joi.string()).single(),
    listener: Joi.any(),
    port: Joi.alternatives([
        Joi.number().integer().min(0),          // TCP port
        Joi.string().regex(/\//),               // Unix domain socket
        Joi.string().regex(/^\\\\\.\\pipe\\/)   // Windows named pipe
    ])
        .allow(null),
    tls: Joi.alternatives([
        Joi.object().allow(null),
        Joi.boolean()
    ]),
    uri: Joi.string().regex(/[^/]$/)
});


internals.vhost = Joi.alternatives([
    Joi.string().hostname(),
    Joi.array().items(Joi.string().hostname()).min(1)
]);


internals.route = Joi.object({
    method: Joi.string().regex(/^[a-zA-Z0-9!#\$%&'\*\+\-\.^_`\|~]+$/).required(),
    path: Joi.string().required(),
    vhost: internals.vhost,
    handler: Joi.any(),                         // Validated in routeConfig
    config: Joi.alternatives([
        Joi.object(),
        Joi.func()
    ]).allow(null)
});


internals.pre = [
    Joi.string(),
    Joi.func(),
    Joi.object({
        method: Joi.alternatives(Joi.string(), Joi.func()).required(),
        assign: Joi.string(),
        mode: Joi.string().valid('serial', 'parallel'),
        failAction: Joi.string().valid('error', 'log', 'ignore')
    })
];


internals.routeConfig = internals.routeBase.keys({
    id: Joi.string(),
    isInternal: Joi.boolean(),
    pre: Joi.array().items(internals.pre.concat(Joi.array().items(internals.pre).min(1))),
    handler: [
        Joi.func(),
        Joi.string(),
        Joi.object().length(1)
    ],
    description: Joi.string(),
    notes: [
        Joi.string(),
        Joi.array().items(Joi.string())
    ],
    tags: [
        Joi.string(),
        Joi.array().items(Joi.string())
    ]
});


internals.cacheConfig = Joi.object({
    name: Joi.string().invalid('_default'),
    partition: Joi.string(),
    shared: Joi.boolean(),
    engine: Joi.alternatives([
        Joi.object(),
        Joi.func()
    ])
        .required()
}).unknown();


internals.cache = Joi.array().items(internals.cacheConfig, Joi.func()).min(1).single();


internals.cachePolicy = Joi.object({
    cache: Joi.string().allow(null).allow(''),
    segment: Joi.string(),
    shared: Joi.boolean()
})
    .options({ allowUnknown: true });               // Catbox validates other keys


internals.method = Joi.object({
    bind: Joi.object().allow(null),
    generateKey: Joi.func(),
    cache: internals.cachePolicy,
    callback: Joi.boolean()
});


internals.methodObject = Joi.object({
    name: Joi.string().required(),
    method: Joi.func().required(),
    options: Joi.object()
});


internals.register = Joi.object({
    once: Joi.boolean(),
    routes: Joi.object({
        prefix: Joi.string().regex(/^\/.+/),
        vhost: internals.vhost
    })
        .default({}),
    select: Joi.array().items(Joi.string()).single()
});


internals.plugin = internals.register.keys({
    register: Joi.func().keys({
        attributes: Joi.object({
            pkg: Joi.object({
                name: Joi.string(),
                version: Joi.string().default('0.0.0')
            })
                .unknown()
                .default({
                    version: '0.0.0'
                }),
            name: Joi.string()
                .when('pkg.name', { is: Joi.exist(), otherwise: Joi.required() }),
            version: Joi.string(),
            multiple: Joi.boolean().default(false),
            dependencies: Joi.array().items(Joi.string()).single(),
            connections: Joi.boolean().allow('conditional').default(true),
            once: Joi.boolean().valid(true)
        })
            .required()
            .unknown()
    })
        .required(),
    options: Joi.any()
})
    .without('once', 'options')
    .unknown();


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Defaults = __webpack_require__(25);
let Route = null;                           // Delayed load due to circular dependency


// Declare internals

const internals = {};


exports.route = function (options) {

    const settings = Hoek.applyToDefaults(Defaults.cors, options);
    if (!settings) {
        return false;
    }

    settings._headers = settings.headers.concat(settings.additionalHeaders);
    settings._headersString = settings._headers.join(',');
    for (let i = 0; i < settings._headers.length; ++i) {
        settings._headers[i] = settings._headers[i].toLowerCase();
    }

    if (settings._headers.indexOf('origin') === -1) {
        settings._headers.push('origin');
    }

    settings._exposedHeaders = settings.exposedHeaders.concat(settings.additionalExposedHeaders).join(',');

    if (settings.origin.indexOf('*') !== -1) {
        Hoek.assert(settings.origin.length === 1, 'Cannot specify cors.origin * together with other values');
        settings._origin = true;
    }
    else {
        settings._origin = {
            qualified: [],
            wildcards: []
        };

        for (let i = 0; i < settings.origin.length; ++i) {
            const origin = settings.origin[i];
            if (origin.indexOf('*') !== -1) {
                settings._origin.wildcards.push(new RegExp('^' + Hoek.escapeRegex(origin).replace(/\\\*/g, '.*').replace(/\\\?/g, '.') + '$'));
            }
            else {
                settings._origin.qualified.push(origin);
            }
        }
    }

    return settings;
};


exports.options = function (route, connection, server) {

    if (route.method === 'options' ||
        !route.settings.cors) {

        return;
    }

    exports.handler(connection);
};


exports.handler = function (connection) {

    Route = Route || __webpack_require__(41);

    if (connection._router.specials.options) {
        return;
    }

    const route = new Route({ method: '_special', path: '/{p*}', handler: internals.handler }, connection, connection.server, { special: true });
    connection._router.special('options', route);
};


internals.handler = function (request, reply) {

    // Validate CORS preflight request

    const origin = request.headers.origin;
    if (!origin) {
        return reply(Boom.notFound('CORS error: Missing Origin header'));
    }

    const method = request.headers['access-control-request-method'];
    if (!method) {
        return reply(Boom.notFound('CORS error: Missing Access-Control-Request-Method header'));
    }

    // Lookup route

    const route = request.connection.match(method, request.path, request.info.hostname);
    if (!route) {
        return reply(Boom.notFound());
    }

    const settings = route.settings.cors;
    if (!settings) {
        return reply({ message: 'CORS is disabled for this route' });
    }

    // Validate Origin header

    if (!exports.matchOrigin(origin, settings)) {
        return reply({ message: 'CORS error: Origin not allowed' });
    }

    // Validate allowed headers

    let headers = request.headers['access-control-request-headers'];
    if (headers) {
        headers = headers.toLowerCase().split(/\s*,\s*/);
        if (Hoek.intersect(headers, settings._headers).length !== headers.length) {
            return reply({ message: 'CORS error: Some headers are not allowed' });
        }
    }

    // Reply with the route CORS headers

    const response = reply();
    response._header('access-control-allow-origin', request.headers.origin);
    response._header('access-control-allow-methods', method);
    response._header('access-control-allow-headers', settings._headersString);
    response._header('access-control-max-age', settings.maxAge);

    if (settings.credentials) {
        response._header('access-control-allow-credentials', 'true');
    }

    if (settings._exposedHeaders) {
        response._header('access-control-expose-headers', settings._exposedHeaders);
    }
};


exports.headers = function (response) {

    const request = response.request;
    if (request._route._special) {
        return;
    }

    const settings = request.route.settings.cors;
    if (!settings) {
        return;
    }

    response.vary('origin');

    if (!request.info.cors.isOriginMatch) {
        return;
    }

    response._header('access-control-allow-origin', request.headers.origin);

    if (settings.credentials) {
        response._header('access-control-allow-credentials', 'true');
    }

    if (settings._exposedHeaders) {
        response._header('access-control-expose-headers', settings._exposedHeaders, { append: true });
    }
};


exports.matchOrigin = function (origin, settings) {

    if (!origin) {
        return false;
    }

    if (settings._origin === true) {
        return true;
    }

    if (settings._origin.qualified.indexOf(origin) !== -1) {
        return true;
    }

    for (let i = 0; i < settings._origin.wildcards.length; ++i) {
        if (origin.match(settings._origin.wildcards[i])) {
            return true;
        }
    }

    return false;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Topo = __webpack_require__(35);


// Declare internals

const internals = {};


exports = module.exports = internals.Ext = function (type, server) {

    this._topo = new Topo();
    this._server = server;
    this._routes = [];

    this.type = type;
    this.nodes = null;
};


internals.Ext.prototype.add = function (event) {

    const methods = [].concat(event.method);
    const options = event.options;

    for (let i = 0; i < methods.length; ++i) {
        const settings = {
            before: options.before,
            after: options.after,
            group: event.plugin.realm.plugin,
            sort: this._server._extensionsSeq++
        };

        const node = {
            func: methods[i],                 // Connection: function (request, next), Server: function (server, next)
            bind: options.bind,
            plugin: event.plugin
        };

        this._topo.add(node, settings);
    }

    this.nodes = this._topo.nodes;

    // Notify routes

    for (let i = 0; i < this._routes.length; ++i) {
        this._routes[i].rebuild(event);
    }
};


internals.Ext.prototype.merge = function (others) {

    const merge = [];
    for (let i = 0; i < others.length; ++i) {
        merge.push(others[i]._topo);
    }

    this._topo.merge(merge);
    this.nodes = (this._topo.nodes.length ? this._topo.nodes : null);
};


internals.Ext.prototype.subscribe = function (route) {

    this._routes.push(route);
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(2);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Podium = __webpack_require__(9);
const Streams = __webpack_require__(46);


// Declare internals

const internals = {};


exports = module.exports = internals.Response = function (source, request, options) {

    Podium.call(this, ['finish', { name: 'peek', spread: true }]);

    options = options || {};

    this.request = request;
    this.statusCode = null;
    this.headers = {};                          // Incomplete as some headers are stored in flags
    this.variety = null;
    this.source = null;
    this.app = {};
    this.plugins = {};
    this.send = null;                           // Set by reply()
    this.hold = null;                           // Set by reply()

    this.settings = {
        encoding: 'utf8',
        charset: 'utf-8',                       // '-' required by IANA
        ttl: null,
        stringify: null,                        // JSON.stringify options
        passThrough: true,
        varyEtag: false,
        message: null
    };

    this._payload = null;                       // Readable stream
    this._takeover = false;
    this._contentEncoding = null;               // Set during transmit
    this._contentType = null;                   // Used if no explicit content-type is set and type is known
    this._error = null;                         // The boom object when created from an error

    this._processors = {
        marshal: options.marshal,
        prepare: options.prepare,
        close: options.close
    };

    this._setSource(source, options.variety);
};

Hoek.inherits(internals.Response, Podium);


internals.Response.wrap = function (result, request) {

    return (result instanceof Error) ?
        Boom.boomify(result) :
        (result instanceof internals.Response ? result : new internals.Response(result, request));
};


internals.Response.prototype._setSource = function (source, variety) {

    // Method must not set any headers or other properties as source can change later

    this.variety = variety || 'plain';

    if (source === null ||
        source === undefined ||
        source === '') {

        source = null;
    }
    else if (Buffer.isBuffer(source)) {
        this.variety = 'buffer';
        this._contentType = 'application/octet-stream';
    }
    else if (source instanceof Stream) {
        this.variety = 'stream';
    }
    else if (typeof source === 'object' &&
        typeof source.then === 'function') {                // Promise object

        this.variety = 'promise';
    }

    this.source = source;

    if (this.variety === 'plain' &&
        this.source !== null) {

        this._contentType = (typeof this.source === 'string' ? 'text/html' : 'application/json');
    }
};


internals.Response.prototype.code = function (statusCode) {

    Hoek.assert(Hoek.isInteger(statusCode), 'Status code must be an integer');

    this.statusCode = statusCode;
    return this;
};


internals.Response.prototype.message = function (httpMessage) {

    this.settings.message = httpMessage;
    return this;
};


internals.Response.prototype.header = function (key, value, options) {

    key = key.toLowerCase();
    if (key === 'vary') {
        return this.vary(value);
    }

    return this._header(key, value, options);
};


internals.Response.prototype._header = function (key, value, options) {

    options = options || {};
    const append = options.append || false;
    const separator = options.separator || ',';
    const override = options.override !== false;
    const duplicate = options.duplicate !== false;

    if ((!append && override) ||
        !this.headers[key]) {

        this.headers[key] = value;
    }
    else if (override) {
        if (key === 'set-cookie') {
            this.headers[key] = [].concat(this.headers[key], value);
        }
        else {
            const existing = this.headers[key];
            if (!duplicate) {
                const values = existing.split(separator);
                for (let i = 0; i < values.length; ++i) {
                    if (values[i] === value) {
                        return this;
                    }
                }
            }

            this.headers[key] = existing + separator + value;
        }
    }

    return this;
};


internals.Response.prototype.vary = function (value) {

    if (value === '*') {
        this.headers.vary = '*';
    }
    else if (!this.headers.vary) {
        this.headers.vary = value;
    }
    else if (this.headers.vary !== '*') {
        this._header('vary', value, { append: true, duplicate: false });
    }

    return this;
};


internals.Response.prototype.etag = function (tag, options) {

    const entity = internals.Response.entity(tag, options);
    this._header('etag', entity.etag);
    this.settings.varyEtag = entity.vary;
    return this;
};


internals.Response.entity = function (tag, options) {

    options = options || {};

    Hoek.assert(tag !== '*', 'ETag cannot be *');

    return {
        etag: (options.weak ? 'W/' : '') + '"' + tag + '"',
        vary: (options.vary !== false && !options.weak),                    // vary defaults to true
        modified: options.modified
    };
};


internals.Response.unmodified = function (request, options) {

    if (request.method !== 'get' &&
        request.method !== 'head') {

        return false;
    }

    // Strong verifier

    if (options.etag &&
        request.headers['if-none-match']) {

        const ifNoneMatch = request.headers['if-none-match'].split(/\s*,\s*/);
        for (let i = 0; i < ifNoneMatch.length; ++i) {
            const etag = ifNoneMatch[i];
            if (etag === options.etag) {
                return true;
            }

            if (options.vary) {
                const etagBase = options.etag.slice(0, -1);
                const encoders = request.connection._compression.encodings;
                for (let j = 0; j < encoders.length; ++j) {
                    if (etag === etagBase + `-${encoders[j]}"`) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Weak verifier

    const ifModifiedSinceHeader = request.headers['if-modified-since'];

    if (ifModifiedSinceHeader &&
        options.modified) {

        const ifModifiedSince = internals.parseDate(ifModifiedSinceHeader);
        const lastModified = internals.parseDate(options.modified);

        if (ifModifiedSince &&
            lastModified &&
            ifModifiedSince >= lastModified) {

            return true;
        }
    }

    return false;
};


internals.parseDate = function (string) {

    try {
        return Date.parse(string);
    }
    catch (errIgnore) { }
};


internals.Response.prototype.type = function (type) {

    this._header('content-type', type);
    return this;
};


internals.Response.prototype.bytes = function (bytes) {

    this._header('content-length', bytes);
    return this;
};


internals.Response.prototype.location = function (uri) {

    this._header('location', uri);
    return this;
};


internals.Response.prototype.created = function (location) {

    Hoek.assert(this.request.method === 'post' || this.request.method === 'put', 'Cannot create resource on GET');

    this.statusCode = 201;
    this.location(location);
    return this;
};


internals.Response.prototype.replacer = function (method) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.replacer = method;
    return this;
};


internals.Response.prototype.spaces = function (count) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.space = count;
    return this;
};


internals.Response.prototype.suffix = function (suffix) {

    this.settings.stringify = this.settings.stringify || {};
    this.settings.stringify.suffix = suffix;
    return this;
};


internals.Response.prototype.passThrough = function (enabled) {

    this.settings.passThrough = (enabled !== false);    // Defaults to true
    return this;
};


internals.Response.prototype.redirect = function (location) {

    this.statusCode = 302;
    this.location(location);
    this.temporary = this._temporary;
    this.permanent = this._permanent;
    this.rewritable = this._rewritable;
    return this;
};


internals.Response.prototype._temporary = function (isTemporary) {

    this._setTemporary(isTemporary !== false);           // Defaults to true
    return this;
};


internals.Response.prototype._permanent = function (isPermanent) {

    this._setTemporary(isPermanent === false);           // Defaults to true
    return this;
};


internals.Response.prototype._rewritable = function (isRewritable) {

    this._setRewritable(isRewritable !== false);         // Defaults to true
    return this;
};


internals.Response.prototype._isTemporary = function () {

    return this.statusCode === 302 || this.statusCode === 307;
};


internals.Response.prototype._isRewritable = function () {

    return this.statusCode === 301 || this.statusCode === 302;
};


internals.Response.prototype._setTemporary = function (isTemporary) {

    if (isTemporary) {
        if (this._isRewritable()) {
            this.statusCode = 302;
        }
        else {
            this.statusCode = 307;
        }
    }
    else {
        if (this._isRewritable()) {
            this.statusCode = 301;
        }
        else {
            this.statusCode = 308;
        }
    }
};


internals.Response.prototype._setRewritable = function (isRewritable) {

    if (isRewritable) {
        if (this._isTemporary()) {
            this.statusCode = 302;
        }
        else {
            this.statusCode = 301;
        }
    }
    else {
        if (this._isTemporary()) {
            this.statusCode = 307;
        }
        else {
            this.statusCode = 308;
        }
    }
};


internals.Response.prototype.encoding = function (encoding) {

    this.settings.encoding = encoding;
    return this;
};


internals.Response.prototype.charset = function (charset) {

    this.settings.charset = charset || null;
    return this;
};


internals.Response.prototype.ttl = function (ttl) {

    this.settings.ttl = ttl;
    return this;
};


internals.Response.prototype.state = function (name, value, options) {          // options: see Defaults.state

    this.request._setState(name, value, options);
    return this;
};


internals.Response.prototype.unstate = function (name, options) {

    this.request._clearState(name, options);
    return this;
};


internals.Response.prototype.takeover = function () {

    this._takeover = true;
    return this;
};


internals.Response.prototype._prepare = function (next) {

    this._passThrough();

    if (this.variety !== 'promise') {
        return this._processPrepare(next);
    }

    const onDone = Hoek.nextTick((source) => {

        if (source instanceof Error) {
            return next(Boom.boomify(source));
        }

        if (source instanceof internals.Response) {
            return source._processPrepare(next);
        }

        this._setSource(source);
        this._passThrough();
        this._processPrepare(next);
    });

    const onError = (source) => {

        if (!(source instanceof Error)) {
            const err = new Error('Rejected promise');
            err.data = source;
            return next(Boom.boomify(err));
        }

        return next(Boom.boomify(source));
    };

    this.source.then(onDone, onError);
};


internals.Response.prototype._passThrough = function () {

    if (this.variety === 'stream' &&
        this.settings.passThrough) {

        if (this.source.statusCode &&
            !this.statusCode) {

            this.statusCode = this.source.statusCode;                        // Stream is an HTTP response
        }

        if (this.source.headers) {
            let headerKeys = Object.keys(this.source.headers);

            if (headerKeys.length) {
                const localHeaders = this.headers;
                this.headers = {};

                for (let i = 0; i < headerKeys.length; ++i) {
                    const key = headerKeys[i];
                    this.header(key.toLowerCase(), Hoek.clone(this.source.headers[key]));     // Clone arrays
                }

                headerKeys = Object.keys(localHeaders);
                for (let i = 0; i < headerKeys.length; ++i) {
                    const key = headerKeys[i];
                    this.header(key, localHeaders[key], { append: key === 'set-cookie' });
                }
            }
        }
    }

    this.statusCode = this.statusCode || 200;
};


internals.Response.prototype._processPrepare = function (next) {

    if (!this._processors.prepare) {
        return next(this);
    }

    return this._processors.prepare(this, next);
};


internals.Response.prototype._marshal = function (next) {

    if (!this._processors.marshal) {
        return this._streamify(this.source, next);
    }

    this._processors.marshal(this, (err, source) => {

        if (err) {
            return next(err);
        }

        return this._streamify(source, next);
    });
};


internals.Response.prototype._streamify = function (source, next) {

    if (source instanceof Stream) {
        if (typeof source._read !== 'function' || typeof source._readableState !== 'object') {
            return next(Boom.badImplementation('Stream must have a streams2 readable interface'));
        }

        if (source._readableState.objectMode) {
            return next(Boom.badImplementation('Cannot reply with stream in object mode'));
        }

        this._payload = source;
        return next();
    }

    let payload = source;
    if (this.variety === 'plain' &&
        source !== null &&
        typeof source !== 'string') {

        const options = this.settings.stringify || {};
        const space = options.space || this.request.route.settings.json.space;
        const replacer = options.replacer || this.request.route.settings.json.replacer;
        const suffix = options.suffix || this.request.route.settings.json.suffix || '';
        try {
            if (replacer || space) {
                payload = JSON.stringify(payload, replacer, space);
            }
            else {
                payload = JSON.stringify(payload);
            }
        }
        catch (err) {
            return next(err);
        }

        if (suffix) {
            payload = payload + suffix;
        }
    }
    else if (this.settings.stringify) {
        return next(Boom.badImplementation('Cannot set formatting options on non object response'));
    }

    this._payload = new internals.Payload(payload, this.settings);
    return next();
};


internals.Response.prototype._tap = function () {

    return (this.hasListeners('finish') || this.hasListeners('peek') ? new internals.Peek(this) : null);
};


internals.Response.prototype._close = function () {

    if (this._processors.close) {
        this._processors.close(this);
    }

    const stream = this._payload || this.source;
    if (stream instanceof Stream) {
        internals.Response.drain(stream);
    }
};


internals.Response.drain = function (stream) {

    if (stream.close) {
        stream.close();
    }
    else if (stream.destroy) {
        stream.destroy();
    }
    else {
        Streams.drain(stream);
    }
};


internals.Response.prototype._isPayloadSupported = function () {

    return (this.request.method !== 'head' && this.statusCode !== 304 && this.statusCode !== 204);
};


internals.Response.Payload = internals.Payload = function (payload, options) {

    Stream.Readable.call(this);
    this._data = payload;
    this._prefix = null;
    this._suffix = null;
    this._sizeOffset = 0;
    this._encoding = options.encoding;
};

Hoek.inherits(internals.Payload, Stream.Readable);


internals.Payload.prototype._read = function (/* size */) {

    if (this._prefix) {
        this.push(this._prefix, this._encoding);
    }

    if (this._data) {
        this.push(this._data, this._encoding);
    }

    if (this._suffix) {
        this.push(this._suffix, this._encoding);
    }

    this.push(null);
};


internals.Payload.prototype.size = function () {

    if (!this._data) {
        return this._sizeOffset;
    }

    return (Buffer.isBuffer(this._data) ? this._data.length : Buffer.byteLength(this._data, this._encoding)) + this._sizeOffset;
};


internals.Payload.prototype.jsonp = function (variable) {

    this._sizeOffset = this._sizeOffset + variable.length + 7;
    this._prefix = '/**/' + variable + '(';                 // '/**/' prefix prevents CVE-2014-4671 security exploit
    this._data = (this._data === null || Buffer.isBuffer(this._data)) ? this._data : this._data.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    this._suffix = ');';
};


internals.Response.Peek = internals.Peek = function (podium) {

    Stream.Transform.call(this);
    this._podium = podium;
    this.once('finish', () => {

        podium.emit('finish');
    });
};

Hoek.inherits(internals.Peek, Stream.Transform);


internals.Peek.prototype._transform = function (chunk, encoding, callback) {

    this._podium.emit('peek', [chunk, encoding]);
    this.push(chunk, encoding);
    callback();
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Client = __webpack_require__(56);
const Policy = __webpack_require__(58);


// Declare internals

const internals = {};


exports.Client = Client;
exports.Policy = exports.policy = Policy;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Language = __webpack_require__(59);


// Declare internals

const internals = {
    annotations: Symbol('joi-annotations')
};

internals.stringify = function (value, wrapArrays) {

    const type = typeof value;

    if (value === null) {
        return 'null';
    }

    if (type === 'string') {
        return value;
    }

    if (value instanceof exports.Err || type === 'function') {
        return value.toString();
    }

    if (type === 'object') {
        if (Array.isArray(value)) {
            let partial = '';

            for (let i = 0; i < value.length; ++i) {
                partial = partial + (partial.length ? ', ' : '') + internals.stringify(value[i], wrapArrays);
            }

            return wrapArrays ? '[' + partial + ']' : partial;
        }

        return value.toString();
    }

    return JSON.stringify(value);
};

exports.Err = class {

    constructor(type, context, state, options, flags, message, template) {

        this.isJoi = true;
        this.type = type;
        this.context = context || {};
        this.context.key = state.key;
        this.path = state.path;
        this.options = options;
        this.flags = flags;
        this.message = message;
        this.template = template;
    }

    toString() {

        if (this.message) {
            return this.message;
        }

        let format;

        if (this.template) {
            format = this.template;
        }

        const localized = this.options.language;

        if (this.flags.label) {
            this.context.key = this.flags.label;
        }
        else if (this.context.key === '' || this.context.key === null) {
            this.context.key = localized.root || Language.errors.root;
        }

        format = format || Hoek.reach(localized, this.type) || Hoek.reach(Language.errors, this.type);

        let wrapArrays = Hoek.reach(localized, 'messages.wrapArrays');
        if (typeof wrapArrays !== 'boolean') {
            wrapArrays = Language.errors.messages.wrapArrays;
        }

        if (format === null) {
            const childrenString = internals.stringify(this.context.reason, wrapArrays);
            if (wrapArrays) {
                return childrenString.slice(1, -1);
            }
            return childrenString;
        }

        const hasKey = /\{\{\!?key\}\}/.test(format);
        const skipKey = format.length > 2 && format[0] === '!' && format[1] === '!';

        if (skipKey) {
            format = format.slice(2);
        }

        if (!hasKey && !skipKey) {
            format = (Hoek.reach(localized, 'key') || Hoek.reach(Language.errors, 'key')) + format;
        }

        return format.replace(/\{\{(\!?)([^}]+)\}\}/g, ($0, isSecure, name) => {

            const value = Hoek.reach(this.context, name);
            const normalized = internals.stringify(value, wrapArrays);
            return (isSecure ? Hoek.escapeHtml(normalized) : normalized);
        });
    }

};


exports.create = function (type, context, state, options, flags, message, template) {

    return new exports.Err(type, context, state, options, flags, message, template);
};


exports.process = function (errors, object) {

    if (!errors || !errors.length) {
        return null;
    }

    // Construct error

    let message = '';
    const details = [];

    const processErrors = function (localErrors, parent) {

        for (let i = 0; i < localErrors.length; ++i) {
            const item = localErrors[i];

            if (item instanceof Error) {
                return item;
            }

            if (item.flags.error && typeof item.flags.error !== 'function') {
                return item.flags.error;
            }

            let itemMessage;
            if (parent === undefined) {
                itemMessage = item.toString();
                message = message + (message ? '. ' : '') + itemMessage;
            }

            // Do not push intermediate errors, we're only interested in leafs

            if (item.context.reason && item.context.reason.length) {
                const override = processErrors(item.context.reason, item.path);
                if (override) {
                    return override;
                }
            }
            else {
                details.push({
                    message: itemMessage || item.toString(),
                    path: internals.getPath(item),
                    type: item.type,
                    context: item.context
                });
            }
        }
    };

    const override = processErrors(errors);
    if (override) {
        return override;
    }

    const error = new Error(message);
    error.isJoi = true;
    error.name = 'ValidationError';
    error.details = details;
    error._object = object;
    error.annotate = internals.annotate;
    return error;
};


internals.getPath = function (item) {

    return item.path || item.context.key;
};


// Inspired by json-stringify-safe
internals.safeStringify = function (obj, spaces) {

    return JSON.stringify(obj, internals.serializer(), spaces);
};

internals.serializer = function () {

    const keys = [];
    const stack = [];

    const cycleReplacer = (key, value) => {

        if (stack[0] === value) {
            return '[Circular ~]';
        }

        return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
    };

    return function (key, value) {

        if (stack.length > 0) {
            const thisPos = stack.indexOf(this);
            if (~thisPos) {
                stack.length = thisPos + 1;
                keys.length = thisPos + 1;
                keys[thisPos] = key;
            }
            else {
                stack.push(this);
                keys.push(key);
            }

            if (~stack.indexOf(value)) {
                value = cycleReplacer.call(this, key, value);
            }
        }
        else {
            stack.push(value);
        }

        if (value) {
            const annotations = value[internals.annotations];
            if (annotations) {
                if (Array.isArray(value)) {
                    const annotated = [];

                    for (let i = 0; i < value.length; ++i) {
                        if (annotations.errors[i]) {
                            annotated.push(`_$idx$_${annotations.errors[i].sort().join(', ')}_$end$_`);
                        }
                        annotated.push(value[i]);
                    }

                    value = annotated;
                }
                else {
                    const errorKeys = Object.keys(annotations.errors);
                    for (let i = 0; i < errorKeys.length; ++i) {
                        const errorKey = errorKeys[i];
                        value[`${errorKey}_$key$_${annotations.errors[errorKey].sort().join(', ')}_$end$_`] = value[errorKey];
                        value[errorKey] = undefined;
                    }

                    const missingKeys = Object.keys(annotations.missing);
                    for (let i = 0; i < missingKeys.length; ++i) {
                        const missingKey = missingKeys[i];
                        value[`_$miss$_${missingKey}|${annotations.missing[missingKey]}_$end$_`] = '__missing__';
                    }
                }

                return value;
            }
        }

        if (value === Infinity || value === -Infinity || Number.isNaN(value) ||
            typeof value === 'function' || typeof value === 'symbol') {
            return '[' + value.toString() + ']';
        }

        return value;
    };
};


internals.annotate = function (stripColorCodes) {

    const redFgEscape = stripColorCodes ? '' : '\u001b[31m';
    const redBgEscape = stripColorCodes ? '' : '\u001b[41m';
    const endColor = stripColorCodes ? '' : '\u001b[0m';

    if (typeof this._object !== 'object') {
        return this.details[0].message;
    }

    const obj = Hoek.clone(this._object || {});

    for (let i = this.details.length - 1; i >= 0; --i) {        // Reverse order to process deepest child first
        const pos = i + 1;
        const error = this.details[i];
        const path = error.path.split('.');
        let ref = obj;
        for (let j = 0; ; ++j) {
            const seg = path[j];

            if (ref.isImmutable) {
                ref = ref.clone();                              // joi schemas are not cloned by hoek, we have to take this extra step
            }

            if (j + 1 < path.length &&
                ref[seg] &&
                typeof ref[seg] !== 'string') {

                ref = ref[seg];
            }
            else {
                const refAnnotations = ref[internals.annotations] = ref[internals.annotations] || { errors: {}, missing: {} };
                const value = ref[seg];

                if (value !== undefined) {
                    refAnnotations.errors[seg] = refAnnotations.errors[seg] || [];
                    refAnnotations.errors[seg].push(pos);
                }
                else {
                    refAnnotations.missing[seg] = pos;
                }

                break;
            }
        }
    }

    const replacers = {
        key: /_\$key\$_([, \d]+)_\$end\$_\"/g,
        missing: /\"_\$miss\$_([^\|]+)\|(\d+)_\$end\$_\"\: \"__missing__\"/g,
        arrayIndex: /\s*\"_\$idx\$_([, \d]+)_\$end\$_\",?\n(.*)/g,
        specials: /"\[(NaN|Symbol.*|-?Infinity|function.*|\(.*)\]"/g
    };

    let message = internals.safeStringify(obj, 2)
        .replace(replacers.key, ($0, $1) => `" ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.missing, ($0, $1, $2) => `${redBgEscape}"${$1}"${endColor}${redFgEscape} [${$2}]: -- missing --${endColor}`)
        .replace(replacers.arrayIndex, ($0, $1, $2) => `\n${$2} ${redFgEscape}[${$1}]${endColor}`)
        .replace(replacers.specials, ($0, $1) => $1);

    message = `${message}\n${redFgEscape}`;

    for (let i = 0; i < this.details.length; ++i) {
        const pos = i + 1;
        message = `${message}\n[${pos}] ${this.details[i].message}`;
    }

    message = message + endColor;

    return message;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Ref = __webpack_require__(5);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};

internals.isoDate = /^(?:[-+]\d{2})?(?:\d{4}(?!\d{2}\b))(?:(-?)(?:(?:0[1-9]|1[0-2])(?:\1(?:[12]\d|0[1-9]|3[01]))?|W(?:[0-4]\d|5[0-2])(?:-?[1-7])?|(?:00[1-9]|0[1-9]\d|[12]\d{2}|3(?:[0-5]\d|6[1-6])))(?![T]$|[T][\d]+Z$)(?:[T\s](?:(?:(?:[01]\d|2[0-3])(?:(:?)[0-5]\d)?|24\:?00)(?:[.,]\d+(?!:))?)(?:\2[0-5]\d(?:[.,]\d+)?)?(?:[Z]|(?:[+-])(?:[01]\d|2[0-3])(?::?[0-5]\d)?)?)?)?$/;
internals.invalidDate = new Date('');
internals.isIsoDate = (() => {

    const isoString = internals.isoDate.toString();

    return (date) => {

        return date && (date.toString() === isoString);
    };
})();

internals.Date = class extends Any {

    constructor() {

        super();
        this._type = 'date';
    }

    _base(value, state, options) {

        const result = {
            value: (options.convert && internals.Date.toDate(value, this._flags.format, this._flags.timestamp, this._flags.multiplier)) || value
        };

        if (result.value instanceof Date && !isNaN(result.value.getTime())) {
            result.errors = null;
        }
        else if (!options.convert) {
            result.errors = this.createError('date.strict', null, state, options);
        }
        else {
            let type;
            if (internals.isIsoDate(this._flags.format)) {
                type = 'isoDate';
            }
            else if (this._flags.timestamp) {
                type = `timestamp.${this._flags.timestamp}`;
            }
            else {
                type = 'base';
            }

            result.errors = this.createError(`date.${type}`, null, state, options);
        }

        return result;
    }

    static toDate(value, format, timestamp, multiplier) {

        if (value instanceof Date) {
            return value;
        }

        if (typeof value === 'string' ||
            (typeof value === 'number' && !isNaN(value) && isFinite(value))) {

            if (typeof value === 'string' &&
                /^[+-]?\d+(\.\d+)?$/.test(value)) {

                value = parseFloat(value);
            }

            let date;
            if (format && internals.isIsoDate(format)) {
                date = format.test(value) ? new Date(value) : internals.invalidDate;
            }
            else if (timestamp && multiplier) {
                date = new Date(value * multiplier);
            }
            else {
                date = new Date(value);
            }

            if (!isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    iso() {

        if (this._flags.format === internals.isoDate) {
            return this;
        }

        const obj = this.clone();
        obj._flags.format = internals.isoDate;
        return obj;
    }

    timestamp(type) {

        type = type || 'javascript';

        const allowed = ['javascript', 'unix'];
        Hoek.assert(allowed.indexOf(type) !== -1, '"type" must be one of "' + allowed.join('", "') + '"');

        if (this._flags.timestamp === type) {
            return this;
        }

        const obj = this.clone();
        obj._flags.timestamp = type;
        obj._flags.multiplier = type === 'unix' ? 1000 : 1;
        return obj;
    }

    _isIsoDate(value) {

        return internals.isoDate.test(value);
    }

};

internals.compare = function (type, compare) {

    return function (date) {

        const isNow = date === 'now';
        const isRef = Ref.isRef(date);

        if (!isNow && !isRef) {
            date = internals.Date.toDate(date);
        }

        Hoek.assert(date, 'Invalid date format');

        return this._test(type, date, function (value, state, options) {

            let compareTo;
            if (isNow) {
                compareTo = Date.now();
            }
            else if (isRef) {
                compareTo = internals.Date.toDate(date(state.reference || state.parent, options));

                if (!compareTo) {
                    return this.createError('date.ref', { ref: date.key }, state, options);
                }

                compareTo = compareTo.getTime();
            }
            else {
                compareTo = date.getTime();
            }

            if (compare(value.getTime(), compareTo)) {
                return value;
            }

            return this.createError('date.' + type, { limit: new Date(compareTo) }, state, options);
        });
    };
};
internals.Date.prototype.min = internals.compare('min', (value, date) => value >= date);
internals.Date.prototype.max = internals.compare('max', (value, date) => value <= date);


module.exports = new internals.Date();


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Any = __webpack_require__(4);
const Cast = __webpack_require__(8);
const Ref = __webpack_require__(5);


// Declare internals

const internals = {};


internals.Alternatives = class extends Any {

    constructor() {

        super();
        this._type = 'alternatives';
        this._invalids.remove(null);
        this._inner.matches = [];
    }

    _base(value, state, options) {

        let errors = [];
        const il = this._inner.matches.length;
        const baseType = this._baseType;

        for (let i = 0; i < il; ++i) {
            const item = this._inner.matches[i];
            const schema = item.schema;
            if (!schema) {
                const failed = item.is._validate(item.ref(state.reference || state.parent, options), null, options, state.parent).errors;

                if (failed) {
                    if (item.otherwise) {
                        return item.otherwise._validate(value, state, options);
                    }
                }
                else if (item.then) {
                    return item.then._validate(value, state, options);
                }

                if (i === (il - 1) && baseType) {
                    return baseType._validate(value, state, options);
                }

                continue;
            }

            const result = schema._validate(value, state, options);
            if (!result.errors) {     // Found a valid match
                return result;
            }

            errors = errors.concat(result.errors);
        }

        if (errors.length) {
            return { errors: this.createError('alternatives.child', { reason: errors }, state, options) };
        }

        return { errors: this.createError('alternatives.base', null, state, options) };
    }

    try(/* schemas */) {

        const schemas = Hoek.flatten(Array.prototype.slice.call(arguments));
        Hoek.assert(schemas.length, 'Cannot add other alternatives without at least one schema');

        const obj = this.clone();

        for (let i = 0; i < schemas.length; ++i) {
            const cast = Cast.schema(schemas[i]);
            if (cast._refs.length) {
                obj._refs = obj._refs.concat(cast._refs);
            }
            obj._inner.matches.push({ schema: cast });
        }

        return obj;
    }

    when(ref, options) {

        Hoek.assert(Ref.isRef(ref) || typeof ref === 'string', 'Invalid reference:', ref);
        Hoek.assert(options, 'Missing options');
        Hoek.assert(typeof options === 'object', 'Invalid options');
        Hoek.assert(options.hasOwnProperty('is'), 'Missing "is" directive');
        Hoek.assert(options.then !== undefined || options.otherwise !== undefined, 'options must have at least one of "then" or "otherwise"');

        const obj = this.clone();
        let is = Cast.schema(options.is);

        if (options.is === null || !(Ref.isRef(options.is) || options.is instanceof Any)) {

            // Only apply required if this wasn't already a schema or a ref, we'll suppose people know what they're doing
            is = is.required();
        }

        const item = {
            ref: Cast.ref(ref),
            is,
            then: options.then !== undefined ? Cast.schema(options.then) : undefined,
            otherwise: options.otherwise !== undefined ? Cast.schema(options.otherwise) : undefined
        };

        if (obj._baseType) {

            item.then = item.then && obj._baseType.concat(item.then);
            item.otherwise = item.otherwise && obj._baseType.concat(item.otherwise);
        }

        Ref.push(obj._refs, item.ref);
        obj._refs = obj._refs.concat(item.is._refs);

        if (item.then && item.then._refs) {
            obj._refs = obj._refs.concat(item.then._refs);
        }

        if (item.otherwise && item.otherwise._refs) {
            obj._refs = obj._refs.concat(item.otherwise._refs);
        }

        obj._inner.matches.push(item);

        return obj;
    }

    describe() {

        const description = Any.prototype.describe.call(this);
        const alternatives = [];
        for (let i = 0; i < this._inner.matches.length; ++i) {
            const item = this._inner.matches[i];
            if (item.schema) {

                // try()

                alternatives.push(item.schema.describe());
            }
            else {

                // when()

                const when = {
                    ref: item.ref.toString(),
                    is: item.is.describe()
                };

                if (item.then) {
                    when.then = item.then.describe();
                }

                if (item.otherwise) {
                    when.otherwise = item.otherwise.describe();
                }

                alternatives.push(when);
            }
        }

        description.alternatives = alternatives;
        return description;
    }

};


module.exports = new internals.Alternatives();


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Schema = __webpack_require__(11);


// Declare internals

const internals = {};


exports = module.exports = internals.Auth = function (connection) {

    this.connection = connection;
    this._schemes = {};
    this._strategies = {};
    this.settings = {
        default: null           // Strategy used as default if route has no auth settings
    };

    this.api = {};
};


internals.Auth.prototype.scheme = function (name, scheme) {

    Hoek.assert(name, 'Authentication scheme must have a name');
    Hoek.assert(!this._schemes[name], 'Authentication scheme name already exists:', name);
    Hoek.assert(typeof scheme === 'function', 'scheme must be a function:', name);

    this._schemes[name] = scheme;
};


internals.Auth.prototype.strategy = function (name, scheme /*, mode, options */) {

    const hasMode = (typeof arguments[2] === 'string' || typeof arguments[2] === 'boolean');
    const mode = (hasMode ? arguments[2] : false);
    const options = (hasMode ? arguments[3] : arguments[2]) || null;

    Hoek.assert(name, 'Authentication strategy must have a name');
    Hoek.assert(name !== 'bypass', 'Cannot use reserved strategy name: bypass');
    Hoek.assert(!this._strategies[name], 'Authentication strategy name already exists');
    Hoek.assert(scheme, 'Authentication strategy', name, 'missing scheme');
    Hoek.assert(this._schemes[scheme], 'Authentication strategy', name, 'uses unknown scheme:', scheme);

    const server = this.connection.server._clone([this.connection], '');
    const strategy = this._schemes[scheme](server, options);

    Hoek.assert(strategy.authenticate, 'Invalid scheme:', name, 'missing authenticate() method');
    Hoek.assert(typeof strategy.authenticate === 'function', 'Invalid scheme:', name, 'invalid authenticate() method');
    Hoek.assert(!strategy.payload || typeof strategy.payload === 'function', 'Invalid scheme:', name, 'invalid payload() method');
    Hoek.assert(!strategy.response || typeof strategy.response === 'function', 'Invalid scheme:', name, 'invalid response() method');
    strategy.options = strategy.options || {};
    Hoek.assert(strategy.payload || !strategy.options.payload, 'Cannot require payload validation without a payload method');

    this._strategies[name] = {
        methods: strategy,
        realm: server.realm
    };

    if (strategy.api) {
        this.api[name] = strategy.api;
    }

    if (mode) {
        this.default({ strategies: [name], mode: mode === true ? 'required' : mode });
    }
};


internals.Auth.prototype.default = function (options) {

    Hoek.assert(!this.settings.default, 'Cannot set default strategy more than once');
    options = Schema.apply('auth', options, 'default strategy');

    this.settings.default = this._setupRoute(Hoek.clone(options));      // Can change options
};


internals.Auth.prototype.test = function (name, request, next) {

    Hoek.assert(name, 'Missing authentication strategy name');
    const strategy = this._strategies[name];
    Hoek.assert(strategy, 'Unknown authentication strategy:', name);

    const reply = request.server._replier.interface(request, strategy.realm, { data: true }, (response) => next(response, reply._data && reply._data.credentials));
    strategy.methods.authenticate(request, reply);
};


internals.Auth.prototype._setupRoute = function (options, path) {

    if (!options) {
        return options;         // Preserve the difference between undefined and false
    }

    if (typeof options === 'string') {
        options = { strategies: [options] };
    }
    else if (options.strategy) {
        options.strategies = [options.strategy];
        delete options.strategy;
    }

    if (path &&
        !options.strategies) {

        Hoek.assert(this.settings.default, 'Route missing authentication strategy and no default defined:', path);
        options = Hoek.applyToDefaults(this.settings.default, options);
    }

    path = path || 'default strategy';
    Hoek.assert(options.strategies && options.strategies.length, 'Missing authentication strategy:', path);

    options.mode = options.mode || 'required';

    if (options.entity !== undefined ||                                             // Backwards compatibility with <= 11.x.x
        options.scope !== undefined) {

        options.access = [{ entity: options.entity, scope: options.scope }];
        delete options.entity;
        delete options.scope;
    }

    if (options.access) {
        for (let i = 0; i < options.access.length; ++i) {
            const access = options.access[i];
            access.scope = internals.setupScope(access);
        }
    }

    if (options.payload === true) {
        options.payload = 'required';
    }

    let hasAuthenticatePayload = false;
    for (let i = 0; i < options.strategies.length; ++i) {
        const name = options.strategies[i];
        const strategy = this._strategies[name];
        Hoek.assert(strategy, 'Unknown authentication strategy', name, 'in', path);

        Hoek.assert(strategy.methods.payload || options.payload !== 'required', 'Payload validation can only be required when all strategies support it in', path);
        hasAuthenticatePayload = hasAuthenticatePayload || strategy.methods.payload;
        Hoek.assert(!strategy.methods.options.payload || options.payload === undefined || options.payload === 'required', 'Cannot set authentication payload to', options.payload, 'when a strategy requires payload validation in', path);
    }

    Hoek.assert(!options.payload || hasAuthenticatePayload, 'Payload authentication requires at least one strategy with payload support in', path);

    return options;
};


internals.setupScope = function (access) {

    if (!access.scope) {
        return false;
    }

    const scope = {};
    for (let i = 0; i < access.scope.length; ++i) {
        const value = access.scope[i];
        const prefix = value[0];
        const type = (prefix === '+' ? 'required' : (prefix === '!' ? 'forbidden' : 'selection'));
        const clean = (type === 'selection' ? value : value.slice(1));
        scope[type] = scope[type] || [];
        scope[type].push(clean);

        if ((!scope._parameters || !scope._parameters[type]) &&
            /{([^}]+)}/.test(clean)) {

            scope._parameters = scope._parameters || {};
            scope._parameters[type] = true;
        }
    }

    return scope;
};


internals.Auth.prototype.lookup = function (route) {

    if (route.settings.auth === false) {
        return false;
    }

    return route.settings.auth || this.settings.default;
};


internals.Auth.authenticate = function (request, next) {

    const auth = request.connection.auth;
    return auth._authenticate(request, next);
};


internals.Auth.access = function (request, route) {

    const auth = request.connection.auth;
    const config = auth.lookup(route);
    if (!config) {
        return true;
    }

    const credentials = request.auth.credentials;
    if (!credentials) {
        return false;
    }

    return !internals.access(request, config, credentials, 'bypass');
};


internals.Auth.prototype._authenticate = function (request, next) {

    const config = this.lookup(request.route);
    if (!config) {
        return next();
    }

    const authenticator = new internals.Authenticator(config, request, this);
    authenticator.authenticate(next);
};


internals.Auth.payload = function (request, next) {

    if (!request.auth.isAuthenticated ||
        request.auth.strategy === 'bypass') {

        return next();
    }

    const auth = request.connection.auth;
    const strategy = auth._strategies[request.auth.strategy];

    if (!strategy.methods.payload) {
        return next();
    }

    const config = auth.lookup(request.route);
    const setting = config.payload || (strategy.methods.options.payload ? 'required' : false);
    if (!setting) {
        return next();
    }

    const finalize = (response) => {

        if (response &&
            response.isBoom &&
            response.isMissing) {

            return next(setting === 'optional' ? null : Boom.unauthorized('Missing payload authentication'));
        }

        return next(response);
    };

    request._protect.run(finalize, (exit) => {

        const reply = request.server._replier.interface(request, strategy.realm, {}, exit);
        strategy.methods.payload(request, reply);
    });
};


internals.Auth.response = function (request, next) {

    const auth = request.connection.auth;
    const config = auth.lookup(request.route);
    if (!config ||
        !request.auth.isAuthenticated ||
        request.auth.strategy === 'bypass') {

        return next();
    }

    const strategy = auth._strategies[request.auth.strategy];
    if (!strategy.methods.response) {
        return next();
    }

    request._protect.run(next, (exit) => {

        const reply = request.server._replier.interface(request, strategy.realm, {}, exit);
        strategy.methods.response(request, reply);
    });
};


internals.Authenticator = class {
    constructor(config, request, manager) {

        this.config = config;
        this.request = request;
        this.manager = manager;

        this.errors = [];
        this.current = -1;
    }

    authenticate(next) {

        this.request.auth.mode = this.config.mode;

        // Injection bypass

        if (this.request.auth.credentials) {
            return this.validate(null, { credentials: this.request.auth.credentials, artifacts: this.request.auth.artifacts }, next);
        }

        // Authenticate

        return this.execute(next);
    }

    execute(next) {

        const config = this.config;
        const request = this.request;

        // Find next strategy

        ++this.current;
        if (this.current < config.strategies.length) {
            const name = config.strategies[this.current];
            const after = (err, data) => this.validate(err, data, next);
            request._protect.run(after, (exit) => {

                const strategy = this.manager._strategies[name];
                const reply = request.server._replier.interface(request, strategy.realm, { data: true }, (err) => exit(err, reply._data));
                strategy.methods.authenticate(request, reply);
            });

            return;
        }

        // No more strategies

        const err = Boom.unauthorized('Missing authentication', this.errors);

        if (config.mode === 'optional' ||
            config.mode === 'try') {

            request.auth.isAuthenticated = false;
            request.auth.credentials = null;
            request.auth.error = err;
            request._log(['auth', 'unauthenticated']);
            return next();
        }

        return next(err);
    }

    validate(err, result, next) {                 // err can be Boom, Error, or a valid response object

        const config = this.config;
        const request = this.request;
        const name = config.strategies[this.current] || 'bypass';

        result = result || {};

        // Invalid

        if (!err &&
            !result.credentials) {

            return next(Boom.badImplementation('Authentication response missing both error and credentials'));
        }

        // Unauthenticated

        if (err) {
            if (err instanceof Error === false) {
                request._log(['auth', 'unauthenticated', 'response', name], err.statusCode);
                return next(err);
            }

            if (err.isMissing) {

                // Try next name

                request._log(['auth', 'unauthenticated', 'missing', name], err);
                this.errors.push(err.output.headers['WWW-Authenticate']);
                return this.execute(next);
            }

            if (config.mode === 'try') {
                request.auth.isAuthenticated = false;
                request.auth.strategy = name;
                request.auth.credentials = result.credentials;
                request.auth.artifacts = result.artifacts;
                request.auth.error = err;
                request._log(['auth', 'unauthenticated', 'try', name], err);
                return next();
            }

            request._log(['auth', 'unauthenticated', 'error', name], err);
            return next(err);
        }

        // Authenticated

        const credentials = result.credentials;
        request.auth.strategy = name;
        request.auth.credentials = credentials;
        request.auth.artifacts = result.artifacts;

        const authenticated = () => {

            request._log(['auth', name]);
            request.auth.isAuthenticated = true;
            return next();
        };

        // Check access rules

        const error = internals.access(request, config, credentials, name);
        if (!error) {
            return authenticated();
        }

        request._log(error.tags, error.data);
        return next(error.err);
    }
};


internals.access = function (request, config, credentials, name) {

    if (!config.access) {
        return null;
    }

    const requestEntity = (credentials.user ? 'user' : 'app');

    const scopeErrors = [];
    for (let i = 0; i < config.access.length; ++i) {
        const access = config.access[i];

        // Check entity

        const entity = access.entity;
        if (entity &&
            entity !== 'any' &&
            entity !== requestEntity) {

            continue;
        }

        // Check scope

        let scope = access.scope;
        if (scope) {
            if (!credentials.scope) {
                scopeErrors.push(scope);
                continue;
            }

            scope = internals.expandScope(request, scope);
            if (!internals.validateScope(credentials, scope, 'required') ||
                !internals.validateScope(credentials, scope, 'selection') ||
                !internals.validateScope(credentials, scope, 'forbidden')) {

                scopeErrors.push(scope);
                continue;
            }
        }

        return null;
    }

    // Scope error

    if (scopeErrors.length) {
        const data = { got: credentials.scope, need: scopeErrors };
        return { err: Boom.forbidden('Insufficient scope', data), tags: ['auth', 'scope', 'error', name], data };
    }

    // Entity error

    if (requestEntity === 'app') {
        return { err: Boom.forbidden('Application credentials cannot be used on a user endpoint'), tags: ['auth', 'entity', 'user', 'error', name] };
    }

    return { err: Boom.forbidden('User credentials cannot be used on an application endpoint'), tags: ['auth', 'entity', 'app', 'error', name] };
};


internals.expandScope = function (request, scope) {

    if (!scope._parameters) {
        return scope;
    }

    const expanded = {
        required: internals.expandScopeType(request, scope, 'required'),
        selection: internals.expandScopeType(request, scope, 'selection'),
        forbidden: internals.expandScopeType(request, scope, 'forbidden')
    };

    return expanded;
};


internals.expandScopeType = function (request, scope, type) {

    if (!scope[type] ||
        !scope._parameters[type]) {

        return scope[type];
    }

    const expanded = [];
    const context = {
        params: request.params,
        query: request.query
    };

    for (let i = 0; i < scope[type].length; ++i) {
        expanded.push(Hoek.reachTemplate(context, scope[type][i]));
    }

    return expanded;
};


internals.validateScope = function (credentials, scope, type) {

    if (!scope[type]) {
        return true;
    }

    const count = typeof credentials.scope === 'string' ?
        (scope[type].indexOf(credentials.scope) !== -1 ? 1 : 0) :
        Hoek.intersect(scope[type], credentials.scope).length;

    if (type === 'forbidden') {
        return count === 0;
    }

    if (type === 'required') {
        return count === scope.required.length;
    }

    return !!count;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Os = __webpack_require__(22);


// Declare internals

const internals = {};


exports.server = {
    debug: {
        request: ['implementation'],
        log: ['implementation']
    },
    load: {
        sampleInterval: 0
    },
    mime: null,                                     // Mimos options
    useDomains: true
};


exports.connection = {
    compression: true,                              // Enable response compression
    router: {
        isCaseSensitive: true,                      // Case-sensitive paths
        stripTrailingSlash: false                   // Remove trailing slash from incoming paths
    },
    routes: {
        cache: {
            statuses: [200, 204],                   // Array of HTTP status codes for which cache-control header is set
            otherwise: 'no-cache'
        },
        compression: {},
        cors: false,                                // CORS headers
        files: {
            relativeTo: '.'                         // Determines what file and directory handlers use to base relative paths off
        },
        json: {
            replacer: null,
            space: null,
            suffix: null
        },
        log: false,                                 // Enables request level log collection
        payload: {
            failAction: 'error',
            maxBytes: 1024 * 1024,
            output: 'data',
            parse: true,
            timeout: 10 * 1000,                     // Determines how long to wait for receiving client payload. Defaults to 10 seconds
            uploads: Os.tmpdir(),
            defaultContentType: 'application/json',
            compression: {}
        },
        response: {
            ranges: true,
            emptyStatusCode: 200,                   // HTTP status code when payload is empty (200, 204)
            options: {}                             // Joi validation options
        },
        security: false,                            // Security headers on responses: false -> null, true -> defaults, {} -> override defaults
        state: {
            parse: true,                            // Parse content of req.headers.cookie
            failAction: 'error'                     // Action on bad cookie - 'error': return 400, 'log': log and continue, 'ignore': continue
        },
        timeout: {
            socket: undefined,                      // Determines how long before closing request socket. Defaults to node (2 minutes)
            server: false                           // Determines how long to wait for server request processing. Disabled by default
        },
        validate: {
            options: {}                             // Joi validation options
        }
    }
};


exports.security = {
    hsts: 15768000,
    xframe: 'deny',
    xss: true,
    noOpen: true,
    noSniff: true
};


exports.cors = {
    origin: ['*'],
    maxAge: 86400,                                  // One day
    headers: [
        'Accept',
        'Authorization',
        'Content-Type',
        'If-None-Match'
    ],
    additionalHeaders: [],
    exposedHeaders: [
        'WWW-Authenticate',
        'Server-Authorization'
    ],
    additionalExposedHeaders: [],
    credentials: false
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.wrap = function (bind, method, args) {

    return new Promise((resolve, reject) => {

        const callback = (err, result) => {

            if (err) {
                return reject(err);
            }

            return resolve(result);
        };

        method.apply(bind, args ? args.concat(callback) : [callback]);
    });
};


exports.isThennable = function (candidate) {

    return (candidate && typeof candidate.then === 'function' ? true : false);

};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

const config = (options) => {
	Object.assign(current, options)
	initServices();
	initInterceptors();
	return current
}

function initServices() {
	if (current.api && !current.services["mk-server"]) {
		current.services["mk-server"] = {
			apiRootUrl: '/',
			api: current.api,
		}
	}
}

function initInterceptors() {
	var array = current.interceptors;
	current.interceptors = array.map(i => {
		if (typeof i == "function") return i;
		if (typeof i == "string") return Function('obj', 'return obj.' + i)(current);
	})
}

const current = {
	apiRootUrl: "/",
	website: "",
	proxy: {},
	services: {},
	interceptors: [],
}

module.exports = Object.assign(config, {
	current,
})

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Ref = __webpack_require__(5);

module.exports = class Set {

    constructor() {

        this._set = [];
    }

    add(value, refs) {

        if (!Ref.isRef(value) && this.has(value, null, null, false)) {

            return;
        }

        if (refs !== undefined) { // If it's a merge, we don't have any refs
            Ref.push(refs, value);
        }

        this._set.push(value);
        return this;
    }

    merge(add, remove) {

        for (let i = 0; i < add._set.length; ++i) {
            this.add(add._set[i]);
        }

        for (let i = 0; i < remove._set.length; ++i) {
            this.remove(remove._set[i]);
        }

        return this;
    }

    remove(value) {

        this._set = this._set.filter((item) => value !== item);
        return this;
    }

    has(value, state, options, insensitive) {

        for (let i = 0; i < this._set.length; ++i) {
            let items = this._set[i];

            if (state && Ref.isRef(items)) { // Only resolve references if there is a state, otherwise it's a merge
                items = items(state.reference || state.parent, options);
            }

            if (!Array.isArray(items)) {
                items = [items];
            }

            for (let j = 0; j < items.length; ++j) {
                const item = items[j];
                if (typeof value !== typeof item) {
                    continue;
                }

                if (value === item ||
                    (value instanceof Date && item instanceof Date && value.getTime() === item.getTime()) ||
                    (insensitive && typeof value === 'string' && value.toLowerCase() === item.toLowerCase()) ||
                    (Buffer.isBuffer(value) && Buffer.isBuffer(item) && value.length === item.length && value.toString('binary') === item.toString('binary'))) {

                    return true;
                }
            }
        }

        return false;
    }

    values(options) {

        if (options && options.stripUndefined) {
            const values = [];

            for (let i = 0; i < this._set.length; ++i) {
                const item = this._set[i];
                if (item !== undefined) {
                    values.push(item);
                }
            }

            return values;
        }

        return this._set.slice();
    }

    slice() {

        const newSet = new Set();
        newSet._set = this._set.slice();

        return newSet;
    }

    concat(source) {

        const newSet = new Set();
        newSet._set = this._set.concat(source._set);

        return newSet;
    }
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Net = __webpack_require__(60);
const Hoek = __webpack_require__(0);
let Isemail;                            // Loaded on demand
const Any = __webpack_require__(4);
const Ref = __webpack_require__(5);
const JoiDate = __webpack_require__(19);
const Uri = __webpack_require__(61);
const Ip = __webpack_require__(62);

// Declare internals

const internals = {
    uriRegex: Uri.createUriRegex(),
    ipRegex: Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], 'optional'),
    guidBrackets: {
        '{': '}', '[': ']', '(': ')', '': ''
    },
    guidVersions: {
        uuidv1: '1',
        uuidv2: '2',
        uuidv3: '3',
        uuidv4: '4',
        uuidv5: '5'
    }
};

internals.String = class extends Any {

    constructor() {

        super();
        this._type = 'string';
        this._invalids.add('');
    }

    _base(value, state, options) {

        if (typeof value === 'string' &&
            options.convert) {

            if (this._flags.case) {
                value = (this._flags.case === 'upper' ? value.toLocaleUpperCase() : value.toLocaleLowerCase());
            }

            if (this._flags.trim) {
                value = value.trim();
            }

            if (this._inner.replacements) {

                for (let i = 0; i < this._inner.replacements.length; ++i) {
                    const replacement = this._inner.replacements[i];
                    value = value.replace(replacement.pattern, replacement.replacement);
                }
            }

            if (this._flags.truncate) {
                for (let i = 0; i < this._tests.length; ++i) {
                    const test = this._tests[i];
                    if (test.name === 'max') {
                        value = value.slice(0, test.arg);
                        break;
                    }
                }
            }
        }

        return {
            value,
            errors: (typeof value === 'string') ? null : this.createError('string.base', { value }, state, options)
        };
    }

    insensitive() {

        if (this._flags.insensitive) {
            return this;
        }

        const obj = this.clone();
        obj._flags.insensitive = true;
        return obj;
    }

    creditCard() {

        return this._test('creditCard', undefined, function (value, state, options) {

            let i = value.length;
            let sum = 0;
            let mul = 1;

            while (i--) {
                const char = value.charAt(i) * mul;
                sum = sum + (char - (char > 9) * 9);
                mul = mul ^ 3;
            }

            const check = (sum % 10 === 0) && (sum > 0);
            return check ? value : this.createError('string.creditCard', { value }, state, options);
        });
    }

    regex(pattern, patternOptions) {

        Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');

        const patternObject = {
            pattern: new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined)         // Future version should break this and forbid unsupported regex flags
        };

        if (typeof patternOptions === 'string') {
            patternObject.name = patternOptions;
        }
        else if (typeof patternOptions === 'object') {
            patternObject.invert = !!patternOptions.invert;

            if (patternOptions.name) {
                patternObject.name = patternOptions.name;
            }
        }

        const errorCode = ['string.regex', patternObject.invert ? '.invert' : '', patternObject.name ? '.name' : '.base'].join('');

        return this._test('regex', patternObject, function (value, state, options) {

            const patternMatch = patternObject.pattern.test(value);

            if (patternMatch ^ patternObject.invert) {
                return value;
            }

            return this.createError(errorCode, { name: patternObject.name, pattern: patternObject.pattern, value }, state, options);
        });
    }

    alphanum() {

        return this._test('alphanum', undefined, function (value, state, options) {

            if (/^[a-zA-Z0-9]+$/.test(value)) {
                return value;
            }

            return this.createError('string.alphanum', { value }, state, options);
        });
    }

    token() {

        return this._test('token', undefined, function (value, state, options) {

            if (/^\w+$/.test(value)) {
                return value;
            }

            return this.createError('string.token', { value }, state, options);
        });
    }

    email(isEmailOptions) {

        if (isEmailOptions) {
            Hoek.assert(typeof isEmailOptions === 'object', 'email options must be an object');
            Hoek.assert(typeof isEmailOptions.checkDNS === 'undefined', 'checkDNS option is not supported');
            Hoek.assert(typeof isEmailOptions.tldWhitelist === 'undefined' ||
                typeof isEmailOptions.tldWhitelist === 'object', 'tldWhitelist must be an array or object');
            Hoek.assert(typeof isEmailOptions.minDomainAtoms === 'undefined' ||
                Number.isSafeInteger(isEmailOptions.minDomainAtoms) && isEmailOptions.minDomainAtoms > 0,
                'minDomainAtoms must be a positive integer');
            Hoek.assert(typeof isEmailOptions.errorLevel === 'undefined' || typeof isEmailOptions.errorLevel === 'boolean' ||
                (Number.isSafeInteger(isEmailOptions.errorLevel) && isEmailOptions.errorLevel >= 0),
                'errorLevel must be a non-negative integer or boolean');
        }

        return this._test('email', isEmailOptions, function (value, state, options) {

            Isemail = Isemail || __webpack_require__(63);

            try {
                const result = Isemail.validate(value, isEmailOptions);
                if (result === true || result === 0) {
                    return value;
                }
            }
            catch (e) { }

            return this.createError('string.email', { value }, state, options);
        });
    }

    ip(ipOptions) {

        let regex = internals.ipRegex;
        ipOptions = ipOptions || {};
        Hoek.assert(typeof ipOptions === 'object', 'options must be an object');

        if (ipOptions.cidr) {
            Hoek.assert(typeof ipOptions.cidr === 'string', 'cidr must be a string');
            ipOptions.cidr = ipOptions.cidr.toLowerCase();

            Hoek.assert(ipOptions.cidr in Ip.cidrs, 'cidr must be one of ' + Object.keys(Ip.cidrs).join(', '));

            // If we only received a `cidr` setting, create a regex for it. But we don't need to create one if `cidr` is "optional" since that is the default
            if (!ipOptions.version && ipOptions.cidr !== 'optional') {
                regex = Ip.createIpRegex(['ipv4', 'ipv6', 'ipvfuture'], ipOptions.cidr);
            }
        }
        else {

            // Set our default cidr strategy
            ipOptions.cidr = 'optional';
        }

        let versions;
        if (ipOptions.version) {
            if (!Array.isArray(ipOptions.version)) {
                ipOptions.version = [ipOptions.version];
            }

            Hoek.assert(ipOptions.version.length >= 1, 'version must have at least 1 version specified');

            versions = [];
            for (let i = 0; i < ipOptions.version.length; ++i) {
                let version = ipOptions.version[i];
                Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
                version = version.toLowerCase();
                Hoek.assert(Ip.versions[version], 'version at position ' + i + ' must be one of ' + Object.keys(Ip.versions).join(', '));
                versions.push(version);
            }

            // Make sure we have a set of versions
            versions = Hoek.unique(versions);

            regex = Ip.createIpRegex(versions, ipOptions.cidr);
        }

        return this._test('ip', ipOptions, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            if (versions) {
                return this.createError('string.ipVersion', { value, cidr: ipOptions.cidr, version: versions }, state, options);
            }

            return this.createError('string.ip', { value, cidr: ipOptions.cidr }, state, options);
        });
    }

    uri(uriOptions) {

        let customScheme = '';
        let allowRelative = false;
        let relativeOnly = false;
        let regex = internals.uriRegex;

        if (uriOptions) {
            Hoek.assert(typeof uriOptions === 'object', 'options must be an object');

            if (uriOptions.scheme) {
                Hoek.assert(uriOptions.scheme instanceof RegExp || typeof uriOptions.scheme === 'string' || Array.isArray(uriOptions.scheme), 'scheme must be a RegExp, String, or Array');

                if (!Array.isArray(uriOptions.scheme)) {
                    uriOptions.scheme = [uriOptions.scheme];
                }

                Hoek.assert(uriOptions.scheme.length >= 1, 'scheme must have at least 1 scheme specified');

                // Flatten the array into a string to be used to match the schemes.
                for (let i = 0; i < uriOptions.scheme.length; ++i) {
                    const scheme = uriOptions.scheme[i];
                    Hoek.assert(scheme instanceof RegExp || typeof scheme === 'string', 'scheme at position ' + i + ' must be a RegExp or String');

                    // Add OR separators if a value already exists
                    customScheme = customScheme + (customScheme ? '|' : '');

                    // If someone wants to match HTTP or HTTPS for example then we need to support both RegExp and String so we don't escape their pattern unknowingly.
                    if (scheme instanceof RegExp) {
                        customScheme = customScheme + scheme.source;
                    }
                    else {
                        Hoek.assert(/[a-zA-Z][a-zA-Z0-9+-\.]*/.test(scheme), 'scheme at position ' + i + ' must be a valid scheme');
                        customScheme = customScheme + Hoek.escapeRegex(scheme);
                    }
                }
            }

            if (uriOptions.allowRelative) {
                allowRelative = true;
            }

            if (uriOptions.relativeOnly) {
                relativeOnly = true;
            }
        }

        if (customScheme || allowRelative || relativeOnly) {
            regex = Uri.createUriRegex(customScheme, allowRelative, relativeOnly);
        }

        return this._test('uri', uriOptions, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            if (relativeOnly) {
                return this.createError('string.uriRelativeOnly', { value }, state, options);
            }

            if (customScheme) {
                return this.createError('string.uriCustomScheme', { scheme: customScheme, value }, state, options);
            }

            return this.createError('string.uri', { value }, state, options);
        });
    }

    isoDate() {

        return this._test('isoDate', undefined, function (value, state, options) {

            if (JoiDate._isIsoDate(value)) {
                return value;
            }

            return this.createError('string.isoDate', { value }, state, options);
        });
    }

    guid(guidOptions) {

        let versionNumbers = '';

        if (guidOptions && guidOptions.version) {
            if (!Array.isArray(guidOptions.version)) {
                guidOptions.version = [guidOptions.version];
            }

            Hoek.assert(guidOptions.version.length >= 1, 'version must have at least 1 valid version specified');
            const versions = new Set();

            for (let i = 0; i < guidOptions.version.length; ++i) {
                let version = guidOptions.version[i];
                Hoek.assert(typeof version === 'string', 'version at position ' + i + ' must be a string');
                version = version.toLowerCase();
                const versionNumber = internals.guidVersions[version];
                Hoek.assert(versionNumber, 'version at position ' + i + ' must be one of ' + Object.keys(internals.guidVersions).join(', '));
                Hoek.assert(!(versions.has(versionNumber)), 'version at position ' + i + ' must not be a duplicate.');

                versionNumbers += versionNumber;
                versions.add(versionNumber);
            }
        }

        const guidRegex = new RegExp(`^([\\[{\\(]?)[0-9A-F]{8}([:-]?)[0-9A-F]{4}\\2?[${versionNumbers || '0-9A-F'}][0-9A-F]{3}\\2?[${versionNumbers ? '89AB' : '0-9A-F'}][0-9A-F]{3}\\2?[0-9A-F]{12}([\\]}\\)]?)$`, 'i');

        return this._test('guid', guidOptions, function (value, state, options) {

            const results = guidRegex.exec(value);

            if (!results) {
                return this.createError('string.guid', { value }, state, options);
            }

            // Matching braces
            if (internals.guidBrackets[results[1]] !== results[results.length - 1]) {
                return this.createError('string.guid', { value }, state, options);
            }

            return value;
        });
    }

    hex() {

        const regex = /^[a-f0-9]+$/i;

        return this._test('hex', regex, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            return this.createError('string.hex', { value }, state, options);
        });
    }

    base64(base64Options) {

        base64Options = base64Options || {};

        // Validation.
        Hoek.assert(typeof base64Options === 'object', 'base64 options must be an object');
        Hoek.assert(typeof base64Options.paddingRequired === 'undefined' || typeof base64Options.paddingRequired === 'boolean',
            'paddingRequired must be boolean');

        // Determine if padding is required.
        const paddingRequired = base64Options.paddingRequired === false ?
            base64Options.paddingRequired
            : base64Options.paddingRequired || true;

        // Set validation based on preference.
        const regex = paddingRequired ?
            // Padding is required.
            /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/
            // Padding is optional.
            : /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}(==)?|[A-Za-z0-9+\/]{3}=?)?$/;

        return this._test('base64', regex, function (value, state, options) {

            if (regex.test(value)) {
                return value;
            }

            return this.createError('string.base64', { value }, state, options);
        });
    }

    hostname() {

        const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;

        return this._test('hostname', undefined, function (value, state, options) {

            if ((value.length <= 255 && regex.test(value)) ||
                Net.isIPv6(value)) {

                return value;
            }

            return this.createError('string.hostname', { value }, state, options);
        });
    }

    lowercase() {

        const obj = this._test('lowercase', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.toLocaleLowerCase()) {

                return value;
            }

            return this.createError('string.lowercase', { value }, state, options);
        });

        obj._flags.case = 'lower';
        return obj;
    }

    uppercase() {

        const obj = this._test('uppercase', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.toLocaleUpperCase()) {

                return value;
            }

            return this.createError('string.uppercase', { value }, state, options);
        });

        obj._flags.case = 'upper';
        return obj;
    }

    trim() {

        const obj = this._test('trim', undefined, function (value, state, options) {

            if (options.convert ||
                value === value.trim()) {

                return value;
            }

            return this.createError('string.trim', { value }, state, options);
        });

        obj._flags.trim = true;
        return obj;
    }

    replace(pattern, replacement) {

        if (typeof pattern === 'string') {
            pattern = new RegExp(Hoek.escapeRegex(pattern), 'g');
        }

        Hoek.assert(pattern instanceof RegExp, 'pattern must be a RegExp');
        Hoek.assert(typeof replacement === 'string', 'replacement must be a String');

        // This can not be considere a test like trim, we can't "reject"
        // anything from this rule, so just clone the current object
        const obj = this.clone();

        if (!obj._inner.replacements) {
            obj._inner.replacements = [];
        }

        obj._inner.replacements.push({
            pattern,
            replacement
        });

        return obj;
    }

    truncate(enabled) {

        const value = enabled === undefined ? true : !!enabled;

        if (this._flags.truncate === value) {
            return this;
        }

        const obj = this.clone();
        obj._flags.truncate = value;
        return obj;
    }

};

internals.compare = function (type, compare) {

    return function (limit, encoding) {

        const isRef = Ref.isRef(limit);

        Hoek.assert((Number.isSafeInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');
        Hoek.assert(!encoding || Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

        return this._test(type, limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!Number.isSafeInteger(compareTo)) {
                    return this.createError('string.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo, encoding)) {
                return value;
            }

            return this.createError('string.' + type, { limit: compareTo, value, encoding }, state, options);
        });
    };
};


internals.String.prototype.min = internals.compare('min', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length >= limit;
});


internals.String.prototype.max = internals.compare('max', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length <= limit;
});


internals.String.prototype.length = internals.compare('length', (value, limit, encoding) => {

    const length = encoding ? Buffer.byteLength(value, encoding) : value.length;
    return length === limit;
});

// Aliases

internals.String.prototype.uuid = internals.String.prototype.guid;

module.exports = new internals.String();


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Delcare internals

const internals = {
    rfc3986: {}
};


internals.generate = function () {

    /**
     * elements separated by forward slash ("/") are alternatives.
     */
    const or = '|';

    /**
     * DIGIT = %x30-39 ; 0-9
     */
    const digit = '0-9';
    const digitOnly = '[' + digit + ']';

    /**
     * ALPHA = %x41-5A / %x61-7A   ; A-Z / a-z
     */
    const alpha = 'a-zA-Z';
    const alphaOnly = '[' + alpha + ']';

    /**
     * cidr       = DIGIT                ; 0-9
     *            / %x31-32 DIGIT         ; 10-29
     *            / "3" %x30-32           ; 30-32
     */
    internals.rfc3986.cidr = digitOnly + or + '[1-2]' + digitOnly + or + '3' + '[0-2]';

    /**
     * HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
     */
    const hexDigit = digit + 'A-Fa-f';
    const hexDigitOnly = '[' + hexDigit + ']';

    /**
     * unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
     */
    const unreserved = alpha + digit + '-\\._~';

    /**
     * sub-delims = "!" / "$" / "&" / "'" / "(" / ")" / "*" / "+" / "," / ";" / "="
     */
    const subDelims = '!\\$&\'\\(\\)\\*\\+,;=';

    /**
     * pct-encoded = "%" HEXDIG HEXDIG
     */
    const pctEncoded = '%' + hexDigit;

    /**
     * pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
     */
    const pchar = unreserved + pctEncoded + subDelims + ':@';
    const pcharOnly = '[' + pchar + ']';

    /**
     * Rule to support zero-padded addresses.
     */
    const zeroPad = '0?';

    /**
     * dec-octet   = DIGIT                 ; 0-9
     *            / %x31-39 DIGIT         ; 10-99
     *            / "1" 2DIGIT            ; 100-199
     *            / "2" %x30-34 DIGIT     ; 200-249
     *            / "25" %x30-35          ; 250-255
     */
    const decOctect = '(?:' + zeroPad + zeroPad + digitOnly + or + zeroPad + '[1-9]' + digitOnly + or + '1' + digitOnly + digitOnly + or + '2' + '[0-4]' + digitOnly + or + '25' + '[0-5])';

    /**
     * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
     */
    internals.rfc3986.IPv4address = '(?:' + decOctect + '\\.){3}' + decOctect;

    /**
     * h16 = 1*4HEXDIG ; 16 bits of address represented in hexadecimal
     * ls32 = ( h16 ":" h16 ) / IPv4address ; least-significant 32 bits of address
     * IPv6address =                            6( h16 ":" ) ls32
     *             /                       "::" 5( h16 ":" ) ls32
     *             / [               h16 ] "::" 4( h16 ":" ) ls32
     *             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
     *             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
     *             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
     *             / [ *4( h16 ":" ) h16 ] "::"              ls32
     *             / [ *5( h16 ":" ) h16 ] "::"              h16
     *             / [ *6( h16 ":" ) h16 ] "::"
     */
    const h16 = hexDigitOnly + '{1,4}';
    const ls32 = '(?:' + h16 + ':' + h16 + '|' + internals.rfc3986.IPv4address + ')';
    const IPv6SixHex = '(?:' + h16 + ':){6}' + ls32;
    const IPv6FiveHex = '::(?:' + h16 + ':){5}' + ls32;
    const IPv6FourHex = '(?:' + h16 + ')?::(?:' + h16 + ':){4}' + ls32;
    const IPv6ThreeHex = '(?:(?:' + h16 + ':){0,1}' + h16 + ')?::(?:' + h16 + ':){3}' + ls32;
    const IPv6TwoHex = '(?:(?:' + h16 + ':){0,2}' + h16 + ')?::(?:' + h16 + ':){2}' + ls32;
    const IPv6OneHex = '(?:(?:' + h16 + ':){0,3}' + h16 + ')?::' + h16 + ':' + ls32;
    const IPv6NoneHex = '(?:(?:' + h16 + ':){0,4}' + h16 + ')?::' + ls32;
    const IPv6NoneHex2 = '(?:(?:' + h16 + ':){0,5}' + h16 + ')?::' + h16;
    const IPv6NoneHex3 = '(?:(?:' + h16 + ':){0,6}' + h16 + ')?::';
    internals.rfc3986.IPv6address = '(?:' + IPv6SixHex + or + IPv6FiveHex + or + IPv6FourHex + or + IPv6ThreeHex + or + IPv6TwoHex + or + IPv6OneHex + or + IPv6NoneHex + or + IPv6NoneHex2 + or + IPv6NoneHex3 + ')';

    /**
     * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
     */
    internals.rfc3986.IPvFuture = 'v' + hexDigitOnly + '+\\.[' + unreserved + subDelims + ':]+';

    /**
     * scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
     */
    internals.rfc3986.scheme = alphaOnly + '[' + alpha + digit + '+-\\.]*';

    /**
     * userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
     */
    const userinfo = '[' + unreserved + pctEncoded + subDelims + ':]*';

    /**
     * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
     */
    const IPLiteral = '\\[(?:' + internals.rfc3986.IPv6address + or + internals.rfc3986.IPvFuture + ')\\]';

    /**
     * reg-name = *( unreserved / pct-encoded / sub-delims )
     */
    const regName = '[' + unreserved + pctEncoded + subDelims + ']{0,255}';

    /**
     * host = IP-literal / IPv4address / reg-name
     */
    const host = '(?:' + IPLiteral + or + internals.rfc3986.IPv4address + or + regName + ')';

    /**
     * port = *DIGIT
     */
    const port = digitOnly + '*';

    /**
     * authority   = [ userinfo "@" ] host [ ":" port ]
     */
    const authority = '(?:' + userinfo + '@)?' + host + '(?::' + port + ')?';

    /**
     * segment       = *pchar
     * segment-nz    = 1*pchar
     * path          = path-abempty    ; begins with "/" or is empty
     *               / path-absolute   ; begins with "/" but not "//"
     *               / path-noscheme   ; begins with a non-colon segment
     *               / path-rootless   ; begins with a segment
     *               / path-empty      ; zero characters
     * path-abempty  = *( "/" segment )
     * path-absolute = "/" [ segment-nz *( "/" segment ) ]
     * path-rootless = segment-nz *( "/" segment )
     */
    const segment = pcharOnly + '*';
    const segmentNz = pcharOnly + '+';
    const segmentNzNc = '[' + unreserved + pctEncoded + subDelims + '@' + ']+';
    const pathEmpty = '';
    const pathAbEmpty = '(?:\\/' + segment + ')*';
    const pathAbsolute = '\\/(?:' + segmentNz + pathAbEmpty + ')?';
    const pathRootless = segmentNz + pathAbEmpty;
    const pathNoScheme = segmentNzNc + pathAbEmpty;

    /**
     * hier-part = "//" authority path
     */
    internals.rfc3986.hierPart = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty + ')' + or + pathAbsolute + or + pathRootless + ')';

    /**
     * relative-part = "//" authority path-abempty
     *                 / path-absolute
     *                 / path-noscheme
     *                 / path-empty
     */
    internals.rfc3986.relativeRef = '(?:' + '(?:\\/\\/' + authority + pathAbEmpty  + ')' + or + pathAbsolute + or + pathNoScheme + or + pathEmpty + ')';

    /**
     * query = *( pchar / "/" / "?" )
     */
    internals.rfc3986.query = '[' + pchar + '\\/\\?]*(?=#|$)'; //Finish matching either at the fragment part or end of the line.

    /**
     * fragment = *( pchar / "/" / "?" )
     */
    internals.rfc3986.fragment = '[' + pchar + '\\/\\?]*';
};


internals.generate();

module.exports = internals.rfc3986;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Ref = __webpack_require__(5);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {
    precisionRx: /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/
};


internals.Number = class extends Any {

    constructor() {

        super();
        this._type = 'number';
        this._invalids.add(Infinity);
        this._invalids.add(-Infinity);
    }

    _base(value, state, options) {

        const result = {
            errors: null,
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            const number = parseFloat(value);
            result.value = (isNaN(number) || !isFinite(value)) ? NaN : number;
        }

        const isNumber = typeof result.value === 'number' && !isNaN(result.value);

        if (options.convert && 'precision' in this._flags && isNumber) {

            // This is conceptually equivalent to using toFixed but it should be much faster
            const precision = Math.pow(10, this._flags.precision);
            result.value = Math.round(result.value * precision) / precision;
        }

        result.errors = isNumber ? null : this.createError('number.base', null, state, options);
        return result;
    }

    multiple(base) {

        const isRef = Ref.isRef(base);

        if (!isRef) {
            Hoek.assert(typeof base === 'number' && isFinite(base), 'multiple must be a number');
            Hoek.assert(base > 0, 'multiple must be greater than 0');
        }

        return this._test('multiple', base, function (value, state, options) {

            const divisor = isRef ? base(state.reference || state.parent, options) : base;

            if (isRef && (typeof divisor !== 'number' || !isFinite(divisor))) {
                return this.createError('number.ref', { ref: base.key }, state, options);
            }

            if (value % divisor === 0) {
                return value;
            }

            return this.createError('number.multiple', { multiple: base, value }, state, options);
        });
    }

    integer() {

        return this._test('integer', undefined, function (value, state, options) {

            return Number.isSafeInteger(value) ? value : this.createError('number.integer', { value }, state, options);
        });
    }

    negative() {

        return this._test('negative', undefined, function (value, state, options) {

            if (value < 0) {
                return value;
            }

            return this.createError('number.negative', { value }, state, options);
        });
    }

    positive() {

        return this._test('positive', undefined, function (value, state, options) {

            if (value > 0) {
                return value;
            }

            return this.createError('number.positive', { value }, state, options);
        });
    }

    precision(limit) {

        Hoek.assert(Number.isSafeInteger(limit), 'limit must be an integer');
        Hoek.assert(!('precision' in this._flags), 'precision already set');

        const obj = this._test('precision', limit, function (value, state, options) {

            const places = value.toString().match(internals.precisionRx);
            const decimals = Math.max((places[1] ? places[1].length : 0) - (places[2] ? parseInt(places[2], 10) : 0), 0);
            if (decimals <= limit) {
                return value;
            }

            return this.createError('number.precision', { limit, value }, state, options);
        });

        obj._flags.precision = limit;
        return obj;
    }

};


internals.compare = function (type, compare) {

    return function (limit) {

        const isRef = Ref.isRef(limit);
        const isNumber = typeof limit === 'number' && !isNaN(limit);

        Hoek.assert(isNumber || isRef, 'limit must be a number or reference');

        return this._test(type, limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!(typeof compareTo === 'number' && !isNaN(compareTo))) {
                    return this.createError('number.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (compare(value, compareTo)) {
                return value;
            }

            return this.createError('number.' + type, { limit: compareTo, value }, state, options);
        });
    };
};


internals.Number.prototype.min = internals.compare('min', (value, limit) => value >= limit);
internals.Number.prototype.max = internals.compare('max', (value, limit) => value <= limit);
internals.Number.prototype.greater = internals.compare('greater', (value, limit) => value > limit);
internals.Number.prototype.less = internals.compare('less', (value, limit) => value < limit);


module.exports = new internals.Number();


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {
    Set: __webpack_require__(29)
};


internals.Boolean = class extends Any {
    constructor() {

        super();
        this._type = 'boolean';
        this._flags.insensitive = true;
        this._inner.truthySet = new internals.Set();
        this._inner.falsySet = new internals.Set();
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            const normalized = this._flags.insensitive ? value.toLowerCase() : value;
            result.value = (normalized === 'true' ? true
                : (normalized === 'false' ? false : value));
        }

        if (typeof result.value !== 'boolean') {
            result.value = (this._inner.truthySet.has(value, null, null, this._flags.insensitive) ? true
                : (this._inner.falsySet.has(value, null, null, this._flags.insensitive) ? false : value));
        }

        result.errors = (typeof result.value === 'boolean') ? null : this.createError('boolean.base', null, state, options);
        return result;
    }

    truthy() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call truthy with undefined');
            obj._inner.truthySet.add(value);
        }
        return obj;
    }

    falsy() {

        const obj = this.clone();
        const values = Hoek.flatten(Array.prototype.slice.call(arguments));
        for (let i = 0; i < values.length; ++i) {
            const value = values[i];

            Hoek.assert(value !== undefined, 'Cannot call falsy with undefined');
            obj._inner.falsySet.add(value);
        }
        return obj;
    }

    insensitive(enabled) {

        const insensitive = enabled === undefined ? true : !!enabled;

        if (this._flags.insensitive === insensitive) {
            return this;
        }

        const obj = this.clone();
        obj._flags.insensitive = insensitive;
        return obj;
    }

    describe() {

        const description = Any.prototype.describe.call(this);
        description.truthy = [true].concat(this._inner.truthySet.values());
        description.falsy = [false].concat(this._inner.falsySet.values());
        return description;
    }
};


module.exports = new internals.Boolean();


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Topo = __webpack_require__(35);
const Any = __webpack_require__(4);
const Errors = __webpack_require__(18);
const Cast = __webpack_require__(8);
const Ref = __webpack_require__(5);


// Declare internals

const internals = {};


internals.Object = class extends Any {

    constructor() {

        super();
        this._type = 'object';
        this._inner.children = null;
        this._inner.renames = [];
        this._inner.dependencies = [];
        this._inner.patterns = [];
    }

    _base(value, state, options) {

        let target = value;
        const errors = [];
        const finish = () => {

            return {
                value: target,
                errors: errors.length ? errors : null
            };
        };

        if (typeof value === 'string' &&
            options.convert) {

            value = internals.safeParse(value);
        }

        const type = this._flags.func ? 'function' : 'object';
        if (!value ||
            typeof value !== type ||
            Array.isArray(value)) {

            errors.push(this.createError(type + '.base', null, state, options));
            return finish();
        }

        // Skip if there are no other rules to test

        if (!this._inner.renames.length &&
            !this._inner.dependencies.length &&
            !this._inner.children &&                    // null allows any keys
            !this._inner.patterns.length) {

            target = value;
            return finish();
        }

        // Ensure target is a local copy (parsed) or shallow copy

        if (target === value) {
            if (type === 'object') {
                target = Object.create(Object.getPrototypeOf(value));
            }
            else {
                target = function () {

                    return value.apply(this, arguments);
                };

                target.prototype = Hoek.clone(value.prototype);
            }

            const valueKeys = Object.keys(value);
            for (let i = 0; i < valueKeys.length; ++i) {
                target[valueKeys[i]] = value[valueKeys[i]];
            }
        }
        else {
            target = value;
        }

        // Rename keys

        const renamed = {};
        for (let i = 0; i < this._inner.renames.length; ++i) {
            const rename = this._inner.renames[i];

            if (rename.options.ignoreUndefined && target[rename.from] === undefined) {
                continue;
            }

            if (!rename.options.multiple &&
                renamed[rename.to]) {

                errors.push(this.createError('object.rename.multiple', { from: rename.from, to: rename.to }, state, options));
                if (options.abortEarly) {
                    return finish();
                }
            }

            if (Object.prototype.hasOwnProperty.call(target, rename.to) &&
                !rename.options.override &&
                !renamed[rename.to]) {

                errors.push(this.createError('object.rename.override', { from: rename.from, to: rename.to }, state, options));
                if (options.abortEarly) {
                    return finish();
                }
            }

            if (target[rename.from] === undefined) {
                delete target[rename.to];
            }
            else {
                target[rename.to] = target[rename.from];
            }

            renamed[rename.to] = true;

            if (!rename.options.alias) {
                delete target[rename.from];
            }
        }

        // Validate schema

        if (!this._inner.children &&            // null allows any keys
            !this._inner.patterns.length &&
            !this._inner.dependencies.length) {

            return finish();
        }

        const unprocessed = Hoek.mapToObject(Object.keys(target));

        if (this._inner.children) {
            const stripProps = [];

            for (let i = 0; i < this._inner.children.length; ++i) {
                const child = this._inner.children[i];
                const key = child.key;
                const item = target[key];

                delete unprocessed[key];

                const localState = { key, path: (state.path || '') + (state.path && key ? '.' : '') + key, parent: target, reference: state.reference };
                const result = child.schema._validate(item, localState, options);
                if (result.errors) {
                    errors.push(this.createError('object.child', { key, child: child.schema._getLabel(key), reason: result.errors }, localState, options));

                    if (options.abortEarly) {
                        return finish();
                    }
                }
                else {
                    if (child.schema._flags.strip || (result.value === undefined && result.value !== item)) {
                        stripProps.push(key);
                        target[key] = result.finalValue;
                    }
                    else if (result.value !== undefined) {
                        target[key] = result.value;
                    }
                }
            }

            for (let i = 0; i < stripProps.length; ++i) {
                delete target[stripProps[i]];
            }
        }

        // Unknown keys

        let unprocessedKeys = Object.keys(unprocessed);
        if (unprocessedKeys.length &&
            this._inner.patterns.length) {

            for (let i = 0; i < unprocessedKeys.length; ++i) {
                const key = unprocessedKeys[i];
                const localState = { key, path: (state.path ? state.path + '.' : '') + key, parent: target, reference: state.reference };
                const item = target[key];

                for (let j = 0; j < this._inner.patterns.length; ++j) {
                    const pattern = this._inner.patterns[j];

                    if (pattern.regex.test(key)) {
                        delete unprocessed[key];

                        const result = pattern.rule._validate(item, localState, options);
                        if (result.errors) {
                            errors.push(this.createError('object.child', { key, child: pattern.rule._getLabel(key), reason: result.errors }, localState, options));

                            if (options.abortEarly) {
                                return finish();
                            }
                        }

                        if (result.value !== undefined) {
                            target[key] = result.value;
                        }
                    }
                }
            }

            unprocessedKeys = Object.keys(unprocessed);
        }

        if ((this._inner.children || this._inner.patterns.length) && unprocessedKeys.length) {
            if ((options.stripUnknown && this._flags.allowUnknown !== true) ||
                options.skipFunctions) {

                const stripUnknown = options.stripUnknown
                    ? (options.stripUnknown === true ? true : !!options.stripUnknown.objects)
                    : false;


                for (let i = 0; i < unprocessedKeys.length; ++i) {
                    const key = unprocessedKeys[i];

                    if (stripUnknown) {
                        delete target[key];
                        delete unprocessed[key];
                    }
                    else if (typeof target[key] === 'function') {
                        delete unprocessed[key];
                    }
                }

                unprocessedKeys = Object.keys(unprocessed);
            }

            if (unprocessedKeys.length &&
                (this._flags.allowUnknown !== undefined ? !this._flags.allowUnknown : !options.allowUnknown)) {

                for (let i = 0; i < unprocessedKeys.length; ++i) {
                    const unprocessedKey = unprocessedKeys[i];
                    errors.push(this.createError('object.allowUnknown', { child: unprocessedKey }, { key: unprocessedKey, path: state.path + (state.path ? '.' : '') + unprocessedKey }, options));
                }
            }
        }

        // Validate dependencies

        for (let i = 0; i < this._inner.dependencies.length; ++i) {
            const dep = this._inner.dependencies[i];
            const err = internals[dep.type].call(this, dep.key !== null && target[dep.key], dep.peers, target, { key: dep.key, path: (state.path || '') + (dep.key ? '.' + dep.key : '') }, options);
            if (err instanceof Errors.Err) {
                errors.push(err);
                if (options.abortEarly) {
                    return finish();
                }
            }
        }

        return finish();
    }

    _func() {

        const obj = this.clone();
        obj._flags.func = true;
        return obj;
    }

    keys(schema) {

        Hoek.assert(schema === null || schema === undefined || typeof schema === 'object', 'Object schema must be a valid object');
        Hoek.assert(!schema || !(schema instanceof Any), 'Object schema cannot be a joi schema');

        const obj = this.clone();

        if (!schema) {
            obj._inner.children = null;
            return obj;
        }

        const children = Object.keys(schema);

        if (!children.length) {
            obj._inner.children = [];
            return obj;
        }

        const topo = new Topo();
        if (obj._inner.children) {
            for (let i = 0; i < obj._inner.children.length; ++i) {
                const child = obj._inner.children[i];

                // Only add the key if we are not going to replace it later
                if (children.indexOf(child.key) === -1) {
                    topo.add(child, { after: child._refs, group: child.key });
                }
            }
        }

        for (let i = 0; i < children.length; ++i) {
            const key = children[i];
            const child = schema[key];
            try {
                const cast = Cast.schema(child);
                topo.add({ key, schema: cast }, { after: cast._refs, group: key });
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = key + '.' + castErr.path;
                }
                else {
                    castErr.path = key;
                }
                throw castErr;
            }
        }

        obj._inner.children = topo.nodes;

        return obj;
    }

    unknown(allow) {

        const value = allow !== false;

        if (this._flags.allowUnknown === value) {
            return this;
        }

        const obj = this.clone();
        obj._flags.allowUnknown = value;
        return obj;
    }

    length(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('length', limit, function (value, state, options) {

            if (Object.keys(value).length === limit) {
                return value;
            }

            return this.createError('object.length', { limit }, state, options);
        });
    }

    arity(n) {

        Hoek.assert(Number.isSafeInteger(n) && n >= 0, 'n must be a positive integer');

        return this._test('arity', n, function (value, state, options) {

            if (value.length === n) {
                return value;
            }

            return this.createError('function.arity', { n }, state, options);
        });
    }

    minArity(n) {

        Hoek.assert(Number.isSafeInteger(n) && n > 0, 'n must be a strict positive integer');

        return this._test('minArity', n, function (value, state, options) {

            if (value.length >= n) {
                return value;
            }

            return this.createError('function.minArity', { n }, state, options);
        });
    }

    maxArity(n) {

        Hoek.assert(Number.isSafeInteger(n) && n >= 0, 'n must be a positive integer');

        return this._test('maxArity', n, function (value, state, options) {

            if (value.length <= n) {
                return value;
            }

            return this.createError('function.maxArity', { n }, state, options);
        });
    }

    min(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('min', limit, function (value, state, options) {

            if (Object.keys(value).length >= limit) {
                return value;
            }

            return this.createError('object.min', { limit }, state, options);
        });
    }

    max(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('max', limit, function (value, state, options) {

            if (Object.keys(value).length <= limit) {
                return value;
            }

            return this.createError('object.max', { limit }, state, options);
        });
    }

    pattern(pattern, schema) {

        Hoek.assert(pattern instanceof RegExp, 'Invalid regular expression');
        Hoek.assert(schema !== undefined, 'Invalid rule');

        pattern = new RegExp(pattern.source, pattern.ignoreCase ? 'i' : undefined);         // Future version should break this and forbid unsupported regex flags

        try {
            schema = Cast.schema(schema);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.message = castErr.message + '(' + castErr.path + ')';
            }

            throw castErr;
        }


        const obj = this.clone();
        obj._inner.patterns.push({ regex: pattern, rule: schema });
        return obj;
    }

    schema() {

        return this._test('schema', null, function (value, state, options) {

            if (value instanceof Any) {
                return value;
            }

            return this.createError('object.schema', null, state, options);
        });
    }

    with(key, peers) {

        return this._dependency('with', key, peers);
    }

    without(key, peers) {

        return this._dependency('without', key, peers);
    }

    xor() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('xor', null, peers);
    }

    or() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('or', null, peers);
    }

    and() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('and', null, peers);
    }

    nand() {

        const peers = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this._dependency('nand', null, peers);
    }

    requiredKeys(children) {

        children = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this.applyFunctionToChildren(children, 'required');
    }

    optionalKeys(children) {

        children = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this.applyFunctionToChildren(children, 'optional');
    }

    forbiddenKeys(children) {

        children = Hoek.flatten(Array.prototype.slice.call(arguments));
        return this.applyFunctionToChildren(children, 'forbidden');
    }

    rename(from, to, options) {

        Hoek.assert(typeof from === 'string', 'Rename missing the from argument');
        Hoek.assert(typeof to === 'string', 'Rename missing the to argument');
        Hoek.assert(to !== from, 'Cannot rename key to same name:', from);

        for (let i = 0; i < this._inner.renames.length; ++i) {
            Hoek.assert(this._inner.renames[i].from !== from, 'Cannot rename the same key multiple times');
        }

        const obj = this.clone();

        obj._inner.renames.push({
            from,
            to,
            options: Hoek.applyToDefaults(internals.renameDefaults, options || {})
        });

        return obj;
    }

    applyFunctionToChildren(children, fn, args, root) {

        children = [].concat(children);
        Hoek.assert(children.length > 0, 'expected at least one children');

        const groupedChildren = internals.groupChildren(children);
        let obj;

        if ('' in groupedChildren) {
            obj = this[fn].apply(this, args);
            delete groupedChildren[''];
        }
        else {
            obj = this.clone();
        }

        if (obj._inner.children) {
            root = root ? (root + '.') : '';

            for (let i = 0; i < obj._inner.children.length; ++i) {
                const child = obj._inner.children[i];
                const group = groupedChildren[child.key];

                if (group) {
                    obj._inner.children[i] = {
                        key: child.key,
                        _refs: child._refs,
                        schema: child.schema.applyFunctionToChildren(group, fn, args, root + child.key)
                    };

                    delete groupedChildren[child.key];
                }
            }
        }

        const remaining = Object.keys(groupedChildren);
        Hoek.assert(remaining.length === 0, 'unknown key(s)', remaining.join(', '));

        return obj;
    }

    _dependency(type, key, peers) {

        peers = [].concat(peers);
        for (let i = 0; i < peers.length; ++i) {
            Hoek.assert(typeof peers[i] === 'string', type, 'peers must be a string or array of strings');
        }

        const obj = this.clone();
        obj._inner.dependencies.push({ type, key, peers });
        return obj;
    }

    describe(shallow) {

        const description = Any.prototype.describe.call(this);

        if (description.rules) {
            for (let i = 0; i < description.rules.length; ++i) {
                const rule = description.rules[i];
                // Coverage off for future-proof descriptions, only object().assert() is use right now
                if (/* $lab:coverage:off$ */rule.arg &&
                    typeof rule.arg === 'object' &&
                    rule.arg.schema &&
                    rule.arg.ref /* $lab:coverage:on$ */) {
                    rule.arg = {
                        schema: rule.arg.schema.describe(),
                        ref: rule.arg.ref.toString()
                    };
                }
            }
        }

        if (this._inner.children &&
            !shallow) {

            description.children = {};
            for (let i = 0; i < this._inner.children.length; ++i) {
                const child = this._inner.children[i];
                description.children[child.key] = child.schema.describe();
            }
        }

        if (this._inner.dependencies.length) {
            description.dependencies = Hoek.clone(this._inner.dependencies);
        }

        if (this._inner.patterns.length) {
            description.patterns = [];

            for (let i = 0; i < this._inner.patterns.length; ++i) {
                const pattern = this._inner.patterns[i];
                description.patterns.push({ regex: pattern.regex.toString(), rule: pattern.rule.describe() });
            }
        }

        if (this._inner.renames.length > 0) {
            description.renames = Hoek.clone(this._inner.renames);
        }

        return description;
    }

    assert(ref, schema, message) {

        ref = Cast.ref(ref);
        Hoek.assert(ref.isContext || ref.depth > 1, 'Cannot use assertions for root level references - use direct key rules instead');
        message = message || 'pass the assertion test';

        try {
            schema = Cast.schema(schema);
        }
        catch (castErr) {
            if (castErr.hasOwnProperty('path')) {
                castErr.message = castErr.message + '(' + castErr.path + ')';
            }

            throw castErr;
        }

        const key = ref.path[ref.path.length - 1];
        const path = ref.path.join('.');

        return this._test('assert', { schema, ref }, function (value, state, options) {

            const result = schema._validate(ref(value), null, options, value);
            if (!result.errors) {
                return value;
            }

            const localState = Hoek.merge({}, state);
            localState.key = key;
            localState.path = path;
            return this.createError('object.assert', { ref: localState.path, message }, localState, options);
        });
    }

    type(constructor, name) {

        Hoek.assert(typeof constructor === 'function', 'type must be a constructor function');
        const typeData = {
            name: name || constructor.name,
            ctor: constructor
        };

        return this._test('type', typeData, function (value, state, options) {

            if (value instanceof constructor) {
                return value;
            }

            return this.createError('object.type', { type: typeData.name }, state, options);
        });
    }

    ref() {

        return this._test('ref', null, function (value, state, options) {

            if (Ref.isRef(value)) {
                return value;
            }

            return this.createError('function.ref', null, state, options);
        });
    }
};

internals.safeParse = function (value) {

    try {
        return JSON.parse(value);
    }
    catch (parseErr) {}

    return value;
};


internals.renameDefaults = {
    alias: false,                   // Keep old value in place
    multiple: false,                // Allow renaming multiple keys into the same target
    override: false                 // Overrides an existing key
};


internals.groupChildren = function (children) {

    children.sort();

    const grouped = {};

    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        Hoek.assert(typeof child === 'string', 'children must be strings');
        const group = child.split('.')[0];
        const childGroup = grouped[group] = (grouped[group] || []);
        childGroup.push(child.substring(group.length + 1));
    }

    return grouped;
};


internals.keysToLabels = function (schema, keys) {

    const children = schema._inner.children;

    if (!children) {
        return keys;
    }

    const findLabel = function (key) {

        const matchingChild = children.find((child) => child.key === key);
        return matchingChild ? matchingChild.schema._getLabel(key) : key;
    };

    if (Array.isArray(keys)) {
        return keys.map(findLabel);
    }

    return findLabel(keys);
};


internals.with = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return value;
    }

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            return this.createError('object.with', {
                main: state.key,
                mainWithLabel: internals.keysToLabels(this, state.key),
                peer,
                peerWithLabel: internals.keysToLabels(this, peer)
            }, state, options);
        }
    }

    return value;
};


internals.without = function (value, peers, parent, state, options) {

    if (value === undefined) {
        return value;
    }

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            return this.createError('object.without', {
                main: state.key,
                mainWithLabel: internals.keysToLabels(this, state.key),
                peer,
                peerWithLabel: internals.keysToLabels(this, peer)
            }, state, options);
        }
    }

    return value;
};


internals.xor = function (value, peers, parent, state, options) {

    const present = [];
    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    if (present.length === 1) {
        return value;
    }

    const context = { peers, peersWithLabels: internals.keysToLabels(this, peers) };

    if (present.length === 0) {
        return this.createError('object.missing', context, state, options);
    }

    return this.createError('object.xor', context, state, options);
};


internals.or = function (value, peers, parent, state, options) {

    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {
            return value;
        }
    }

    return this.createError('object.missing', {
        peers,
        peersWithLabels: internals.keysToLabels(this, peers)
    }, state, options);
};


internals.and = function (value, peers, parent, state, options) {

    const missing = [];
    const present = [];
    const count = peers.length;
    for (let i = 0; i < count; ++i) {
        const peer = peers[i];
        if (!Object.prototype.hasOwnProperty.call(parent, peer) ||
            parent[peer] === undefined) {

            missing.push(peer);
        }
        else {
            present.push(peer);
        }
    }

    const aon = (missing.length === count || present.length === count);

    if (!aon) {

        return this.createError('object.and', {
            present,
            presentWithLabels: internals.keysToLabels(this, present),
            missing,
            missingWithLabels: internals.keysToLabels(this, missing)
        }, state, options);
    }
};


internals.nand = function (value, peers, parent, state, options) {

    const present = [];
    for (let i = 0; i < peers.length; ++i) {
        const peer = peers[i];
        if (Object.prototype.hasOwnProperty.call(parent, peer) &&
            parent[peer] !== undefined) {

            present.push(peer);
        }
    }

    const values = Hoek.clone(peers);
    const main = values.splice(0, 1)[0];
    const allPresent = (present.length === peers.length);
    return allPresent ? this.createError('object.nand', {
        main,
        mainWithLabel: internals.keysToLabels(this, main),
        peers: values,
        peersWithLabels: internals.keysToLabels(this, values)
    }, state, options) : null;
};


module.exports = new internals.Object();


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports = module.exports = internals.Topo = function () {

    this._items = [];
    this.nodes = [];
};


internals.Topo.prototype.add = function (nodes, options) {

    options = options || {};

    // Validate rules

    const before = [].concat(options.before || []);
    const after = [].concat(options.after || []);
    const group = options.group || '?';
    const sort = options.sort || 0;                   // Used for merging only

    Hoek.assert(before.indexOf(group) === -1, 'Item cannot come before itself:', group);
    Hoek.assert(before.indexOf('?') === -1, 'Item cannot come before unassociated items');
    Hoek.assert(after.indexOf(group) === -1, 'Item cannot come after itself:', group);
    Hoek.assert(after.indexOf('?') === -1, 'Item cannot come after unassociated items');

    ([].concat(nodes)).forEach((node, i) => {

        const item = {
            seq: this._items.length,
            sort: sort,
            before: before,
            after: after,
            group: group,
            node: node
        };

        this._items.push(item);
    });

    // Insert event

    const error = this._sort();
    Hoek.assert(!error, 'item', (group !== '?' ? 'added into group ' + group : ''), 'created a dependencies error');

    return this.nodes;
};


internals.Topo.prototype.merge = function (others) {

    others = [].concat(others);
    for (let i = 0; i < others.length; ++i) {
        const other = others[i];
        if (other) {
            for (let j = 0; j < other._items.length; ++j) {
                const item = Hoek.shallow(other._items[j]);
                this._items.push(item);
            }
        }
    }

    // Sort items

    this._items.sort(internals.mergeSort);
    for (let i = 0; i < this._items.length; ++i) {
        this._items[i].seq = i;
    }

    const error = this._sort();
    Hoek.assert(!error, 'merge created a dependencies error');

    return this.nodes;
};


internals.mergeSort = function (a, b) {

    return a.sort === b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
};


internals.Topo.prototype._sort = function () {

    // Construct graph

    const graph = {};
    const graphAfters = Object.create(null); // A prototype can bungle lookups w/ false positives
    const groups = Object.create(null);

    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        const seq = item.seq;                         // Unique across all items
        const group = item.group;

        // Determine Groups

        groups[group] = groups[group] || [];
        groups[group].push(seq);

        // Build intermediary graph using 'before'

        graph[seq] = item.before;

        // Build second intermediary graph with 'after'

        const after = item.after;
        for (let j = 0; j < after.length; ++j) {
            graphAfters[after[j]] = (graphAfters[after[j]] || []).concat(seq);
        }
    }

    // Expand intermediary graph

    let graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        const expandedGroups = [];

        const graphNodeItems = Object.keys(graph[node]);
        for (let j = 0; j < graphNodeItems.length; ++j) {
            const group = graph[node][graphNodeItems[j]];
            groups[group] = groups[group] || [];

            for (let k = 0; k < groups[group].length; ++k) {
                expandedGroups.push(groups[group][k]);
            }
        }
        graph[node] = expandedGroups;
    }

    // Merge intermediary graph using graphAfters into final graph

    const afterNodes = Object.keys(graphAfters);
    for (let i = 0; i < afterNodes.length; ++i) {
        const group = afterNodes[i];

        if (groups[group]) {
            for (let j = 0; j < groups[group].length; ++j) {
                const node = groups[group][j];
                graph[node] = graph[node].concat(graphAfters[group]);
            }
        }
    }

    // Compile ancestors

    let children;
    const ancestors = {};
    graphNodes = Object.keys(graph);
    for (let i = 0; i < graphNodes.length; ++i) {
        const node = graphNodes[i];
        children = graph[node];

        for (let j = 0; j < children.length; ++j) {
            ancestors[children[j]] = (ancestors[children[j]] || []).concat(node);
        }
    }

    // Topo sort

    const visited = {};
    const sorted = [];

    for (let i = 0; i < this._items.length; ++i) {
        let next = i;

        if (ancestors[i]) {
            next = null;
            for (let j = 0; j < this._items.length; ++j) {
                if (visited[j] === true) {
                    continue;
                }

                if (!ancestors[j]) {
                    ancestors[j] = [];
                }

                const shouldSeeCount = ancestors[j].length;
                let seenCount = 0;
                for (let k = 0; k < shouldSeeCount; ++k) {
                    if (sorted.indexOf(ancestors[j][k]) >= 0) {
                        ++seenCount;
                    }
                }

                if (seenCount === shouldSeeCount) {
                    next = j;
                    break;
                }
            }
        }

        if (next !== null) {
            next = next.toString();         // Normalize to string TODO: replace with seq
            visited[next] = true;
            sorted.push(next);
        }
    }

    if (sorted.length !== this._items.length) {
        return new Error('Invalid dependencies');
    }

    const seqIndex = {};
    for (let i = 0; i < this._items.length; ++i) {
        const item = this._items[i];
        seqIndex[item.seq] = item;
    }

    const sortedNodes = [];
    this._items = sorted.map((value) => {

        const sortedItem = seqIndex[value];
        sortedNodes.push(sortedItem.node);
        return sortedItem;
    });

    this.nodes = sortedNodes;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Http = __webpack_require__(10);
const Https = __webpack_require__(21);
const Os = __webpack_require__(22);
const Path = __webpack_require__(7);
const Boom = __webpack_require__(1);
const Call = __webpack_require__(75);
const Hoek = __webpack_require__(0);
const Podium = __webpack_require__(9);
const Shot = __webpack_require__(37);
const Statehood = __webpack_require__(80);
const Auth = __webpack_require__(24);
const Compression = __webpack_require__(82);
const Cors = __webpack_require__(13);
const Ext = __webpack_require__(14);
const Route = __webpack_require__(41);


// Declare internals

const internals = {
    counter: {
        min: 10000,
        max: 99999
    }
};


exports = module.exports = internals.Connection = function (server, options) {

    const now = Date.now();

    Podium.call(this, internals.Connection._events);

    this.settings = options;                                                        // options cloned in server.connection()
    this.server = server;

    // Normalize settings

    this.settings.labels = Hoek.unique(this.settings.labels || []);                 // Remove duplicates
    if (this.settings.port === undefined) {
        this.settings.port = 0;
    }

    this.type = (typeof this.settings.port === 'string' ? 'socket' : 'tcp');
    if (this.type === 'socket') {
        this.settings.port = (this.settings.port.indexOf('/') !== -1 ? Path.resolve(this.settings.port) : this.settings.port.toLowerCase());
    }

    if (this.settings.autoListen === undefined) {
        this.settings.autoListen = true;
    }

    Hoek.assert(this.settings.autoListen || !this.settings.port, 'Cannot specify port when autoListen is false');
    Hoek.assert(this.settings.autoListen || !this.settings.address, 'Cannot specify address when autoListen is false');

    // Connection facilities

    this._started = false;
    this._connections = {};
    this._onConnection = null;          // Used to remove event listener on stop
    this.registrations = {};            // Tracks plugin for dependency validation { name -> { version } }

    this._extensions = {
        onRequest: new Ext('onRequest', this.server),
        onPreAuth: new Ext('onPreAuth', this.server),
        onPostAuth: new Ext('onPostAuth', this.server),
        onPreHandler: new Ext('onPreHandler', this.server),
        onPostHandler: new Ext('onPostHandler', this.server),
        onPreResponse: new Ext('onPreResponse', this.server)
    };

    this._requestCounter = { value: internals.counter.min, min: internals.counter.min, max: internals.counter.max };
    this._load = server._heavy.policy(this.settings.load);
    this._compression = new Compression();
    this.states = new Statehood.Definitions(this.settings.state);
    this.auth = new Auth(this);
    this._router = new Call.Router(this.settings.router);
    this._defaultRoutes();

    this.plugins = {};                  // Registered plugin APIs by plugin name
    this.app = {};                      // Place for application-specific state without conflicts with hapi, should not be used by plugins

    // Create listener

    this.listener = this.settings.listener || (this.settings.tls ? Https.createServer(this.settings.tls) : Http.createServer());
    this.listener.on('request', this._dispatch());
    this.listener.on('checkContinue', this._dispatch({ expectContinue: true }));
    this._init();

    this.listener.on('clientError', (err, socket) => {

        this.server._log(['connection', 'client', 'error'], err);
        socket.destroy(err);
    });

    // Connection information

    this.info = {
        created: now,
        started: 0,
        host: this.settings.host || Os.hostname() || 'localhost',
        port: this.settings.port,
        protocol: this.type === 'tcp' ? (this.settings.tls ? 'https' : 'http') : this.type,
        id: Os.hostname() + ':' + process.pid + ':' + now.toString(36)
    };

    this.info.uri = (this.settings.uri || (this.info.protocol + ':' + (this.type === 'tcp' ? '//' + this.info.host + (this.info.port ? ':' + this.info.port : '') : this.info.port)));

    this.on('route', Cors.options);
};

Hoek.inherits(internals.Connection, Podium);


internals.Connection._events = [
    { name: 'route', spread: true },
    { name: 'request-internal', spread: true, tags: true },
    { name: 'request', spread: true, tags: true },
    { name: 'request-error', spread: true },
    'response',
    'tail'
];



internals.Connection.prototype._init = function () {

    // Setup listener

    this.listener.once('listening', () => {

        // Update the address, port, and uri with active values

        if (this.type === 'tcp') {
            const address = this.listener.address();
            this.info.address = address.address;
            this.info.port = address.port;
            this.info.uri = (this.settings.uri || (this.info.protocol + '://' + this.info.host + ':' + this.info.port));
        }

        this._onConnection = (connection) => {

            const key = connection.remoteAddress + ':' + connection.remotePort;
            this._connections[key] = connection;

            connection.once('close', () => {

                delete this._connections[key];
            });
        };

        this.listener.on(this.settings.tls ? 'secureConnection' : 'connection', this._onConnection);
    });
};


internals.Connection.prototype._start = function (callback) {

    if (this._started) {
        return process.nextTick(callback);
    }

    this._started = true;
    this.info.started = Date.now();

    if (!this.settings.autoListen) {
        return process.nextTick(callback);
    }

    const onError = (err) => {

        this._started = false;
        return callback(err);
    };

    this.listener.once('error', onError);

    const finalize = () => {

        this.listener.removeListener('error', onError);
        callback();
    };

    if (this.type !== 'tcp') {
        this.listener.listen(this.settings.port, finalize);
    }
    else {
        const address = this.settings.address || this.settings.host || '0.0.0.0';
        this.listener.listen(this.settings.port, address, finalize);
    }
};


internals.Connection.prototype._stop = function (options, callback) {

    if (!this._started) {
        return process.nextTick(callback);
    }

    this._started = false;
    this.info.started = 0;

    const timeoutId = setTimeout(() => {

        Object.keys(this._connections).forEach((key) => {

            this._connections[key].destroy();
        });


        this._connections = {};
    }, options.timeout);

    this.listener.close(() => {

        this.listener.removeListener(this.settings.tls ? 'secureConnection' : 'connection', this._onConnection);
        clearTimeout(timeoutId);

        this._init();
        return callback();
    });

    // Tell idle keep-alive connections to close

    Object.keys(this._connections).forEach((key) => {

        const connection = this._connections[key];
        if (!connection._isHapiProcessing) {
            connection.end();
        }
    });
};


internals.Connection.prototype._dispatch = function (options) {

    options = options || {};

    return (req, res) => {

        // Track socket request processing state

        if (req.socket) {
            req.socket._isHapiProcessing = true;
            res.on('finish', () => {

                req.socket._isHapiProcessing = false;
                if (!this._started) {
                    req.socket.end();
                }
            });
        }

        // Create request

        const request = this.server._requestor.request(this, req, res, options);

        // Check load

        const overload = this._load.check();
        if (overload) {
            this.server._log(['load'], this.server.load);
            request._reply(overload);
        }
        else {

            // Execute request lifecycle

            request._protect.enter(() => {

                request._execute();
            });
        }
    };
};


internals.Connection.prototype.inject = function (options, callback) {

    if (!callback) {
        return new Promise((resolve, reject) => this.inject(options, (res) => resolve(res)));
    }

    let settings = options;
    if (typeof settings === 'string') {
        settings = { url: settings };
    }

    if (!settings.authority ||
        settings.credentials ||
        settings.app ||
        settings.plugins ||
        settings.allowInternals !== undefined) {        // Can be false

        settings = Hoek.shallow(settings);              // options can be reused
        delete settings.credentials;
        delete settings.artifacts;                      // Cannot appear without credentials
        delete settings.app;
        delete settings.plugins;
        delete settings.allowInternals;

        settings.authority = settings.authority || (this.info.host + ':' + this.info.port);
    }

    const needle = this._dispatch({
        credentials: options.credentials,
        artifacts: options.artifacts,
        allowInternals: options.allowInternals,
        app: options.app,
        plugins: options.plugins
    });

    Shot.inject(needle, settings, (res) => {

        if (res.raw.res._hapi) {
            res.result = res.raw.res._hapi.result;
            res.request = res.raw.res._hapi.request;
            delete res.raw.res._hapi;
        }

        if (res.result === undefined) {
            res.result = res.payload;
        }

        return callback(res);
    });
};


internals.Connection.prototype.table = function (host) {

    return this._router.table(host);
};


internals.Connection.prototype.lookup = function (id) {

    Hoek.assert(id && typeof id === 'string', 'Invalid route id:', id);

    const record = this._router.ids[id];
    if (!record) {
        return null;
    }

    return record.route.public;
};


internals.Connection.prototype.match = function (method, path, host) {

    Hoek.assert(method && typeof method === 'string', 'Invalid method:', method);
    Hoek.assert(path && typeof path === 'string' && path[0] === '/', 'Invalid path:', path);
    Hoek.assert(!host || typeof host === 'string', 'Invalid host:', host);

    const match = this._router.route(method.toLowerCase(), path, host);
    Hoek.assert(match !== this._router.specials.badRequest, 'Invalid path:', path);
    if (match === this._router.specials.notFound) {
        return null;
    }

    return match.route.public;
};


internals.Connection.prototype.decoder = function (encoding, decoder) {

    return this._compression.addDecoder(encoding, decoder);
};


internals.Connection.prototype.encoder = function (encoding, encoder) {

    return this._compression.addEncoder(encoding, encoder);
};


internals.Connection.prototype._ext = function (event) {

    const type = event.type;
    Hoek.assert(this._extensions[type], 'Unknown event type', type);
    this._extensions[type].add(event);
};


internals.Connection.prototype._route = function (configs, plugin) {

    configs = [].concat(configs);
    for (let i = 0; i < configs.length; ++i) {
        const config = configs[i];

        if (Array.isArray(config.method)) {
            for (let j = 0; j < config.method.length; ++j) {
                const method = config.method[j];

                const settings = Hoek.shallow(config);
                settings.method = method;
                this._addRoute(settings, plugin);
            }
        }
        else {
            this._addRoute(config, plugin);
        }
    }
};


internals.Connection.prototype._addRoute = function (config, plugin) {

    const route = new Route(config, this, plugin);                // Do no use config beyond this point, use route members
    const vhosts = [].concat(route.settings.vhost || '*');

    for (let i = 0; i < vhosts.length; ++i) {
        const vhost = vhosts[i];
        const record = this._router.add({ method: route.method, path: route.path, vhost, analysis: route._analysis, id: route.settings.id }, route);
        route.fingerprint = record.fingerprint;
        route.params = record.params;
    }

    this.emit('route', [route.public, this, plugin]);
};


internals.Connection.prototype._defaultRoutes = function () {

    this._router.special('notFound', new Route({ method: '_special', path: '/{p*}', handler: internals.notFound }, this, this.server, { special: true }));
    this._router.special('badRequest', new Route({ method: '_special', path: '/{p*}', handler: internals.badRequest }, this, this.server, { special: true }));

    if (this.settings.routes.cors) {
        Cors.handler(this);
    }
};


internals.notFound = function (request, reply) {

    return reply(Boom.notFound());
};


internals.badRequest = function (request, reply) {

    return reply(Boom.badRequest());
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);
const Request = __webpack_require__(78);
const Response = __webpack_require__(79);


// Declare internals

const internals = {};


internals.options = Joi.object().keys({
    url: Joi.alternatives([
        Joi.string(),
        Joi.object().keys({
            protocol: Joi.string(),
            hostname: Joi.string(),
            port: Joi.any(),
            pathname: Joi.string().required(),
            query: Joi.any()
        })
    ])
        .required(),
    headers: Joi.object(),
    payload: Joi.any(),
    simulate: {
        end: Joi.boolean(),
        split: Joi.boolean(),
        error: Joi.boolean(),
        close: Joi.boolean()
    },
    authority: Joi.string(),
    remoteAddress: Joi.string(),
    method: Joi.string(),
    validate: Joi.boolean()
});


exports.inject = function (dispatchFunc, options, callback) {

    options = (typeof options === 'string' ? { url: options } : options);

    if (options.validate !== false) {                                                           // Defaults to true
        Hoek.assert(typeof dispatchFunc === 'function', 'Invalid dispatch function');
        Joi.assert(options, internals.options);
    }

    const req = new Request(options);
    const res = new Response(req, callback);

    return req.prepare(() => dispatchFunc(req, res));
};


exports.isInjection = function (obj) {

    return (obj instanceof Request || obj instanceof Response);
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(12);
const Boom = __webpack_require__(1);


// Declare internals

const internals = {};


// Generate a cryptographically strong pseudo-random data

exports.randomString = function (size) {

    const buffer = exports.randomBits((size + 1) * 6);
    if (buffer instanceof Error) {
        return buffer;
    }

    const string = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    return string.slice(0, size);
};


// Return a random string of digits

exports.randomDigits = function (size) {

    const buffer = exports.randomBits(size * 8);
    if (buffer instanceof Error) {
        return buffer;
    }

    const digits = [];
    for (let i = 0; i < buffer.length; ++i) {
        digits.push(Math.floor(buffer[i] / 25.6));
    }

    return digits.join('');
};


// Generate a buffer of random bits

exports.randomBits = function (bits) {

    if (!bits ||
        bits < 0) {

        return Boom.internal('Invalid random bits count');
    }

    const bytes = Math.ceil(bits / 8);
    try {
        return Crypto.randomBytes(bytes);
    }
    catch (err) {
        return Boom.internal('Failed generating random bits: ' + err.message);
    }
};


// Compare two strings using fixed time algorithm (to prevent time-based analysis of MAC digest match)

exports.fixedTimeComparison = function (a, b) {

    if (typeof a !== 'string' ||
        typeof b !== 'string') {

        return false;
    }

    let mismatch = (a.length === b.length ? 0 : 1);
    if (mismatch) {
        b = a;
    }

    for (let i = 0; i < a.length; ++i) {
        const ac = a.charCodeAt(i);
        const bc = b.charCodeAt(i);
        mismatch |= (ac ^ bc);
    }

    return (mismatch === 0);
};


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Catbox = __webpack_require__(16);
const Hoek = __webpack_require__(0);
const Subtext = __webpack_require__(88);
const Auth = __webpack_require__(24);
const Cors = __webpack_require__(13);
const Defaults = __webpack_require__(25);
const Ext = __webpack_require__(14);
const Handler = __webpack_require__(98);
const Validation = __webpack_require__(99);
const Schema = __webpack_require__(11);
const Streams = __webpack_require__(46);


// Declare internals

const internals = {};


exports = module.exports = internals.Route = function (route, connection, plugin, options) {

    options = options || {};

    // Apply plugin environment (before schema validation)

    const realm = plugin.realm;
    if (realm.modifiers.route.vhost ||
        realm.modifiers.route.prefix) {

        route = Hoek.cloneWithShallow(route, ['config']);       // config is left unchanged
        route.path = (realm.modifiers.route.prefix ? realm.modifiers.route.prefix + (route.path !== '/' ? route.path : '') : route.path);
        route.vhost = realm.modifiers.route.vhost || route.vhost;
    }

    // Setup and validate route configuration

    Hoek.assert(route.path, 'Route missing path');
    const routeDisplay = route.method + ' ' + route.path;

    let config = route.config;
    if (typeof config === 'function') {
        config = config.call(realm.settings.bind, connection.server);
    }

    Hoek.assert(route.handler || (config && config.handler), 'Missing or undefined handler:', routeDisplay);
    Hoek.assert(!!route.handler ^ !!(config && config.handler), 'Handler must only appear once:', routeDisplay);            // XOR
    Hoek.assert(route.path === '/' || route.path[route.path.length - 1] !== '/' || !connection.settings.router.stripTrailingSlash, 'Path cannot end with a trailing slash when connection configured to strip:', routeDisplay);

    route = Schema.apply('route', route, routeDisplay);

    const handler = route.handler || config.handler;
    const method = route.method.toLowerCase();
    Hoek.assert(method !== 'head', 'Method name not allowed:', routeDisplay);

    // Apply settings in order: {connection} <- {handler} <- {realm} <- {route}

    const handlerDefaults = Handler.defaults(method, handler, connection.server);
    let base = Hoek.applyToDefaultsWithShallow(connection.settings.routes, handlerDefaults, ['bind']);
    base = Hoek.applyToDefaultsWithShallow(base, realm.settings, ['bind']);
    this.settings = Hoek.applyToDefaultsWithShallow(base, config || {}, ['bind', 'validate.headers', 'validate.payload', 'validate.params', 'validate.query']);
    this.settings.handler = handler;
    this.settings = Schema.apply('routeConfig', this.settings, routeDisplay);

    const socketTimeout = (this.settings.timeout.socket === undefined ? 2 * 60 * 1000 : this.settings.timeout.socket);
    Hoek.assert(!this.settings.timeout.server || !socketTimeout || this.settings.timeout.server < socketTimeout, 'Server timeout must be shorter than socket timeout:', routeDisplay);
    Hoek.assert(!this.settings.payload.timeout || !socketTimeout || this.settings.payload.timeout < socketTimeout, 'Payload timeout must be shorter than socket timeout:', routeDisplay);

    this.connection = connection;
    this.server = connection.server;
    this.path = route.path;
    this.method = method;
    this.plugin = plugin;

    this.settings.vhost = route.vhost;
    this.settings.plugins = this.settings.plugins || {};            // Route-specific plugins settings, namespaced using plugin name
    this.settings.app = this.settings.app || {};                    // Route-specific application settings

    // Path parsing

    this._special = !!options.special;
    this._analysis = this.connection._router.analyze(this.path);
    this.params = this._analysis.params;
    this.fingerprint = this._analysis.fingerprint;

    this.public = {
        method: this.method,
        path: this.path,
        vhost: this.vhost,
        realm: this.plugin.realm,
        settings: this.settings,
        fingerprint: this.fingerprint,
        auth: {
            access: (request) => Auth.access(request, this.public)
        }
    };

    // Validation

    const validation = this.settings.validate;
    if (this.method === 'get') {

        // Assert on config, not on merged settings

        Hoek.assert(!config || !config.payload, 'Cannot set payload settings on HEAD or GET request:', routeDisplay);
        Hoek.assert(!config || !config.validate || !config.validate.payload, 'Cannot validate HEAD or GET requests:', routeDisplay);

        validation.payload = null;
    }

    ['headers', 'params', 'query', 'payload'].forEach((type) => {

        validation[type] = Validation.compile(validation[type]);
    });

    if (this.settings.response.schema !== undefined ||
        this.settings.response.status) {

        this.settings.response._validate = true;

        const rule = this.settings.response.schema;
        this.settings.response.status = this.settings.response.status || {};
        const statuses = Object.keys(this.settings.response.status);

        if (rule === true &&
            !statuses.length) {

            this.settings.response._validate = false;
        }
        else {
            this.settings.response.schema = Validation.compile(rule);
            for (let i = 0; i < statuses.length; ++i) {
                const code = statuses[i];
                this.settings.response.status[code] = Validation.compile(this.settings.response.status[code]);
            }
        }
    }

    // Payload parsing

    if (this.method === 'get') {
        this.settings.payload = null;
    }
    else {
        if (this.settings.payload.allow) {
            this.settings.payload.allow = [].concat(this.settings.payload.allow);
        }

        this.settings.payload.decoders = this.connection._compression._decoders;        // Reference the shared object to keep up to date
    }

    Hoek.assert(!this.settings.validate.payload || this.settings.payload.parse, 'Route payload must be set to \'parse\' when payload validation enabled:', routeDisplay);
    Hoek.assert(!this.settings.jsonp || typeof this.settings.jsonp === 'string', 'Bad route JSONP parameter name:', routeDisplay);

    // Authentication configuration

    this.settings.auth = (this._special ? false : this.connection.auth._setupRoute(this.settings.auth, route.path));

    // Cache

    if (this.method === 'get' &&
        typeof this.settings.cache === 'object' &&
        (this.settings.cache.expiresIn || this.settings.cache.expiresAt)) {

        this.settings.cache._statuses = Hoek.mapToObject(this.settings.cache.statuses);
        this._cache = new Catbox.Policy({ expiresIn: this.settings.cache.expiresIn, expiresAt: this.settings.cache.expiresAt });
    }

    // CORS

    this.settings.cors = Cors.route(this.settings.cors);

    // Security

    if (this.settings.security) {
        this.settings.security = Hoek.applyToDefaults(Defaults.security, this.settings.security);

        const security = this.settings.security;
        if (security.hsts) {
            if (security.hsts === true) {
                security._hsts = 'max-age=15768000';
            }
            else if (typeof security.hsts === 'number') {
                security._hsts = 'max-age=' + security.hsts;
            }
            else {
                security._hsts = 'max-age=' + (security.hsts.maxAge || 15768000);
                if (security.hsts.includeSubdomains || security.hsts.includeSubDomains) {
                    security._hsts = security._hsts + '; includeSubDomains';
                }
                if (security.hsts.preload) {
                    security._hsts = security._hsts + '; preload';
                }
            }
        }

        if (security.xframe) {
            if (security.xframe === true) {
                security._xframe = 'DENY';
            }
            else if (typeof security.xframe === 'string') {
                security._xframe = security.xframe.toUpperCase();
            }
            else if (security.xframe.rule === 'allow-from') {
                if (!security.xframe.source) {
                    security._xframe = 'SAMEORIGIN';
                }
                else {
                    security._xframe = 'ALLOW-FROM ' + security.xframe.source;
                }
            }
            else {
                security._xframe = security.xframe.rule.toUpperCase();
            }
        }
    }

    // Handler

    this.settings.handler = Handler.configure(this.settings.handler, this);
    this._prerequisites = Handler.prerequisitesConfig(this.settings.pre, this.server);

    // Route lifecycle

    this._extensions = {
        onPreResponse: this._combineExtensions('onPreResponse')
    };

    if (this._special) {
        this._cycle = [internals.drain, Handler.execute];
        return;
    }

    this._extensions.onPreAuth = this._combineExtensions('onPreAuth');
    this._extensions.onPostAuth = this._combineExtensions('onPostAuth');
    this._extensions.onPreHandler = this._combineExtensions('onPreHandler');
    this._extensions.onPostHandler = this._combineExtensions('onPostHandler');

    this.rebuild();
};


internals.Route.prototype._combineExtensions = function (type, subscribe) {

    const ext = new Ext(type, this.server);

    const events = this.settings.ext[type];
    if (events) {
        for (let i = 0; i < events.length; ++i) {
            const event = Hoek.shallow(events[i]);
            Hoek.assert(!event.options.sandbox, 'Cannot specify sandbox option for route extension');
            event.plugin = this.plugin;
            ext.add(event);
        }
    }

    const connection = this.connection._extensions[type];
    const realm = this.plugin.realm._extensions[type];

    ext.merge([connection, realm]);

    connection.subscribe(this);
    realm.subscribe(this);

    return ext;
};


internals.Route.prototype.rebuild = function (event) {

    if (event) {
        this._extensions[event.type].add(event);
        if (event.type === 'onPreResponse') {
            return;
        }
    }

    // Build lifecycle array

    const cycle = [];

    // 'onRequest'

    if (this.settings.jsonp) {
        cycle.push(internals.parseJSONP);
    }

    if (this.settings.state.parse) {
        cycle.push(internals.state);
    }

    if (this._extensions.onPreAuth.nodes) {
        cycle.push(this._extensions.onPreAuth);
    }

    const authenticate = (this.settings.auth !== false);                          // Anything other than 'false' can still require authentication
    if (authenticate) {
        cycle.push(Auth.authenticate);
    }

    if (this.method !== 'get') {
        cycle.push(internals.payload);

        if (authenticate) {
            cycle.push(Auth.payload);
        }
    }

    if (this._extensions.onPostAuth.nodes) {
        cycle.push(this._extensions.onPostAuth);
    }

    if (this.settings.validate.headers) {
        cycle.push(Validation.headers);
    }

    if (this.settings.validate.params) {
        cycle.push(Validation.params);
    }

    if (this.settings.jsonp) {
        cycle.push(internals.cleanupJSONP);
    }

    if (this.settings.validate.query) {
        cycle.push(Validation.query);
    }

    if (this.settings.validate.payload) {
        cycle.push(Validation.payload);
    }

    if (this._extensions.onPreHandler.nodes) {
        cycle.push(this._extensions.onPreHandler);
    }

    cycle.push(Handler.execute);                                     // Must not call next() with an Error

    if (this._extensions.onPostHandler.nodes) {
        cycle.push(this._extensions.onPostHandler);                 // An error from here on will override any result set in handler()
    }

    if (this.settings.response._validate &&
        this.settings.response.sample !== 0) {

        cycle.push(Validation.response);
    }

    this._cycle = cycle;
};


internals.state = function (request, next) {

    request.state = {};

    const req = request.raw.req;
    const cookies = req.headers.cookie;
    if (!cookies) {
        return next();
    }

    request.connection.states.parse(cookies, (err, state, failed) => {

        request.state = state || {};

        // Clear cookies

        for (let i = 0; i < failed.length; ++i) {
            const item = failed[i];

            if (item.settings.clearInvalid) {
                request._clearState(item.name);
            }
        }

        // failAction: 'error', 'log', 'ignore'

        if (!err ||
            request.route.settings.state.failAction === 'ignore') {

            return next();
        }

        request._log(['state', 'error'], { header: cookies, errors: err.data });
        return next(request.route.settings.state.failAction === 'error' ? err : null);
    });
};


internals.payload = function (request, next) {

    if (request.method === 'get' ||
        request.method === 'head') {            // When route.method is '*'

        return next();
    }

    if (request._expectContinue) {
        request.raw.res.writeContinue();
    }

    const onParsed = (err, parsed) => {

        request.mime = parsed.mime;
        request.payload = (parsed.payload === undefined ? null : parsed.payload);

        if (!err) {
            return next();
        }

        // failAction: 'error', 'log', 'ignore', function (request, reply, error)

        const failAction = request.route.settings.payload.failAction;
        if (failAction === 'ignore') {
            return next();
        }

        request._log(['payload', 'error'], err);

        // Log only

        if (failAction === 'log') {
            return next();
        }

        // Return error

        if (typeof failAction !== 'function') {
            return next(err);
        }

        // Custom handler

        request._protect.run(next, (exit) => {

            const reply = request.server._replier.interface(request, request.route.realm, {}, exit);
            return failAction(request, reply, err);
        });
    };

    Subtext.parse(request.raw.req, request._tap(), request.route.settings.payload, (err, parsed) => {

        if (!err ||
            !request._isPayloadPending) {

            request._isPayloadPending = !!(err || (parsed.payload && parsed.payload._readableState));
            return onParsed(err, parsed);
        }

        // Flush out any pending request payload not consumed due to errors

        Streams.drain(request.raw.req, () => {

            request._isPayloadPending = false;
            return onParsed(err, parsed);
        });
    });
};


internals.drain = function (request, next) {

    return Streams.drain(request.raw.req, () => {

        request._isPayloadPending = false;
        return next();
    });
};


internals.jsonpRegex = /^[\w\$\[\]\.]+$/;


internals.parseJSONP = function (request, next) {

    const jsonp = request.query[request.route.settings.jsonp];
    if (jsonp) {
        if (internals.jsonpRegex.test(jsonp) === false) {
            return next(Boom.badRequest('Invalid JSONP parameter value'));
        }

        request.jsonp = jsonp;
    }

    return next();
};


internals.cleanupJSONP = function (request, next) {

    if (request.jsonp) {
        delete request.query[request.route.settings.jsonp];
    }

    return next();
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);


// Declare internals

const internals = {};


/*
    RFC 7231 Section 3.1.1.1

    media-type = type "/" subtype *( OWS ";" OWS parameter )
    type       = token
    subtype    = token
    parameter  = token "=" ( token / quoted-string )
*/

//                             1: type/subtype                            2: "b"   3: b
internals.contentTypeRegex = /^([^\/]+\/[^\s;]+)(?:(?:\s*;\s*boundary=(?:"([^"]+)"|([^;"]+)))|(?:\s*;\s*[^=]+=(?:(?:"(?:[^"]+)")|(?:[^;"]+))))*$/i;


exports.type = function (header) {

    const match = header.match(internals.contentTypeRegex);
    if (!match) {
        return Boom.badRequest('Invalid content-type header');
    }

    const mime = match[1].toLowerCase();
    const boundary = match[2] || match[3];
    if (mime.indexOf('multipart/') === 0 &&
        !boundary) {

        return Boom.badRequest('Invalid content-type header: multipart missing boundary');
    }

    return { mime, boundary };
};


/*
    RFC 6266 Section 4.1 (http://tools.ietf.org/html/rfc6266#section-4.1)

    content-disposition = "Content-Disposition" ":" disposition-type *( ";" disposition-parm )
    disposition-type    = "inline" | "attachment" | token                                           ; case-insensitive
    disposition-parm    = filename-parm | token [ "*" ] "=" ( token | quoted-string | ext-value)    ; ext-value defined in [RFC5987], Section 3.2

    Content-Disposition header field values with multiple instances of the same parameter name are invalid.

    Note that due to the rules for implied linear whitespace (Section 2.1 of [RFC2616]), OPTIONAL whitespace
    can appear between words (token or quoted-string) and separator characters.

    Furthermore, note that the format used for ext-value allows specifying a natural language (e.g., "en"); this is of limited use
    for filenames and is likely to be ignored by recipients.
*/


internals.contentDispositionRegex = /^\s*form-data\s*(?:;\s*(.+))?$/i;

//                                        1: name   2: *            3: ext-value                    4: quoted  5: token
internals.contentDispositionParamRegex = /([^\=\*]+)(\*)?\s*\=\s*(?:([^;'"]+\'[\w-]*\'[^;\s]+)|(?:\"([^"]*)\")|([^;\s]*))(?:(?:\s*;\s*)|(?:\s*$))/g;

exports.disposition = function (header) {

    if (!header) {
        return Boom.badRequest('Missing content-disposition header');
    }

    const match = header.match(internals.contentDispositionRegex);
    if (!match) {
        return Boom.badRequest('Invalid content-disposition header format');
    }

    const parameters = match[1];
    if (!parameters) {
        return Boom.badRequest('Invalid content-disposition header missing parameters');
    }

    const result = {};
    const leftovers = parameters.replace(internals.contentDispositionParamRegex, ($0, $1, $2, $3, $4, $5) => {

        if ($2) {
            if (!$3) {
                return 'error';         // Generate leftovers
            }

            try {
                result[$1] = decodeURIComponent($3.split('\'')[2]);
            }
            catch (err) {
                return 'error';          // Generate leftover
            }
        }
        else {
            result[$1] = $4 || $5 || '';
        }

        return '';
    });

    if (leftovers) {
        return Boom.badRequest('Invalid content-disposition header format includes invalid parameters');
    }

    if (!result.name) {
        return Boom.badRequest('Invalid content-disposition header missing name parameter');
    }

    return result;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Events = __webpack_require__(95);
const Url = __webpack_require__(23);
const Http = __webpack_require__(10);
const Https = __webpack_require__(21);
const Stream = __webpack_require__(2);
const Hoek = __webpack_require__(0);
const Boom = __webpack_require__(1);
const Payload = __webpack_require__(44);
const Recorder = __webpack_require__(96);
const Tap = __webpack_require__(97);


// Declare internals

const internals = {
    jsonRegex: /^application\/([a-z0-9.]*[+-]json|json)$/,
    shallowOptions: ['agent', 'agents', 'beforeRedirect', 'downstreamRes', 'payload', 'redirected'],
    emitSymbol: Symbol.for('wreck')
};

process[internals.emitSymbol] = process[internals.emitSymbol] || new Events.EventEmitter();


// new instance is exported as module.exports

internals.Client = function (defaults) {

    defaults = defaults || {};
    Hoek.assert(!defaults.agents || (defaults.agents.https && defaults.agents.http && defaults.agents.httpsAllowUnauthorized),
        'defaults.agents must include "http", "https", and "httpsAllowUnauthorized"');

    this._defaults = Hoek.cloneWithShallow(defaults, internals.shallowOptions);

    this.agents = this._defaults.agents || {
        https: new Https.Agent({ maxSockets: Infinity }),
        http: new Http.Agent({ maxSockets: Infinity }),
        httpsAllowUnauthorized: new Https.Agent({ maxSockets: Infinity, rejectUnauthorized: false })
    };

    Events.EventEmitter.call(this);

    // replay request/response events to process[Symbol.for('wreck')]
    const self = this;
    const selfEmit = this.emit;
    this.emit = function () {

        const processEmitter = process[internals.emitSymbol];
        selfEmit.apply(self, arguments);
        processEmitter.emit.apply(processEmitter, arguments);
    };
};

Hoek.inherits(internals.Client, Events.EventEmitter);


internals.Client.prototype.defaults = function (options) {

    Hoek.assert(options && (typeof options === 'object'), 'options must be provided to defaults');

    options = Hoek.applyToDefaultsWithShallow(this._defaults, options, internals.shallowOptions);
    return new internals.Client(options);
};


internals.resolveUrl = function (baseUrl, path) {

    if (!path) {
        return baseUrl;
    }

    const parsedPath = Url.parse(path);
    if (parsedPath.host && parsedPath.protocol) {
        return Url.format(parsedPath);
    }

    const parsedBase = Url.parse(baseUrl);
    parsedBase.pathname = parsedBase.pathname + parsedPath.pathname;
    parsedBase.pathname = parsedBase.pathname.replace(/[/]{2,}/g, '/');
    parsedBase.search = parsedPath.search;      // Always use the querystring from the path argument

    return Url.format(parsedBase);
};


internals.Client.prototype.request = function (method, url, options, callback, _trace) {

    options = Hoek.applyToDefaultsWithShallow(this._defaults, options || {}, internals.shallowOptions);

    Hoek.assert(options.payload === undefined || typeof options.payload === 'string' || typeof options.payload === 'object',
        'options.payload must be a string, a Buffer, a Stream, or an Object');

    Hoek.assert((options.agent === undefined || options.agent === null) || (typeof options.rejectUnauthorized !== 'boolean'),
        'options.agent cannot be set to an Agent at the same time as options.rejectUnauthorized is set');

    Hoek.assert(options.beforeRedirect === undefined || options.beforeRedirect === null || typeof options.beforeRedirect === 'function',
        'options.beforeRedirect must be a function');

    Hoek.assert(options.redirected === undefined || options.redirected === null || typeof options.redirected === 'function',
        'options.redirected must be a function');

    options.beforeRedirect = options.beforeRedirect || ((redirectMethod, statusCode, location, resHeaders, redirectOptions, next) => next());

    if (options.baseUrl) {
        url = internals.resolveUrl(options.baseUrl, url);
        delete options.baseUrl;
    }

    const uri = Url.parse(url);

    if (options.socketPath) {
        uri.socketPath = options.socketPath;
        delete options.socketPath;
    }

    uri.method = method.toUpperCase();
    uri.headers = options.headers || {};
    const hasContentLength = internals.findHeader('content-length', uri.headers) !== undefined;

    if (options.payload && typeof options.payload === 'object' && !(options.payload instanceof Stream) && !Buffer.isBuffer(options.payload)) {
        options.payload = JSON.stringify(options.payload);
        if (!internals.findHeader('content-type', uri.headers)) {
            uri.headers['content-type'] = 'application/json';
        }
    }

    const payloadSupported = (uri.method !== 'GET' && uri.method !== 'HEAD' && options.payload !== null && options.payload !== undefined);
    if (payloadSupported &&
        (typeof options.payload === 'string' || Buffer.isBuffer(options.payload)) &&
        (!hasContentLength)) {

        uri.headers = Hoek.clone(uri.headers);
        uri.headers['content-length'] = Buffer.isBuffer(options.payload) ? options.payload.length : Buffer.byteLength(options.payload);
    }

    let redirects = (options.hasOwnProperty('redirects') ? options.redirects : false);      // Needed to allow 0 as valid value when passed recursively

    _trace = (_trace || []);
    _trace.push({ method: uri.method, url });

    const client = (uri.protocol === 'https:' ? Https : Http);

    if (options.rejectUnauthorized !== undefined && uri.protocol === 'https:') {
        uri.agent = options.rejectUnauthorized ? this.agents.https : this.agents.httpsAllowUnauthorized;
    }
    else if (options.agent || options.agent === false) {
        uri.agent = options.agent;
    }
    else {
        uri.agent = uri.protocol === 'https:' ? this.agents.https : this.agents.http;
    }

    if (options.secureProtocol !== undefined) {
        uri.secureProtocol = options.secureProtocol;
    }

    this.emit('request', uri, options);

    const start = Date.now();
    const req = client.request(uri);

    let shadow = null;                                                                      // A copy of the streamed request payload when redirects are enabled
    let timeoutId;

    const onError = (err) => {

        err.trace = _trace;
        return finishOnce(Boom.badGateway('Client request error', err));
    };
    req.once('error', onError);

    const onResponse = (res) => {

        // Pass-through response

        const statusCode = res.statusCode;
        const redirectMethod = internals.redirectMethod(statusCode, uri.method, options);

        if (redirects === false ||
            !redirectMethod) {

            return finishOnce(null, res);
        }

        // Redirection

        res.destroy();

        if (redirects === 0) {
            return finishOnce(Boom.badGateway('Maximum redirections reached', _trace));
        }

        let location = res.headers.location;
        if (!location) {
            return finishOnce(Boom.badGateway('Received redirection without location', _trace));
        }

        if (!/^https?:/i.test(location)) {
            location = Url.resolve(uri.href, location);
        }

        const redirectOptions = Hoek.cloneWithShallow(options, internals.shallowOptions);
        redirectOptions.payload = shadow || options.payload;                                    // shadow must be ready at this point if set
        redirectOptions.redirects = --redirects;

        return options.beforeRedirect(redirectMethod, statusCode, location, res.headers, redirectOptions, () => {

            const redirectReq = this.request(redirectMethod, location, redirectOptions, finishOnce, _trace);

            if (options.redirected) {
                options.redirected(statusCode, location, redirectReq);
            }
        });
    };

    // Register handlers

    const finish = (err, res) => {

        if (err) {
            req.abort();
        }

        req.removeListener('response', onResponse);
        req.removeListener('error', onError);
        req.on('error', Hoek.ignore);
        clearTimeout(timeoutId);
        this.emit('response', err, { req, res, start, uri });

        if (callback) {
            return callback(err, res);
        }
    };

    const finishOnce = Hoek.once(finish);

    req.once('response', onResponse);

    if (options.timeout) {
        timeoutId = setTimeout(() => {

            return finishOnce(Boom.gatewayTimeout('Client request timeout'));
        }, options.timeout);
        delete options.timeout;
    }

    // Custom abort method to detect early aborts

    const _abort = req.abort;
    let aborted = false;
    req.abort = () => {

        if (!aborted && !req.res && !req.socket) {
            process.nextTick(() => {

                // Fake an ECONNRESET error

                const error = new Error('socket hang up');
                error.code = 'ECONNRESET';
                finishOnce(error);
            });
        }

        aborted = true;
        return _abort.call(req);
    };

    // Write payload

    if (payloadSupported) {
        if (options.payload instanceof Stream) {
            let stream = options.payload;

            if (redirects) {
                const collector = new Tap();
                collector.once('finish', () => {

                    shadow = collector.collect();
                });

                stream = options.payload.pipe(collector);
            }

            stream.pipe(req);
            return req;
        }

        req.write(options.payload);
    }

    // Finalize request

    req.end();

    return req;
};


internals.redirectMethod = function (code, method, options) {

    switch (code) {
        case 301:
        case 302:
            return method;

        case 303:
            if (options.redirect303) {
                return 'GET';
            }
            break;

        case 307:
        case 308:
            return method;
    }

    return null;
};


// read()

internals.Client.prototype.read = function (res, options, callback) {

    options = Hoek.applyToDefaultsWithShallow(this._defaults, options || {}, internals.shallowOptions);

    // Set stream timeout

    const clientTimeout = options.timeout;
    let clientTimeoutId = null;

    // Finish once

    const finish = (err, buffer) => {

        clearTimeout(clientTimeoutId);
        reader.removeListener('error', onReaderError);
        reader.removeListener('finish', onReaderFinish);
        res.removeListener('error', onResError);
        res.removeListener('close', onResClose);
        res.on('error', Hoek.ignore);

        if (err ||
            !options.json) {

            return callback(err, buffer);
        }

        // Parse JSON

        let result;
        if (buffer.length === 0) {
            return callback(null, null);
        }

        if (options.json === 'force') {
            result = internals.tryParseBuffer(buffer);
            return callback(result.err, result.json);
        }

        // mode is "smart" or true

        const contentType = (res.headers && internals.findHeader('content-type', res.headers)) || '';
        const mime = contentType.split(';')[0].trim().toLowerCase();

        if (!internals.jsonRegex.test(mime)) {
            return callback(null, buffer);
        }

        result = internals.tryParseBuffer(buffer);
        return callback(result.err, result.json);
    };

    const finishOnce = Hoek.once(finish);

    if (clientTimeout &&
        clientTimeout > 0) {

        clientTimeoutId = setTimeout(() => {

            finishOnce(Boom.clientTimeout());
        }, clientTimeout);
    }

    // Hander errors

    const onResError = (err) => {

        return finishOnce(Boom.internal('Payload stream error', err));
    };

    const onResClose = () => {

        return finishOnce(Boom.internal('Payload stream closed prematurely'));
    };

    res.once('error', onResError);
    res.once('close', onResClose);

    // Read payload

    const reader = new Recorder({ maxBytes: options.maxBytes });

    const onReaderError = (err) => {

        if (res.destroy) {                          // GZip stream has no destroy() method
            res.destroy();
        }

        return finishOnce(err);
    };

    reader.once('error', onReaderError);

    const onReaderFinish = () => {

        return finishOnce(null, reader.collect());
    };

    reader.once('finish', onReaderFinish);

    res.pipe(reader);
};


// toReadableStream()

internals.Client.prototype.toReadableStream = function (payload, encoding) {

    return new Payload(payload, encoding);
};


// parseCacheControl()

internals.Client.prototype.parseCacheControl = function (field) {

    /*
        Cache-Control   = 1#cache-directive
        cache-directive = token [ "=" ( token / quoted-string ) ]
        token           = [^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+
        quoted-string   = "(?:[^"\\]|\\.)*"
    */

    //                             1: directive                                        =   2: token                                              3: quoted-string
    const regex = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;

    const header = {};
    const error = field.replace(regex, ($0, $1, $2, $3) => {

        const value = $2 || $3;
        header[$1] = value ? value.toLowerCase() : true;
        return '';
    });

    if (header['max-age']) {
        try {
            const maxAge = parseInt(header['max-age'], 10);
            if (isNaN(maxAge)) {
                return null;
            }

            header['max-age'] = maxAge;
        }
        catch (err) { }
    }

    return (error ? null : header);
};


// Shortcuts

internals.Client.prototype.get = function (uri, options, callback) {

    return this._shortcutWrap('GET', uri, options, callback);
};


internals.Client.prototype.post = function (uri, options, callback) {

    return this._shortcutWrap('POST', uri, options, callback);
};


internals.Client.prototype.patch = function (uri, options, callback) {

    return this._shortcutWrap('PATCH', uri, options, callback);
};


internals.Client.prototype.put = function (uri, options, callback) {

    return this._shortcutWrap('PUT', uri, options, callback);
};


internals.Client.prototype.delete = function (uri, options, callback) {

    return this._shortcutWrap('DELETE', uri, options, callback);
};


// Wrapper so that shortcut can be optimized with required params

internals.Client.prototype._shortcutWrap = function (method, uri /* [options], callback */) {

    const options = (typeof arguments[2] === 'function' ? {} : arguments[2]);
    const callback = (typeof arguments[2] === 'function' ? arguments[2] : arguments[3]);

    return this._shortcut(method, uri, options, callback);
};


internals.Client.prototype._shortcut = function (method, uri, options, callback) {

    return this.request(method, uri, options, (err, res) => {

        if (err) {
            return callback(err);
        }

        this.read(res, options, (err, payload) => {

            if (!err && res.statusCode >= 400) {
                return callback(Boom.create(res.statusCode, new Error(`Response Error: ${res.statusCode} ${res.statusMessage}`), {
                    isResponseError: true,
                    headers: res.headers,
                    response: res,
                    payload
                }));
            }

            return callback(err, res, payload);
        });
    });
};


internals.tryParseBuffer = function (buffer) {

    const result = {
        json: null,
        err: null
    };
    try {
        const json = JSON.parse(buffer.toString());
        result.json = json;
    }
    catch (err) {
        result.err = err;
    }
    return result;
};

internals.findHeader = function (headerName, headers) {

    const foundKey = Object.keys(headers)
        .find((key) => key.toLowerCase() === headerName.toLowerCase());

    return foundKey && headers[foundKey];
};


module.exports = new internals.Client();


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Stream = __webpack_require__(2);


// Declare internals

const internals = {};


module.exports = internals.Payload = function (payload, encoding) {

    Stream.Readable.call(this);

    const data = [].concat(payload || '');
    let size = 0;
    for (let i = 0; i < data.length; ++i) {
        const chunk = data[i];
        size = size + chunk.length;
        data[i] = Buffer.isBuffer(chunk) ? chunk : new Buffer(chunk);
    }

    this._data = Buffer.concat(data, size);
    this._position = 0;
    this._encoding = encoding || 'utf8';
};

Hoek.inherits(internals.Payload, Stream.Readable);


internals.Payload.prototype._read = function (size) {

    const chunk = this._data.slice(this._position, this._position + size);
    this.push(chunk, this._encoding);
    this._position = this._position + chunk.length;

    if (this._position >= this._data.length) {
        this.push(null);
    }
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Schema = __webpack_require__(11);


// Declare internals

const internals = {};


exports = module.exports = internals.Methods = function (server) {

    this.server = server;
    this.methods = {};
    this._normalized = {};
};


internals.Methods.prototype.add = function (name, method, options, realm) {

    if (typeof name !== 'object') {
        return this._add(name, method, options, realm);
    }

    // {} or [{}, {}]

    const items = [].concat(name);
    for (let i = 0; i < items.length; ++i) {
        const item = Schema.apply('methodObject', items[i]);
        this._add(item.name, item.method, item.options, realm);
    }
};


exports.methodNameRx = /^[_$a-zA-Z][$\w]*(?:\.[_$a-zA-Z][$\w]*)*$/;


internals.Methods.prototype._add = function (name, method, options, realm) {

    Hoek.assert(typeof method === 'function', 'method must be a function');
    Hoek.assert(typeof name === 'string', 'name must be a string');
    Hoek.assert(name.match(exports.methodNameRx), 'Invalid name:', name);
    Hoek.assert(!Hoek.reach(this.methods, name, { functions: false }), 'Server method function name already exists:', name);

    options = Schema.apply('method', options || {}, name);

    const settings = Hoek.cloneWithShallow(options, ['bind']);
    settings.generateKey = settings.generateKey || internals.generateKey;
    const bind = settings.bind || realm.settings.bind || null;

    const apply = function () {

        return method.apply(bind, arguments);
    };

    const bound = bind ? apply : method;

    // Normalize methods

    let normalized = bound;
    if (settings.callback === false) {                                          // Defaults to true
        normalized = function (/* arg1, arg2, ..., argn, methodNext */) {

            const args = [];
            for (let i = 0; i < arguments.length - 1; ++i) {
                args.push(arguments[i]);
            }

            const methodNext = arguments[arguments.length - 1];

            let result = null;
            let error = null;

            try {
                result = method.apply(bind, args);
            }
            catch (err) {
                error = err;
            }

            if (result instanceof Error) {
                error = result;
                result = null;
            }

            if (error ||
                typeof result !== 'object' ||
                typeof result.then !== 'function') {

                return methodNext(error, result);
            }

            // Promise object

            const onFulfilled = (outcome) => methodNext(null, outcome);
            const onRejected = (err) => methodNext(err);
            result.then(onFulfilled, onRejected);
        };
    }

    // Not cached

    if (!settings.cache) {
        return this._assign(name, bound, normalized);
    }

    // Cached

    Hoek.assert(!settings.cache.generateFunc, 'Cannot set generateFunc with method caching:', name);
    Hoek.assert(settings.cache.generateTimeout !== undefined, 'Method caching requires a timeout value in generateTimeout:', name);

    settings.cache.generateFunc = (id, next) => {

        id.args.push(next);                     // function (err, result, ttl)
        normalized.apply(bind, id.args);
    };

    const cache = this.server.cache(settings.cache, '#' + name);

    const func = function (/* arguments, methodNext */) {

        const args = [];
        for (let i = 0; i < arguments.length - 1; ++i) {
            args.push(arguments[i]);
        }

        const methodNext = arguments[arguments.length - 1];

        const key = settings.generateKey.apply(bind, args);
        if (key === null ||                                 // Value can be ''
            typeof key !== 'string') {                      // When using custom generateKey

            return Hoek.nextTick(methodNext)(Boom.badImplementation('Invalid method key when invoking: ' + name, { name, args }));
        }

        cache.get({ id: key, args }, methodNext);
    };

    func.cache = {
        drop: function (/* arguments, callback */) {

            const args = [];
            for (let i = 0; i < arguments.length - 1; ++i) {
                args.push(arguments[i]);
            }

            const methodNext = arguments[arguments.length - 1];

            const key = settings.generateKey.apply(null, args);
            if (key === null) {                             // Value can be ''
                return Hoek.nextTick(methodNext)(Boom.badImplementation('Invalid method key'));
            }

            return cache.drop(key, methodNext);
        },
        stats: cache.stats
    };

    this._assign(name, func, func);
};


internals.Methods.prototype._assign = function (name, method, normalized) {

    const path = name.split('.');
    let ref = this.methods;
    for (let i = 0; i < path.length; ++i) {
        if (!ref[path[i]]) {
            ref[path[i]] = (i + 1 === path.length ? method : {});
        }

        ref = ref[path[i]];
    }

    this._normalized[name] = normalized;
};


internals.generateKey = function () {

    let key = '';
    for (let i = 0; i < arguments.length; ++i) {
        const arg = arguments[i];
        if (typeof arg !== 'string' &&
            typeof arg !== 'number' &&
            typeof arg !== 'boolean') {

            return null;
        }

        key = key + (i ? ':' : '') + encodeURIComponent(arg.toString());
    }

    return key;
};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.drain = function (stream, callback) {

    const read = () => stream.read();
    const end = () => {

        stream.removeListener('readable', read);
        stream.removeListener('error', end);
        stream.removeListener('end', end);

        if (callback) {
            return callback();
        }
    };

    stream.on('readable', read);
    stream.once('error', end);
    stream.once('end', end);
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(2);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports.header = function (header, length) {

    // Parse header

    const parts = header.split('=');
    if (parts.length !== 2 ||
        parts[0] !== 'bytes') {

        return null;
    }

    const lastPos = length - 1;

    const result = [];
    const ranges = parts[1].match(/\d*\-\d*/g);

    // Handle headers with multiple ranges

    for (let i = 0; i < ranges.length; ++i) {
        let range = ranges[i];
        if (range.length === 1) {               // '-'
            return null;
        }

        const set = {};
        range = range.split('-');
        if (range[0]) {
            set.from = parseInt(range[0], 10);
        }

        if (range[1]) {
            set.to = parseInt(range[1], 10);
            if (set.from !== undefined) {      // Can be 0
                // From-To
                if (set.to > lastPos) {
                    set.to = lastPos;
                }
            }
            else {
                // -To
                set.from = length - set.to;
                set.to = lastPos;
            }
        }
        else {
            // From-
            set.to = lastPos;
        }

        if (set.from > set.to) {
            return null;
        }

        result.push(set);
    }

    if (result.length === 1) {
        return result;
    }

    // Sort and consolidate ranges

    result.sort((a, b) => a.from - b.from);

    const consolidated = [];
    for (let i = result.length - 1; i > 0; --i) {
        const current = result[i];
        const before = result[i - 1];
        if (current.from <= before.to + 1) {
            before.to = current.to;
        }
        else {
            consolidated.unshift(current);
        }
    }

    consolidated.unshift(result[0]);

    return consolidated;
};


exports.Stream = internals.Stream = function (range) {

    Stream.Transform.call(this);

    this._range = range;
    this._next = 0;
};

Hoek.inherits(internals.Stream, Stream.Transform);


internals.Stream.prototype._transform = function (chunk, encoding, done) {

    // Read desired range from a stream

    const pos = this._next;
    this._next = this._next + chunk.length;

    if (this._next <= this._range.from ||       // Before range
        pos > this._range.to) {                 // After range

        return done();
    }

    // Calc bounds of chunk to read

    const from = Math.max(0, this._range.from - pos);
    const to = Math.min(chunk.length, this._range.to - pos + 1);

    this.push(chunk.slice(from, to));
    return done();
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Path = __webpack_require__(7);
const Ammo = __webpack_require__(47);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);
const Etag = __webpack_require__(49);
const Fs = __webpack_require__(116);


// Declare internals

const internals = {};


internals.defaultMap = {
    gzip: '.gz'
};


internals.schema = Joi.alternatives([
    Joi.string(),
    Joi.func(),
    Joi.object({
        path: Joi.alternatives(Joi.string(), Joi.func()).required(),
        confine: Joi.alternatives(Joi.string(), Joi.boolean()).default(true),
        filename: Joi.string(),
        mode: Joi.string().valid('attachment', 'inline').allow(false),
        lookupCompressed: Joi.boolean(),
        lookupMap: Joi.object().min(1).pattern(/.+/, Joi.string()),
        etagMethod: Joi.string().valid('hash', 'simple').allow(false),
        start: Joi.number().integer().min(0).default(0),
        end: Joi.number().integer().min(Joi.ref('start'))
    })
        .with('filename', 'mode')
]);


exports.handler = function (route, options) {

    let settings = Joi.attempt(options, internals.schema, 'Invalid file handler options (' + route.path + ')');
    settings = (typeof options !== 'object' ? { path: options, confine: '.' } : settings);
    settings.confine = settings.confine === true ? '.' : settings.confine;
    Hoek.assert(typeof settings.path !== 'string' || settings.path[settings.path.length - 1] !== '/', 'File path cannot end with a \'/\':', route.path);

    const handler = (request, reply) => {

        const path = (typeof settings.path === 'function' ? settings.path(request) : settings.path);
        return reply(exports.response(path, settings, request));
    };

    return handler;
};


exports.load = function (path, request, options, callback) {

    const response = exports.response(path, options, request, true);
    return internals.prepare(response, callback);
};


exports.response = function (path, options, request, _preloaded) {

    Hoek.assert(!options.mode || ['attachment', 'inline'].indexOf(options.mode) !== -1, 'options.mode must be either false, attachment, or inline');

    if (options.confine) {
        const confineDir = Path.resolve(request.route.settings.files.relativeTo, options.confine);
        path = Path.isAbsolute(path) ? Path.normalize(path) : Path.join(confineDir, path);

        // Verify that resolved path is within confineDir
        if (path.lastIndexOf(confineDir, 0) !== 0) {
            path = null;
        }
    }
    else {
        path = Path.isAbsolute(path) ? Path.normalize(path) : Path.join(request.route.settings.files.relativeTo, path);
    }

    const source = {
        path,
        settings: options,
        stat: null,
        file: null
    };

    const prepare = _preloaded ? null : internals.prepare;

    return request.generateResponse(source, { variety: 'file', marshal: internals.marshal, prepare, close: internals.close });
};


internals.prepare = function (response, callback) {

    const path = response.source.path;

    if (path === null) {
        return process.nextTick(() => {

            return callback(Boom.forbidden(null, 'EACCES'));
        });
    }

    const file = response.source.file = new Fs.File(path);

    file.openStat('r', (err, stat) => {

        if (err) {
            return callback(err);
        }

        const start = response.source.settings.start || 0;
        if (response.source.settings.end !== undefined) {
            response.bytes(response.source.settings.end - start + 1);
        }
        else {
            response.bytes(stat.size - start);
        }

        if (!response.headers['content-type']) {
            response.type(response.request.server.mime.path(path).type || 'application/octet-stream');
        }

        response.header('last-modified', stat.mtime.toUTCString());

        if (response.source.settings.mode) {
            const fileName = response.source.settings.filename || Path.basename(path);
            response.header('content-disposition', response.source.settings.mode + '; filename=' + encodeURIComponent(fileName));
        }

        Etag.apply(response, stat, (err) => {

            if (err) {
                internals.close(response);
                return callback(err);
            }

            return callback(response);
        });
    });
};


internals.marshal = function (response, next) {

    if (response.source.settings.lookupCompressed &&
        !response.source.settings.start &&
        response.source.settings.end === undefined &&
        response.request.connection.settings.compression) {

        const lookupMap = response.source.settings.lookupMap || internals.defaultMap;
        const encoding = response.request.info.acceptEncoding;
        const extension = lookupMap.hasOwnProperty(encoding) ? lookupMap[encoding] : null;
        if (extension) {
            const gzFile = new Fs.File(`${response.source.path}${extension}`);
            return gzFile.openStat('r', (err, stat) => {

                if (!err) {
                    response.source.file.close();
                    response.source.file = gzFile;

                    response.bytes(stat.size);
                    response.header('content-encoding', encoding);
                    response.vary('accept-encoding');
                }

                return internals.createStream(response, next);
            });
        }
    }

    return internals.createStream(response, next);
};


internals.addContentRange = function (response, next) {

    const request = response.request;
    const length = response.headers['content-length'];
    let range = null;

    if (Hoek.reach(request.route.settings, 'response.ranges') !== false) {     // Backwards compatible comparison
        if (request.headers.range && length) {

            // Check If-Range

            if (!request.headers['if-range'] ||
                request.headers['if-range'] === response.headers.etag) {            // Ignoring last-modified date (weak)

                // Check that response is not encoded once transmitted

                const mime = request.server.mime.type(response.headers['content-type'] || 'application/octet-stream');
                const encoding = (request.connection.settings.compression && mime.compressible && !response.headers['content-encoding'] ? request.info.acceptEncoding : null);

                if (encoding === 'identity' || !encoding) {

                    // Parse header

                    const ranges = Ammo.header(request.headers.range, length);
                    if (!ranges) {
                        const error = Boom.rangeNotSatisfiable();
                        error.output.headers['content-range'] = 'bytes */' + length;
                        return next(error);
                    }

                    // Prepare transform

                    if (ranges.length === 1) {                                          // Ignore requests for multiple ranges
                        range = ranges[0];
                        response.code(206);
                        response.bytes(range.to - range.from + 1);
                        response.header('content-range', 'bytes ' + range.from + '-' + range.to + '/' + length);
                    }
                }
            }
        }

        response.header('accept-ranges', 'bytes');
    }

    return next(null, range);
};


internals.createStream = function (response, next) {

    const source = response.source;

    Hoek.assert(source.file !== null);

    internals.addContentRange(response, (err, range) => {

        if (err) {
            return next(err);
        }

        const options = {
            start: source.settings.start || 0,
            end: source.settings.end
        };

        if (range) {
            options.end = range.to + options.start;
            options.start = range.from + options.start;
        }

        return next(null, source.file.createReadStream(options));
    });
};


internals.close = function (response) {

    if (response.source.file !== null) {
        response.source.file.close();
        response.source.file = null;
    }
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(12);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const LruCache = __webpack_require__(112);


// Declare internals

const internals = {
    pendings: Object.create(null)
};


internals.computeHashed = function (response, stat, next) {

    const etags = response.request.server.plugins.inert._etags;
    if (!etags) {
        return next(null, null);
    }

    // Use stat info for an LRU cache key.

    const path = response.source.path;
    const cachekey = [path, stat.ino, stat.size, stat.mtime.getTime()].join('-');

    // The etag hashes the file contents in order to be consistent across distributed deployments

    const cachedEtag = etags.get(cachekey);
    if (cachedEtag) {
        return next(null, cachedEtag);
    }

    let nexts = internals.pendings[cachekey];
    if (nexts) {
        return nexts.push(next);
    }

    // Start hashing

    nexts = [next];
    internals.pendings[cachekey] = nexts;

    internals.hashFile(response, (err, hash) => {

        if (!err) {
            etags.set(cachekey, hash);
        }

        // Call pending callbacks

        delete internals.pendings[cachekey];
        for (let i = 0; i < nexts.length; ++i) {
            Hoek.nextTick(nexts[i])(err, hash);
        }
    });
};


internals.hashFile = function (response, callback) {

    const hash = Crypto.createHash('sha1');
    hash.setEncoding('hex');

    const fileStream = response.source.file.createReadStream({ autoClose: false });
    fileStream.pipe(hash);

    let done = function (err) {

        if (err) {
            return callback(Boom.boomify(err, { message: 'Failed to hash file' }));
        }

        return callback(null, hash.read());
    };

    done = Hoek.once(done);

    fileStream.on('end', done);
    fileStream.on('error', done);
};


internals.computeSimple = function (response, stat, next) {

    const size = stat.size.toString(16);
    const mtime = stat.mtime.getTime().toString(16);

    return next(null, size + '-' + mtime);
};


exports.apply = function (response, stat, next) {

    const etagMethod = response.source.settings.etagMethod;
    if (etagMethod === false) {
        return next();
    }

    const applyEtag = (err, etag) => {

        if (err) {
            return next(err);
        }

        if (etag !== null) {
            response.etag(etag, { vary: true });
        }

        return next();
    };

    if (etagMethod === 'simple') {
        return internals.computeSimple(response, stat, applyEtag);
    }

    return internals.computeHashed(response, stat, applyEtag);
};


exports.Cache = LruCache;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const { config, start } = __webpack_require__(51)
const serverConfig = __webpack_require__(120)

const services = {
}

config(serverConfig({ services }))

start()

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(28)
const { start } = __webpack_require__(52)
 
module.exports = {
    name: "mk-server",
    version: "",
    description: "",
    author: "lsg",
    config,
    start, 
}


//未处理的异常
process.on('uncaughtException', function (err) {
    console.error('An uncaught error occurred!' + err.message);
    console.error(err.stack);
});


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const start = __webpack_require__(53) 

module.exports = {
    start, 
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const Hapi = __webpack_require__(54);
const options = __webpack_require__(28).current;
const apiRouter = __webpack_require__(107);
const webRouter = __webpack_require__(109);

function start(cb) {

    let { host, port, website, apiRootUrl, services, interceptors } = options;

    if (services && services._delayStart === true) {
        services._start = start
        return
    }
    //创建Web服务进程
    var webServer = new Hapi.Server();
    webServer.connection({
        host,
        port,
        state: {
            strictHeader: false, //不验证cookie
        },
    });


    let { dir, proxy } = webRouter(website);

    //静态文件  // https://github.com/hapijs/inert
    if (dir && dir.length) {
        dir.forEach(i => console.log("website path: " + i.path + " \t=>\t " + i.handler.directory.path))
        webServer.register(__webpack_require__(110), (err) => {
            if (err) {
                throw err;
            }
            webServer.route(dir);
        });
    }

    //反向代理  // https://github.com/lishengguo/h2o2
    if (proxy && proxy.length) {
        proxy.forEach(i => console.log("proxy path: " + i.path + " \t=>\t " + i.handler.proxy.uri))
        webServer.register(__webpack_require__(118), (err) => {
            if (err) {
                throw err;
            }
            webServer.route(proxy);
        });
    }


    //绑定本地API的URL路径
    let routes = apiRouter(apiRootUrl, services, interceptors);

    //设置api的url
    webServer.route(routes);

    //启用web服务
    webServer.start((err) => {
        if (cb) {
            cb(err, webServer)
        }
        else if (err) {
            throw err;
        }
        console.log('Server running at:', webServer.info.uri + "    \t" + JSON.stringify(new Date()));
    });
}

module.exports = start;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Server = __webpack_require__(55);


// Declare internals

const internals = {};


exports.Server = Server;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Catbox = __webpack_require__(16);
const CatboxMemory = __webpack_require__(70);
const Heavy = __webpack_require__(71);
const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Mimos = __webpack_require__(72);
const Podium = __webpack_require__(9);
const Connection = __webpack_require__(36);
const Defaults = __webpack_require__(25);
const Ext = __webpack_require__(14);
const Methods = __webpack_require__(45);
const Plugin = __webpack_require__(100);
const Promises = __webpack_require__(27);
const Reply = __webpack_require__(102);
const Request = __webpack_require__(103);
const Schema = __webpack_require__(11);


// Declare internals

const internals = {};


exports = module.exports = internals.Server = function (options) {

    Hoek.assert(this instanceof internals.Server, 'Server must be instantiated using new');

    options = Schema.apply('server', options || {});

    this._settings = Hoek.applyToDefaultsWithShallow(Defaults.server, options, ['connections.routes.bind']);
    this._settings.connections = Hoek.applyToDefaultsWithShallow(Defaults.connection, this._settings.connections || {}, ['routes.bind']);
    this._settings.connections.routes.cors = Hoek.applyToDefaults(Defaults.cors, this._settings.connections.routes.cors);
    this._settings.connections.routes.security = Hoek.applyToDefaults(Defaults.security, this._settings.connections.routes.security);

    this._caches = {};                                                              // Cache clients
    this._handlers = {};                                                            // Registered handlers
    this._methods = new Methods(this);                                              // Server methods

    this._events = new Podium([{ name: 'log', tags: true }, 'start', 'stop']);      // Server-only events
    this._dependencies = [];                                                        // Plugin dependencies
    this._registrations = {};                                                       // Tracks plugins registered before connection added
    this._heavy = new Heavy(this._settings.load);
    this._mime = new Mimos(this._settings.mime);
    this._replier = new Reply();
    this._requestor = new Request();
    this._decorations = {};
    this.decorations = { request: [], reply: [], server: [] };
    this._plugins = {};                                                             // Exposed plugin properties by name
    this._app = {};
    this._registring = false;                                                       // true while register() is waiting for plugin callbacks
    this._state = 'stopped';                                                        // 'stopped', 'initializing', 'initialized', 'starting', 'started', 'stopping', 'invalid'

    this._extensionsSeq = 0;                                                        // Used to keep absolute order of extensions based on the order added across locations
    this._extensions = {
        onPreStart: new Ext('onPreStart', this),
        onPostStart: new Ext('onPostStart', this),
        onPreStop: new Ext('onPreStop', this),
        onPostStop: new Ext('onPostStop', this)
    };

    if (options.cache) {
        this._createCache(options.cache);
    }

    if (!this._caches._default) {
        this._createCache([{ engine: CatboxMemory }]);                              // Defaults to memory-based
    }

    Plugin.call(this, this, [], '', null);

    // Subscribe to server log events

    if (this._settings.debug) {
        const debug = (request, event) => {

            const data = event.data;
            console.error('Debug:', event.tags.join(', '), (data ? '\n    ' + (data.stack || (typeof data === 'object' ? Hoek.stringify(data) : data)) : ''));
        };

        if (this._settings.debug.log) {
            const filter = this._settings.debug.log.some((tag) => tag === '*') ? undefined : this._settings.debug.log;
            this._events.on({ name: 'log', filter }, (event) => debug(null, event));
        }

        if (this._settings.debug.request) {
            const filter = this._settings.debug.request.some((tag) => tag === '*') ? undefined : this._settings.debug.request;
            this.on({ name: 'request', filter }, debug);
            this.on({ name: 'request-internal', filter }, debug);
        }
    }
};

Hoek.inherits(internals.Server, Plugin);


internals.Server.prototype._createCache = function (options, _callback) {

    Hoek.assert(this._state !== 'initializing', 'Cannot provision server cache while server is initializing');

    options = Schema.apply('cache', options);

    const added = [];
    for (let i = 0; i < options.length; ++i) {
        let config = options[i];
        if (typeof config === 'function') {
            config = { engine: config };
        }

        const name = config.name || '_default';
        Hoek.assert(!this._caches[name], 'Cannot configure the same cache more than once: ', name === '_default' ? 'default cache' : name);

        let client = null;
        if (typeof config.engine === 'object') {
            client = new Catbox.Client(config.engine);
        }
        else {
            const settings = Hoek.clone(config);
            settings.partition = settings.partition || 'hapi-cache';
            delete settings.name;
            delete settings.engine;
            delete settings.shared;

            client = new Catbox.Client(config.engine, settings);
        }

        this._caches[name] = {
            client,
            segments: {},
            shared: config.shared || false
        };

        added.push(client);
    }

    if (!_callback) {
        return;
    }

    // Start cache

    if (['initialized', 'starting', 'started'].indexOf(this._state) !== -1) {
        const each = (client, next) => client.start(next);
        return Items.parallel(added, each, _callback);
    }

    return Hoek.nextTick(_callback)();
};


internals.Server.prototype.connection = function (options) {

    const root = this.root;                                     // Explicitly use the root reference (for plugin invocation)

    const connections = [];
    [].concat(options).forEach((item) => {

        let settings = Hoek.applyToDefaultsWithShallow(root._settings.connections, item || {}, ['listener', 'routes.bind']);
        settings.routes.cors = Hoek.applyToDefaults(root._settings.connections.routes.cors || Defaults.cors, settings.routes.cors) || false;
        settings.routes.security = Hoek.applyToDefaults(root._settings.connections.routes.security || Defaults.security, settings.routes.security);

        settings = Schema.apply('connection', settings);        // Applies validation changes (type cast)

        const connection = new Connection(root, settings);
        root.connections.push(connection);
        root.registerPodium(connection);
        root._single();

        const registrations = Object.keys(root._registrations);
        for (let i = 0; i < registrations.length; ++i) {
            const name = registrations[i];
            connection.registrations[name] = root._registrations[name];
        }

        connections.push(connection);
    });

    return this._clone(connections);                            // Use this for active realm
};


internals.Server.prototype.start = function (callback) {

    if (!callback) {
        return Promises.wrap(this, this.start);
    }

    Hoek.assert(typeof callback === 'function', 'Missing required start callback function');
    const nextTickCallback = Hoek.nextTick(callback);

    if (!this.connections.length) {
        return nextTickCallback(new Error('No connections to start'));
    }

    if (this._state === 'initialized' ||
        this._state === 'started') {

        const error = this._validateDeps();
        if (error) {
            return nextTickCallback(error);
        }
    }

    if (this._state === 'initialized') {
        return this._start(callback);
    }

    if (this._state === 'started') {
        const each = (connection, next) => connection._start(next);
        return Items.parallel(this.connections, each, nextTickCallback);
    }

    if (this._state !== 'stopped') {
        return nextTickCallback(new Error('Cannot start server while it is in ' + this._state + ' state'));
    }

    this.initialize((err) => {

        if (err) {
            return callback(err);
        }

        this._start(callback);
    });
};


internals.Server.prototype.initialize = function (callback) {

    if (!callback) {
        return Promises.wrap(this, this.initialize);
    }

    Hoek.assert(typeof callback === 'function', 'Missing required start callback function');
    const nextTickCallback = Hoek.nextTick(callback);

    if (this._registring) {
        return nextTickCallback(new Error('Cannot start server before plugins finished registration'));
    }

    if (this._state === 'initialized') {
        return nextTickCallback();
    }

    if (this._state !== 'stopped') {
        return nextTickCallback(new Error('Cannot initialize server while it is in ' + this._state + ' state'));
    }

    const error = this._validateDeps();
    if (error) {
        return nextTickCallback(error);
    }

    this._state = 'initializing';

    // Start cache

    const caches = Object.keys(this._caches);
    const each = (cache, next) => this._caches[cache].client.start(next);
    Items.parallel(caches, each, (err) => {

        if (err) {
            this._state = 'invalid';
            return callback(err);
        }

        // After hooks

        this._invoke('onPreStart', (err) => {

            if (err) {
                this._state = 'invalid';
                return callback(err);
            }

            // Load measurements

            this._heavy.start();

            // Listen to connections

            this._state = 'initialized';
            return callback();
        });
    });
};


internals.Server.prototype._validateDeps = function () {

    for (let i = 0; i < this._dependencies.length; ++i) {
        const dependency = this._dependencies[i];
        if (dependency.connections) {
            for (let j = 0; j < dependency.connections.length; ++j) {
                const connection = dependency.connections[j];
                for (let k = 0; k < dependency.deps.length; ++k) {
                    const dep = dependency.deps[k];
                    if (!connection.registrations[dep]) {
                        return new Error('Plugin ' + dependency.plugin + ' missing dependency ' + dep + ' in connection: ' + connection.info.uri);
                    }
                }
            }
        }
        else {
            for (let j = 0; j < dependency.deps.length; ++j) {
                const dep = dependency.deps[j];
                if (!this._registrations[dep]) {
                    return new Error('Plugin ' + dependency.plugin + ' missing dependency ' + dep);
                }
            }
        }
    }

    return null;
};


internals.Server.prototype._start = function (callback) {

    this._state = 'starting';

    const each = (connection, next) => connection._start(next);
    Items.parallel(this.connections, each, (err) => {

        if (err) {
            this._state = 'invalid';
            return Hoek.nextTick(callback)(err);
        }

        this._events.emit('start', null, () => {

            this._invoke('onPostStart', (err) => {

                if (err) {
                    this._state = 'invalid';
                    return callback(err);
                }

                this._state = 'started';
                return callback();
            });
        });
    });
};


internals.Server.prototype.stop = function (/* [options], callback */) {

    const args = arguments.length;
    const lastArg = arguments[args - 1];
    const callback = (!args ? null : (typeof lastArg === 'function' ? lastArg : null));
    const options = (!args ? {} : (args === 1 ? (callback ? {} : arguments[0]) : arguments[0]));

    if (!callback) {
        return Promises.wrap(this, this.stop, [options]);
    }

    options.timeout = options.timeout || 5000;                                              // Default timeout to 5 seconds

    if (['stopped', 'initialized', 'started', 'invalid'].indexOf(this._state) === -1) {
        return Hoek.nextTick(callback)(new Error('Cannot stop server while in ' + this._state + ' state'));
    }

    this._state = 'stopping';

    this._invoke('onPreStop', (err) => {

        if (err) {
            this._state = 'invalid';
            return callback(err);
        }

        const each = (connection, next) => connection._stop(options, next);
        Items.parallel(this.connections, each, (err) => {

            if (err) {
                this._state = 'invalid';
                return callback(err);
            }

            const caches = Object.keys(this._caches);
            for (let i = 0; i < caches.length; ++i) {
                this._caches[caches[i]].client.stop();
            }

            this._events.emit('stop', null, () => {

                this._heavy.stop();
                this._invoke('onPostStop', (err) => {

                    if (err) {
                        this._state = 'invalid';
                        return callback(err);
                    }

                    this._state = 'stopped';
                    return callback();
                });
            });
        });
    });
};


internals.Server.prototype._invoke = function (type, next) {

    const exts = this._extensions[type];
    if (!exts.nodes) {
        return next();
    }

    Items.serial(exts.nodes, (ext, nextExt) => {

        const bind = (ext.bind || ext.plugin.realm.settings.bind);
        ext.func.call(bind, ext.plugin._select(), nextExt);
    }, next);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Boom = __webpack_require__(1);


// Declare internals

const internals = {};


internals.defaults = {
    partition: 'catbox'
};


module.exports = internals.Client = function (engine, options) {

    Hoek.assert(this instanceof internals.Client, 'Cache client must be instantiated using new');
    Hoek.assert(engine, 'Missing catbox client engine');
    Hoek.assert(typeof engine === 'object' || typeof engine === 'function', 'engine must be an engine object or engine prototype (function)');
    Hoek.assert(typeof engine === 'function' || !options, 'Can only specify options with function engine config');

    const settings = Hoek.applyToDefaults(internals.defaults, options || {});
    Hoek.assert(settings.partition.match(/^[\w\-]+$/), 'Invalid partition name:' + settings.partition);

    this.connection = (typeof engine === 'object' ? engine : new engine(settings));
};


internals.Client.prototype.stop = function () {

    this.connection.stop();
};


internals.Client.prototype.start = function (callback) {

    this.connection.start(callback);
};


internals.Client.prototype.isReady = function () {

    return this.connection.isReady();
};


internals.Client.prototype.validateSegmentName = function (name) {

    return this.connection.validateSegmentName(name);
};


internals.Client.prototype.get = function (key, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!key) {
        // Not found on null
        return callback(null, null);
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    this.connection.get(key, (err, result) => {

        if (err) {
            // Connection error
            return callback(err);
        }

        if (!result ||
            result.item === undefined ||
            result.item === null) {

            // Not found
            return callback(null, null);
        }

        const now = Date.now();
        const expires = result.stored + result.ttl;
        const ttl = expires - now;
        if (ttl <= 0) {
            // Expired
            return callback(null, null);
        }

        // Valid

        const cached = {
            item: result.item,
            stored: result.stored,
            ttl
        };

        return callback(null, cached);
    });
};


internals.Client.prototype.set = function (key, value, ttl, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    if (ttl <= 0) {
        // Not cachable (or bad rules)
        return callback();
    }

    this.connection.set(key, value, ttl, callback);
};


internals.Client.prototype.drop = function (key, callback) {

    if (!this.connection.isReady()) {
        // Disconnected
        return callback(Boom.internal('Disconnected'));
    }

    if (!internals.validateKey(key)) {
        return callback(Boom.internal('Invalid key'));
    }

    this.connection.drop(key, callback);           // Always drop, regardless of caching rules
};


internals.validateKey = function (key) {

    return (key && typeof key.id === 'string' && key.segment && typeof key.segment === 'string');
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Declare internals

const internals = {};


exports.escapeJavaScript = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeJavaScriptChar(charCode);
        }
    }

    return escaped;
};


exports.escapeHtml = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals.escapeHtmlChar(charCode);
        }
    }

    return escaped;
};


exports.escapeJson = function (input) {

    if (!input) {
        return '';
    }

    const lessThan = 0x3C;
    const greaterThan = 0x3E;
    const andSymbol = 0x26;
    const lineSeperator = 0x2028;

    // replace method
    let charCode;
    return input.replace(/[<>&\u2028\u2029]/g, (match) => {

        charCode = match.charCodeAt(0);

        if (charCode === lessThan) {
            return '\\u003c';
        }
        else if (charCode === greaterThan) {
            return '\\u003e';
        }
        else if (charCode === andSymbol) {
            return '\\u0026';
        }
        else if (charCode === lineSeperator) {
            return '\\u2028';
        }
        return '\\u2029';
    });
};


internals.escapeJavaScriptChar = function (charCode) {

    if (charCode >= 256) {
        return '\\u' + internals.padLeft('' + charCode, 4);
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '\\x' + internals.padLeft(hexValue, 2);
};


internals.escapeHtmlChar = function (charCode) {

    const namedEscape = internals.namedHtml[charCode];
    if (typeof namedEscape !== 'undefined') {
        return namedEscape;
    }

    if (charCode >= 256) {
        return '&#' + charCode + ';';
    }

    const hexValue = new Buffer(String.fromCharCode(charCode), 'ascii').toString('hex');
    return '&#x' + internals.padLeft(hexValue, 2) + ';';
};


internals.padLeft = function (str, len) {

    while (str.length < len) {
        str = '0' + str;
    }

    return str;
};


internals.isSafe = function (charCode) {

    return (typeof internals.safeCharCodes[charCode] !== 'undefined');
};


internals.namedHtml = {
    '38': '&amp;',
    '60': '&lt;',
    '62': '&gt;',
    '34': '&quot;',
    '160': '&nbsp;',
    '162': '&cent;',
    '163': '&pound;',
    '164': '&curren;',
    '169': '&copy;',
    '174': '&reg;'
};


internals.safeCharCodes = (function () {

    const safe = {};

    for (let i = 32; i < 123; ++i) {

        if ((i >= 97) ||                    // a-z
            (i >= 65 && i <= 90) ||         // A-Z
            (i >= 48 && i <= 57) ||         // 0-9
            i === 32 ||                     // space
            i === 46 ||                     // .
            i === 44 ||                     // ,
            i === 45 ||                     // -
            i === 58 ||                     // :
            i === 95) {                     // _

            safe[i] = null;
        }
    }

    return safe;
}());


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);


// Declare internals

const internals = {
    day: 24 * 60 * 60 * 1000
};


internals.toBoundCallback = function (callback) {

    return process.domain ? process.domain.bind(callback) : callback;
};


internals.PendingResponse = function (id, addCallback, onDidSend) {

    this.id = id;
    this.callbacks = [internals.toBoundCallback(addCallback)];
    this.onDidSend = onDidSend;
    this.timeoutTimer = null;
};


internals.PendingResponse.prototype.add = function (callback) {

    this.callbacks.push(internals.toBoundCallback(callback));     // Explicitly bind callback to its process.domain (_finalize might get called from a different active process.domain)
};


internals.PendingResponse.prototype.send = function (err, value, cached, report) {

    const length = this.callbacks.length;
    for (let i = 0; i < length; ++i) {
        Hoek.nextTick(this.callbacks[i])(err, value, cached, report);
    }

    clearTimeout(this.timeoutTimer);
    this.callbacks = [];

    return this.onDidSend(length, report);
};


internals.PendingResponse.prototype.setTimeout = function (fn, timeoutMs) {

    clearTimeout(this.timeoutTimer);

    this.timeoutTimer = setTimeout(fn, timeoutMs);
};


exports = module.exports = internals.Policy = function (options, cache, segment) {

    Hoek.assert(this instanceof internals.Policy, 'Cache Policy must be instantiated using new');

    this._cache = cache;
    this._pendings = Object.create(null);                       // id -> PendingResponse
    this._pendingGenerateCall = Object.create(null);            // id -> boolean
    this.rules(options);

    this.stats = {
        sets: 0,
        gets: 0,
        hits: 0,
        stales: 0,
        generates: 0,
        errors: 0
    };

    if (cache) {
        const nameErr = cache.validateSegmentName(segment);
        Hoek.assert(nameErr === null, 'Invalid segment name: ' + segment + (nameErr ? ' (' + nameErr.message + ')' : ''));

        this._segment = segment;
    }
};


internals.Policy.prototype.rules = function (options) {

    this.rule = internals.Policy.compile(options, !!this._cache);
};


internals.Policy.prototype.get = function (key, callback) {     // key: string or { id: 'id' }

    ++this.stats.gets;

    // Check if request is already pending

    const id = (key && typeof key === 'object') ? key.id : key;
    if (this._pendings[id]) {
        this._pendings[id].add(callback);
        return;
    }

    const pending = this._pendings[id] = new internals.PendingResponse(id, callback, (count, report) => {

        delete this._pendings[id];

        if (count > 0 && report.isStale !== undefined) {
            this.stats.hits = this.stats.hits + count;
        }
    });

    // Lookup in cache

    const timer = new Hoek.Timer();
    this._get(id, (err, cached) => {

        if (err) {
            ++this.stats.errors;
        }

        // Prepare report

        const report = {
            msec: timer.elapsed(),
            error: err
        };

        if (cached) {
            report.stored = cached.stored;
            report.ttl = cached.ttl;
            const staleIn = typeof this.rule.staleIn === 'function' ? this.rule.staleIn(cached.stored, cached.ttl) : this.rule.staleIn;
            cached.isStale = (staleIn ? (Date.now() - cached.stored) >= staleIn : false);
            report.isStale = cached.isStale;

            if (cached.isStale) {
                ++this.stats.stales;
            }
        }

        // No generate method

        if (!this.rule.generateFunc ||
            (err && !this.rule.generateOnReadError)) {

            return pending.send(err, cached ? cached.item : null, cached, report);
        }

        // Check if found and fresh

        if (cached &&
            !cached.isStale) {

            return pending.send(null, cached.item, cached, report);
        }

        return this._generate(pending, key, cached, report);
    });
};


internals.Policy.prototype._generate = function (pending, key, cached, report) {

    if (cached) {                                       // Must be stale

        // Set stale timeout

        cached.ttl = cached.ttl - this.rule.staleTimeout;       // Adjust TTL for when the timeout is invoked (staleTimeout must be valid if isStale is true)
    }

    if (cached &&
        cached.ttl > 0) {

        pending.setTimeout(() => {

            return pending.send(null, cached.item, cached, report);
        }, this.rule.staleTimeout);
    }
    else if (this.rule.generateTimeout) {

        // Set item generation timeout (when not in cache)

        pending.setTimeout(() => {

            return pending.send(Boom.serverUnavailable(), null, null, report);
        }, this.rule.generateTimeout);
    }

    // Generate new value

    if (!this._pendingGenerateCall[pending.id]) {                // Check if a generate call is already in progress
        ++this.stats.generates;                                 // Record generation before call in case it times out

        if (this.rule.pendingGenerateTimeout) {
            this._pendingGenerateCall[pending.id] = pending;
            setTimeout(() => {

                delete this._pendingGenerateCall[pending.id];
            }, this.rule.pendingGenerateTimeout);
        }

        try {
            this._callGenerateFunc(pending, key, cached, report);
        }
        catch (err) {
            delete this._pendingGenerateCall[pending.id];
            return pending.send(err, null, null, report);
        }
    }
    else {
        this._pendingGenerateCall[pending.id] = pending;
    }
};


internals.Policy.prototype._callGenerateFunc = function (pending, key, cached, report) {

    this.rule.generateFunc.call(null, key, (generateError, value, ttl) => {

        pending = this._pendingGenerateCall[pending.id] || pending;
        delete this._pendingGenerateCall[pending.id];

        const finalize = (err) => {

            const error = generateError || (this.rule.generateIgnoreWriteError ? null : err);
            if (cached &&
                error &&
                !this.rule.dropOnError) {

                return pending.send(error, cached.item, cached, report);
            }

            return pending.send(error, value, null, report);       // Ignored if stale value already returned
        };

        // Error (if dropOnError is not set to false) or not cached

        if ((generateError && this.rule.dropOnError) || ttl === 0) {                                    // null or undefined means use policy
            return this.drop(pending.id, finalize);                 // Invalidate cache
        }

        if (!generateError) {
            return this.set(pending.id, value, ttl, finalize);      // Lazy save (replaces stale cache copy with late-coming fresh copy)
        }

        return finalize();
    });
};


internals.Policy.prototype._get = function (id, callback) {

    if (!this._cache) {
        return Hoek.nextTick(callback)(null, null);
    }

    this._cache.get({ segment: this._segment, id }, callback);
};


internals.Policy.prototype.set = function (key, value, ttl, callback) {

    callback = callback || Hoek.ignore;

    ++this.stats.sets;

    if (!this._cache) {
        return callback(null);
    }

    ttl = ttl || internals.Policy.ttl(this.rule);
    const id = (key && typeof key === 'object') ? key.id : key;
    this._cache.set({ segment: this._segment, id }, value, ttl, (err) => {

        if (err) {
            ++this.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.drop = function (key, callback) {

    callback = callback || Hoek.ignore;

    if (!this._cache) {
        return callback(null);
    }

    const id = (key && typeof key === 'object') ? key.id : key;
    this._cache.drop({ segment: this._segment, id }, (err) => {

        if (err) {
            ++this.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.ttl = function (created) {

    return internals.Policy.ttl(this.rule, created);
};


internals.schema = Joi.object({
    expiresIn: Joi.number().integer().min(1),
    expiresAt: Joi.string().regex(/^\d\d?\:\d\d$/),
    staleIn: [
        Joi.number().integer().min(1).when('expiresAt', { is: Joi.required(), then: Joi.number().max(86400000 - 1) }),       // One day - 1 (max is inclusive)
        Joi.func()
    ],
    staleTimeout: Joi.number().integer().min(1),
    generateFunc: Joi.func(),
    generateTimeout: Joi.number().integer().min(1).allow(false),
    generateOnReadError: Joi.boolean(),
    generateIgnoreWriteError: Joi.boolean(),
    dropOnError: Joi.boolean(),
    pendingGenerateTimeout: Joi.number().integer().min(1),

    // Ignored external keys (hapi)

    privacy: Joi.any(),
    cache: Joi.any(),
    segment: Joi.any(),
    shared: Joi.any()
})
    .without('expiresIn', 'expiresAt')
    .with('staleIn', 'generateFunc')
    .with('generateOnReadError', 'generateFunc')
    .with('generateIgnoreWriteError', 'generateFunc')
    .with('dropOnError', 'generateFunc')
    .and('generateFunc', 'generateTimeout')
    .and('staleIn', 'staleTimeout');


internals.Policy.compile = function (options, serverSide) {

    /*
        {
            expiresIn: 30000,
            expiresAt: '13:00',

            generateFunc: function (id, next) { next(err, result, ttl); }
            generateTimeout: 500,
            generateOnReadError: true,
            generateIgnoreWriteError: true,
            staleIn: 20000,
            staleTimeout: 500,
            dropOnError: true
        }
     */

    const rule = {};

    if (!options ||
        !Object.keys(options).length) {

        return rule;
    }

    // Validate rule

    Joi.assert(options, internals.schema, 'Invalid cache policy configuration');

    const hasExpiresIn = options.expiresIn !== undefined && options.expiresIn !== null;
    const hasExpiresAt = options.expiresAt !== undefined && options.expiresAt !== null;

    Hoek.assert(!hasExpiresAt || typeof options.expiresAt === 'string', 'expiresAt must be a string', options);
    Hoek.assert(!hasExpiresIn || Hoek.isInteger(options.expiresIn), 'expiresIn must be an integer', options);
    Hoek.assert(!hasExpiresIn || !options.staleIn || typeof options.staleIn === 'function' || options.staleIn < options.expiresIn, 'staleIn must be less than expiresIn');
    Hoek.assert(!options.staleIn || serverSide, 'Cannot use stale options without server-side caching');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || options.staleTimeout < options.expiresIn, 'staleTimeout must be less than expiresIn');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || typeof options.staleIn === 'function' || options.staleTimeout < (options.expiresIn - options.staleIn), 'staleTimeout must be less than the delta between expiresIn and staleIn');
    Hoek.assert(!options.staleTimeout || !options.pendingGenerateTimeout || options.staleTimeout < options.pendingGenerateTimeout, 'pendingGenerateTimeout must be greater than staleTimeout if specified');

    // Expiration

    if (hasExpiresAt) {

        // expiresAt

        const time = /^(\d\d?):(\d\d)$/.exec(options.expiresAt);
        rule.expiresAt = {
            hours: parseInt(time[1], 10),
            minutes: parseInt(time[2], 10)
        };
    }
    else {

        // expiresIn

        rule.expiresIn = options.expiresIn || 0;
    }

    // generateTimeout

    if (options.generateFunc) {
        rule.generateFunc = options.generateFunc;
        rule.generateTimeout = options.generateTimeout;

        // Stale

        if (options.staleIn) {
            rule.staleIn = options.staleIn;
            rule.staleTimeout = options.staleTimeout;
        }

        rule.dropOnError = options.dropOnError !== undefined ? options.dropOnError : true;                                          // Defaults to true
        rule.pendingGenerateTimeout = options.pendingGenerateTimeout !== undefined ? options.pendingGenerateTimeout : 0;            // Defaults to zero
    }

    rule.generateOnReadError = options.generateOnReadError !== undefined ? options.generateOnReadError : true;                      // Defaults to true
    rule.generateIgnoreWriteError = options.generateIgnoreWriteError !== undefined ? options.generateIgnoreWriteError : true;       // Defaults to true

    return rule;
};


internals.Policy.ttl = function (rule, created, now) {

    now = now || Date.now();
    created = created || now;
    const age = now - created;

    if (age < 0) {
        return 0;                                                                   // Created in the future, assume expired/bad
    }

    if (rule.expiresIn) {
        return Math.max(rule.expiresIn - age, 0);
    }

    if (rule.expiresAt) {
        if (age > internals.day) {                                                  // If the item was created more than a 24 hours ago
            return 0;
        }

        const expiresAt = new Date(created);                                        // Compare expiration time on the same day
        expiresAt.setHours(rule.expiresAt.hours);
        expiresAt.setMinutes(rule.expiresAt.minutes);
        expiresAt.setSeconds(0);
        expiresAt.setMilliseconds(0);
        let expires = expiresAt.getTime();

        if (expires <= created) {
            expires = expires + internals.day;                                     // Move to tomorrow
        }

        if (now >= expires) {                                                      // Expired
            return 0;
        }

        return expires - now;
    }

    return 0;                                                                       // No rule
};


internals.Policy.prototype.isReady = function () {

    if (!this._cache) {
        return false;
    }

    return this._cache.connection.isReady();
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.errors = {
    root: 'value',
    key: '"{{!key}}" ',
    messages: {
        wrapArrays: true
    },
    any: {
        unknown: 'is not allowed',
        invalid: 'contains an invalid value',
        empty: 'is not allowed to be empty',
        required: 'is required',
        allowOnly: 'must be one of {{valids}}',
        default: 'threw an error when running default method'
    },
    alternatives: {
        base: 'not matching any of the allowed alternatives',
        child: null
    },
    array: {
        base: 'must be an array',
        includes: 'at position {{pos}} does not match any of the allowed types',
        includesSingle: 'single value of "{{!key}}" does not match any of the allowed types',
        includesOne: 'at position {{pos}} fails because {{reason}}',
        includesOneSingle: 'single value of "{{!key}}" fails because {{reason}}',
        includesRequiredUnknowns: 'does not contain {{unknownMisses}} required value(s)',
        includesRequiredKnowns: 'does not contain {{knownMisses}}',
        includesRequiredBoth: 'does not contain {{knownMisses}} and {{unknownMisses}} other required value(s)',
        excludes: 'at position {{pos}} contains an excluded value',
        excludesSingle: 'single value of "{{!key}}" contains an excluded value',
        min: 'must contain at least {{limit}} items',
        max: 'must contain less than or equal to {{limit}} items',
        length: 'must contain {{limit}} items',
        ordered: 'at position {{pos}} fails because {{reason}}',
        orderedLength: 'at position {{pos}} fails because array must contain at most {{limit}} items',
        ref: 'references "{{ref}}" which is not a positive integer',
        sparse: 'must not be a sparse array',
        unique: 'position {{pos}} contains a duplicate value'
    },
    boolean: {
        base: 'must be a boolean'
    },
    binary: {
        base: 'must be a buffer or a string',
        min: 'must be at least {{limit}} bytes',
        max: 'must be less than or equal to {{limit}} bytes',
        length: 'must be {{limit}} bytes'
    },
    date: {
        base: 'must be a number of milliseconds or valid date string',
        format: 'must be a string with one of the following formats {{format}}',
        strict: 'must be a valid date',
        min: 'must be larger than or equal to "{{limit}}"',
        max: 'must be less than or equal to "{{limit}}"',
        isoDate: 'must be a valid ISO 8601 date',
        timestamp: {
            javascript: 'must be a valid timestamp or number of milliseconds',
            unix: 'must be a valid timestamp or number of seconds'
        },
        ref: 'references "{{ref}}" which is not a date'
    },
    function: {
        base: 'must be a Function',
        arity: 'must have an arity of {{n}}',
        minArity: 'must have an arity greater or equal to {{n}}',
        maxArity: 'must have an arity lesser or equal to {{n}}',
        ref: 'must be a Joi reference'
    },
    lazy: {
        base: '!!schema error: lazy schema must be set',
        schema: '!!schema error: lazy schema function must return a schema'
    },
    object: {
        base: 'must be an object',
        child: '!!child "{{!child}}" fails because {{reason}}',
        min: 'must have at least {{limit}} children',
        max: 'must have less than or equal to {{limit}} children',
        length: 'must have {{limit}} children',
        allowUnknown: '!!"{{!child}}" is not allowed',
        with: '!!"{{mainWithLabel}}" missing required peer "{{peerWithLabel}}"',
        without: '!!"{{mainWithLabel}}" conflict with forbidden peer "{{peerWithLabel}}"',
        missing: 'must contain at least one of {{peersWithLabels}}',
        xor: 'contains a conflict between exclusive peers {{peersWithLabels}}',
        or: 'must contain at least one of {{peersWithLabels}}',
        and: 'contains {{presentWithLabels}} without its required peers {{missingWithLabels}}',
        nand: '!!"{{mainWithLabel}}" must not exist simultaneously with {{peersWithLabels}}',
        assert: '!!"{{ref}}" validation failed because "{{ref}}" failed to {{message}}',
        rename: {
            multiple: 'cannot rename child "{{from}}" because multiple renames are disabled and another key was already renamed to "{{to}}"',
            override: 'cannot rename child "{{from}}" because override is disabled and target "{{to}}" exists'
        },
        type: 'must be an instance of "{{type}}"',
        schema: 'must be a Joi instance'
    },
    number: {
        base: 'must be a number',
        min: 'must be larger than or equal to {{limit}}',
        max: 'must be less than or equal to {{limit}}',
        less: 'must be less than {{limit}}',
        greater: 'must be greater than {{limit}}',
        float: 'must be a float or double',
        integer: 'must be an integer',
        negative: 'must be a negative number',
        positive: 'must be a positive number',
        precision: 'must have no more than {{limit}} decimal places',
        ref: 'references "{{ref}}" which is not a number',
        multiple: 'must be a multiple of {{multiple}}'
    },
    string: {
        base: 'must be a string',
        min: 'length must be at least {{limit}} characters long',
        max: 'length must be less than or equal to {{limit}} characters long',
        length: 'length must be {{limit}} characters long',
        alphanum: 'must only contain alpha-numeric characters',
        token: 'must only contain alpha-numeric and underscore characters',
        regex: {
            base: 'with value "{{!value}}" fails to match the required pattern: {{pattern}}',
            name: 'with value "{{!value}}" fails to match the {{name}} pattern',
            invert: {
                base: 'with value "{{!value}}" matches the inverted pattern: {{pattern}}',
                name: 'with value "{{!value}}" matches the inverted {{name}} pattern'
            }
        },
        email: 'must be a valid email',
        uri: 'must be a valid uri',
        uriRelativeOnly: 'must be a valid relative uri',
        uriCustomScheme: 'must be a valid uri with a scheme matching the {{scheme}} pattern',
        isoDate: 'must be a valid ISO 8601 date',
        guid: 'must be a valid GUID',
        hex: 'must only contain hexadecimal characters',
        base64: 'must be a valid base64 string',
        hostname: 'must be a valid hostname',
        lowercase: 'must only contain lowercase characters',
        uppercase: 'must only contain uppercase characters',
        trim: 'must not have leading or trailing whitespace',
        creditCard: 'must be a credit card',
        ref: 'references "{{ref}}" which is not a number',
        ip: 'must be a valid ip address with a {{cidr}} CIDR',
        ipVersion: 'must be a valid ip address of one of the following versions {{version}} with a {{cidr}} CIDR'
    }
};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load Modules

const RFC3986 = __webpack_require__(31);


// Declare internals

const internals = {
    Uri: {
        createUriRegex: function (optionalScheme, allowRelative, relativeOnly) {

            let scheme = RFC3986.scheme;
            let prefix;

            if (relativeOnly) {
                prefix = '(?:' + RFC3986.relativeRef + ')';
            }
            else {
                // If we were passed a scheme, use it instead of the generic one
                if (optionalScheme) {

                    // Have to put this in a non-capturing group to handle the OR statements
                    scheme = '(?:' + optionalScheme + ')';
                }

                const withScheme = '(?:' + scheme + ':' + RFC3986.hierPart + ')';

                prefix = allowRelative ? '(?:' + withScheme + '|' + RFC3986.relativeRef + ')' : withScheme;
            }

            /**
             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
             *
             * OR
             *
             * relative-ref = relative-part [ "?" query ] [ "#" fragment ]
             */
            return new RegExp('^' + prefix + '(?:\\?' + RFC3986.query + ')?' + '(?:#' + RFC3986.fragment + ')?$');
        }
    }
};


module.exports = internals.Uri;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const RFC3986 = __webpack_require__(31);


// Declare internals

const internals = {
    Ip: {
        cidrs: {
            required: '\\/(?:' + RFC3986.cidr + ')',
            optional: '(?:\\/(?:' + RFC3986.cidr + '))?',
            forbidden: ''
        },
        versions: {
            ipv4: RFC3986.IPv4address,
            ipv6: RFC3986.IPv6address,
            ipvfuture: RFC3986.IPvFuture
        }
    }
};


internals.Ip.createIpRegex = function (versions, cidr) {

    let regex;
    for (let i = 0; i < versions.length; ++i) {
        const version = versions[i];
        if (!regex) {
            regex = '^(?:' + internals.Ip.versions[version];
        }
        regex = regex + '|' + internals.Ip.versions[version];
    }

    return new RegExp(regex + ')' + internals.Ip.cidrs[cidr] + '$');
};

module.exports = internals.Ip;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Dns = __webpack_require__(64);


// Declare internals

const internals = {
    hasOwn: Object.prototype.hasOwnProperty,
    indexOf: Array.prototype.indexOf,
    defaultThreshold: 16,
    maxIPv6Groups: 8,

    categories: {
        valid: 1,
        dnsWarn: 7,
        rfc5321: 15,
        cfws: 31,
        deprecated: 63,
        rfc5322: 127,
        error: 255
    },

    diagnoses: {

        // Address is valid

        valid: 0,

        // Address is valid, but the DNS check failed

        dnsWarnNoMXRecord: 5,
        dnsWarnNoRecord: 6,

        // Address is valid for SMTP but has unusual elements

        rfc5321TLD: 9,
        rfc5321TLDNumeric: 10,
        rfc5321QuotedString: 11,
        rfc5321AddressLiteral: 12,

        // Address is valid for message, but must be modified for envelope

        cfwsComment: 17,
        cfwsFWS: 18,

        // Address contains deprecated elements, but may still be valid in some contexts

        deprecatedLocalPart: 33,
        deprecatedFWS: 34,
        deprecatedQTEXT: 35,
        deprecatedQP: 36,
        deprecatedComment: 37,
        deprecatedCTEXT: 38,
        deprecatedIPv6: 39,
        deprecatedCFWSNearAt: 49,

        // Address is only valid according to broad definition in RFC 5322, but is otherwise invalid

        rfc5322Domain: 65,
        rfc5322TooLong: 66,
        rfc5322LocalTooLong: 67,
        rfc5322DomainTooLong: 68,
        rfc5322LabelTooLong: 69,
        rfc5322DomainLiteral: 70,
        rfc5322DomainLiteralOBSDText: 71,
        rfc5322IPv6GroupCount: 72,
        rfc5322IPv62x2xColon: 73,
        rfc5322IPv6BadCharacter: 74,
        rfc5322IPv6MaxGroups: 75,
        rfc5322IPv6ColonStart: 76,
        rfc5322IPv6ColonEnd: 77,

        // Address is invalid for any purpose

        errExpectingDTEXT: 129,
        errNoLocalPart: 130,
        errNoDomain: 131,
        errConsecutiveDots: 132,
        errATEXTAfterCFWS: 133,
        errATEXTAfterQS: 134,
        errATEXTAfterDomainLiteral: 135,
        errExpectingQPair: 136,
        errExpectingATEXT: 137,
        errExpectingQTEXT: 138,
        errExpectingCTEXT: 139,
        errBackslashEnd: 140,
        errDotStart: 141,
        errDotEnd: 142,
        errDomainHyphenStart: 143,
        errDomainHyphenEnd: 144,
        errUnclosedQuotedString: 145,
        errUnclosedComment: 146,
        errUnclosedDomainLiteral: 147,
        errFWSCRLFx2: 148,
        errFWSCRLFEnd: 149,
        errCRNoLF: 150,
        errUnknownTLD: 160,
        errDomainTooShort: 161
    },

    components: {
        localpart: 0,
        domain: 1,
        literal: 2,
        contextComment: 3,
        contextFWS: 4,
        contextQuotedString: 5,
        contextQuotedPair: 6
    }
};


// $lab:coverage:off$
internals.defer = typeof process !== 'undefined' && process && typeof process.nextTick === 'function' ?
    process.nextTick.bind(process) :
    function (callback) {

        return setTimeout(callback, 0);
    };
// $lab:coverage:on$


internals.specials = function () {

    const specials = '()<>[]:;@\\,."';        // US-ASCII visible characters not valid for atext (http://tools.ietf.org/html/rfc5322#section-3.2.3)
    const lookup = new Array(0x100);
    for (let i = 0xff; i >= 0; --i) {
        lookup[i] = false;
    }

    for (let i = 0; i < specials.length; ++i) {
        lookup[specials.charCodeAt(i)] = true;
    }

    return function (code) {

        return lookup[code];
    };
}();


internals.regex = {
    ipV4: /\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
    ipV6: /^[a-fA-F\d]{0,4}$/
};


internals.checkIpV6 = function (items) {

    return items.every((value) => internals.regex.ipV6.test(value));
};


internals.validDomain = function (tldAtom, options) {

    if (options.tldBlacklist) {
        if (Array.isArray(options.tldBlacklist)) {
            return internals.indexOf.call(options.tldBlacklist, tldAtom) === -1;
        }

        return !internals.hasOwn.call(options.tldBlacklist, tldAtom);
    }

    if (Array.isArray(options.tldWhitelist)) {
        return internals.indexOf.call(options.tldWhitelist, tldAtom) !== -1;
    }

    return internals.hasOwn.call(options.tldWhitelist, tldAtom);
};


/**
 * Check that an email address conforms to RFCs 5321, 5322 and others
 *
 * We distinguish clearly between a Mailbox as defined by RFC 5321 and an
 * addr-spec as defined by RFC 5322. Depending on the context, either can be
 * regarded as a valid email address. The RFC 5321 Mailbox specification is
 * more restrictive (comments, white space and obsolete forms are not allowed).
 *
 * @param {string} email The email address to check. See README for specifics.
 * @param {Object} options The (optional) options:
 *   {boolean} checkDNS If true then will check DNS for MX records. If
 *     true this call to isEmail _will_ be asynchronous.
 *   {*} errorLevel Determines the boundary between valid and invalid
 *     addresses.
 *   {*} tldBlacklist The set of domains to consider invalid.
 *   {*} tldWhitelist The set of domains to consider valid.
 *   {*} minDomainAtoms The minimum number of domain atoms which must be present
 *     for the address to be valid.
 * @param {function(number|boolean)} callback The (optional) callback handler.
 * @return {*}
 */

exports.validate = internals.validate = function (email, options, callback) {

    options = options || {};

    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    if (typeof callback !== 'function') {
        if (options.checkDNS) {
            throw new TypeError('expected callback function for checkDNS option');
        }

        callback = null;
    }

    let diagnose;
    let threshold;

    if (typeof options.errorLevel === 'number') {
        diagnose = true;
        threshold = options.errorLevel;
    }
    else {
        diagnose = !!options.errorLevel;
        threshold = internals.diagnoses.valid;
    }

    if (options.tldWhitelist) {
        if (typeof options.tldWhitelist === 'string') {
            options.tldWhitelist = [options.tldWhitelist];
        }
        else if (typeof options.tldWhitelist !== 'object') {
            throw new TypeError('expected array or object tldWhitelist');
        }
    }

    if (options.tldBlacklist) {
        if (typeof options.tldBlacklist === 'string') {
            options.tldBlacklist = [options.tldBlacklist];
        }
        else if (typeof options.tldBlacklist !== 'object') {
            throw new TypeError('expected array or object tldBlacklist');
        }
    }

    if (options.minDomainAtoms && (options.minDomainAtoms !== ((+options.minDomainAtoms) | 0) || options.minDomainAtoms < 0)) {
        throw new TypeError('expected positive integer minDomainAtoms');
    }

    let maxResult = internals.diagnoses.valid;
    const updateResult = (value) => {

        if (value > maxResult) {
            maxResult = value;
        }
    };

    const context = {
        now: internals.components.localpart,
        prev: internals.components.localpart,
        stack: [internals.components.localpart]
    };

    let prevToken = '';

    const parseData = {
        local: '',
        domain: ''
    };
    const atomData = {
        locals: [''],
        domains: ['']
    };

    let elementCount = 0;
    let elementLength = 0;
    let crlfCount = 0;
    let charCode;

    let hyphenFlag = false;
    let assertEnd = false;

    const emailLength = email.length;

    let token;                                      // Token is used outside the loop, must declare similarly
    for (let i = 0; i < emailLength; ++i) {
        token = email[i];

        switch (context.now) {
            // Local-part
            case internals.components.localpart:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   local-part      =   dot-atom / quoted-string / obs-local-part
                //
                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
                //
                //   dot-atom-text   =   1*atext *("." 1*atext)
                //
                //   quoted-string   =   [CFWS]
                //                       DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                //                       [CFWS]
                //
                //   obs-local-part  =   word *("." word)
                //
                //   word            =   atom / quoted-string
                //
                //   atom            =   [CFWS] 1*atext [CFWS]
                switch (token) {
                    // Comment
                    case '(':
                        if (elementLength === 0) {
                            // Comments are OK at the beginning of an element
                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsComment : internals.diagnoses.deprecatedComment);
                        }
                        else {
                            updateResult(internals.diagnoses.cfwsComment);
                            // Cannot start a comment in an element, should be end
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // Next dot-atom element
                    case '.':
                        if (elementLength === 0) {
                            // Another dot, already?
                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
                        }
                        else {
                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
                            if (assertEnd) {
                                updateResult(internals.diagnoses.deprecatedLocalPart);
                            }

                            // CFWS & quoted strings are OK again now we're at the beginning of an element (although they are obsolete forms)
                            assertEnd = false;
                            elementLength = 0;
                            ++elementCount;
                            parseData.local += token;
                            atomData.locals[elementCount] = '';
                        }

                        break;

                        // Quoted string
                    case '"':
                        if (elementLength === 0) {
                            // The entire local-part can be a quoted string for RFC 5321; if one atom is quoted it's an RFC 5322 obsolete form
                            updateResult(elementCount === 0 ? internals.diagnoses.rfc5321QuotedString : internals.diagnoses.deprecatedLocalPart);

                            parseData.local += token;
                            atomData.locals[elementCount] += token;
                            ++elementLength;

                            // Quoted string must be the entire element
                            assertEnd = true;
                            context.stack.push(context.now);
                            context.now = internals.components.contextQuotedString;
                        }
                        else {
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }

                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        if (elementLength === 0) {
                            updateResult(elementCount === 0 ? internals.diagnoses.cfwsFWS : internals.diagnoses.deprecatedFWS);
                        }
                        else {
                            // We can't start FWS in the middle of an element, better be end
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                    case '@':
                        // At this point we should have a valid local-part
                        // $lab:coverage:off$
                        if (context.stack.length !== 1) {
                            throw new Error('unexpected item on context stack');
                        }
                        // $lab:coverage:on$

                        if (parseData.local.length === 0) {
                            // Fatal error
                            updateResult(internals.diagnoses.errNoLocalPart);
                        }
                        else if (elementLength === 0) {
                            // Fatal error
                            updateResult(internals.diagnoses.errDotEnd);
                        }
                            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.1 the maximum total length of a user name or other local-part is 64
                            //    octets
                        else if (parseData.local.length > 64) {
                            updateResult(internals.diagnoses.rfc5322LocalTooLong);
                        }
                            // http://tools.ietf.org/html/rfc5322#section-3.4.1 comments and folding white space SHOULD NOT be used around "@" in the
                            //    addr-spec
                            //
                            // http://tools.ietf.org/html/rfc2119
                            // 4. SHOULD NOT this phrase, or the phrase "NOT RECOMMENDED" mean that there may exist valid reasons in particular
                            //    circumstances when the particular behavior is acceptable or even useful, but the full implications should be understood
                            //    and the case carefully weighed before implementing any behavior described with this label.
                        else if (context.prev === internals.components.contextComment || context.prev === internals.components.contextFWS) {
                            updateResult(internals.diagnoses.deprecatedCFWSNearAt);
                        }

                        // Clear everything down for the domain parsing
                        context.now = internals.components.domain;
                        context.stack[0] = internals.components.domain;
                        elementCount = 0;
                        elementLength = 0;
                        assertEnd = false; // CFWS can only appear at the end of the element
                        break;

                        // ATEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
                        //            "!" / "#" /     ;  characters not including
                        //            "$" / "%" /     ;  specials.  Used for atoms.
                        //            "&" / "'" /
                        //            "*" / "+" /
                        //            "-" / "/" /
                        //            "=" / "?" /
                        //            "^" / "_" /
                        //            "`" / "{" /
                        //            "|" / "}" /
                        //            "~"
                        if (assertEnd) {
                            // We have encountered atext where it is no longer valid
                            switch (context.prev) {
                                case internals.components.contextComment:
                                case internals.components.contextFWS:
                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
                                    break;

                                case internals.components.contextQuotedString:
                                    updateResult(internals.diagnoses.errATEXTAfterQS);
                                    break;

                                    // $lab:coverage:off$
                                default:
                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
                                    // $lab:coverage:on$
                            }
                        }
                        else {
                            context.prev = context.now;
                            charCode = token.charCodeAt(0);

                            // Especially if charCode == 10
                            if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {

                                // Fatal error
                                updateResult(internals.diagnoses.errExpectingATEXT);
                            }

                            parseData.local += token;
                            atomData.locals[elementCount] += token;
                            ++elementLength;
                        }
                }

                break;

            case internals.components.domain:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   domain          =   dot-atom / domain-literal / obs-domain
                //
                //   dot-atom        =   [CFWS] dot-atom-text [CFWS]
                //
                //   dot-atom-text   =   1*atext *("." 1*atext)
                //
                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
                //
                //   dtext           =   %d33-90 /          ; Printable US-ASCII
                //                       %d94-126 /         ;  characters not including
                //                       obs-dtext          ;  "[", "]", or "\"
                //
                //   obs-domain      =   atom *("." atom)
                //
                //   atom            =   [CFWS] 1*atext [CFWS]

                // http://tools.ietf.org/html/rfc5321#section-4.1.2
                //   Mailbox        = Local-part "@" ( Domain / address-literal )
                //
                //   Domain         = sub-domain *("." sub-domain)
                //
                //   address-literal  = "[" ( IPv4-address-literal /
                //                    IPv6-address-literal /
                //                    General-address-literal ) "]"
                //                    ; See Section 4.1.3

                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //      Note: A liberal syntax for the domain portion of addr-spec is
                //      given here.  However, the domain portion contains addressing
                //      information specified by and used in other protocols (e.g.,
                //      [RFC1034], [RFC1035], [RFC1123], [RFC5321]).  It is therefore
                //      incumbent upon implementations to conform to the syntax of
                //      addresses for the context in which they are used.
                //
                // is_email() author's note: it's not clear how to interpret this in
                // he context of a general email address validator. The conclusion I
                // have reached is this: "addressing information" must comply with
                // RFC 5321 (and in turn RFC 1035), anything that is "semantically
                // invisible" must comply only with RFC 5322.
                switch (token) {
                    // Comment
                    case '(':
                        if (elementLength === 0) {
                            // Comments at the start of the domain are deprecated in the text, comments at the start of a subdomain are obs-domain
                            // http://tools.ietf.org/html/rfc5322#section-3.4.1
                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedComment);
                        }
                        else {
                            // We can't start a comment mid-element, better be at the end
                            assertEnd = true;
                            updateResult(internals.diagnoses.cfwsComment);
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // Next dot-atom element
                    case '.':
                        if (elementLength === 0) {
                            // Another dot, already? Fatal error.
                            updateResult(elementCount === 0 ? internals.diagnoses.errDotStart : internals.diagnoses.errConsecutiveDots);
                        }
                        else if (hyphenFlag) {
                            // Previous subdomain ended in a hyphen. Fatal error.
                            updateResult(internals.diagnoses.errDomainHyphenEnd);
                        }
                        else if (elementLength > 63) {
                            // Nowhere in RFC 5321 does it say explicitly that the domain part of a Mailbox must be a valid domain according to the
                            // DNS standards set out in RFC 1035, but this *is* implied in several places. For instance, wherever the idea of host
                            // routing is discussed the RFC says that the domain must be looked up in the DNS. This would be nonsense unless the
                            // domain was designed to be a valid DNS domain. Hence we must conclude that the RFC 1035 restriction on label length
                            // also applies to RFC 5321 domains.
                            //
                            // http://tools.ietf.org/html/rfc1035#section-2.3.4
                            // labels          63 octets or less

                            updateResult(internals.diagnoses.rfc5322LabelTooLong);
                        }

                        // CFWS is OK again now we're at the beginning of an element (although
                        // it may be obsolete CFWS)
                        assertEnd = false;
                        elementLength = 0;
                        ++elementCount;
                        atomData.domains[elementCount] = '';
                        parseData.domain += token;

                        break;

                        // Domain literal
                    case '[':
                        if (parseData.domain.length === 0) {
                            // Domain literal must be the only component
                            assertEnd = true;
                            ++elementLength;
                            context.stack.push(context.now);
                            context.now = internals.components.literal;
                            parseData.domain += token;
                            atomData.domains[elementCount] += token;
                            parseData.literal = '';
                        }
                        else {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }

                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        if (elementLength === 0) {
                            updateResult(elementCount === 0 ? internals.diagnoses.deprecatedCFWSNearAt : internals.diagnoses.deprecatedFWS);
                        }
                        else {
                            // We can't start FWS in the middle of an element, so this better be the end
                            updateResult(internals.diagnoses.cfwsFWS);
                            assertEnd = true;
                        }

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // This must be ATEXT
                    default:
                        // RFC 5322 allows any atext...
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //    atext = ALPHA / DIGIT / ; Printable US-ASCII
                        //            "!" / "#" /     ;  characters not including
                        //            "$" / "%" /     ;  specials.  Used for atoms.
                        //            "&" / "'" /
                        //            "*" / "+" /
                        //            "-" / "/" /
                        //            "=" / "?" /
                        //            "^" / "_" /
                        //            "`" / "{" /
                        //            "|" / "}" /
                        //            "~"

                        // But RFC 5321 only allows letter-digit-hyphen to comply with DNS rules
                        //   (RFCs 1034 & 1123)
                        // http://tools.ietf.org/html/rfc5321#section-4.1.2
                        //   sub-domain     = Let-dig [Ldh-str]
                        //
                        //   Let-dig        = ALPHA / DIGIT
                        //
                        //   Ldh-str        = *( ALPHA / DIGIT / "-" ) Let-dig
                        //
                        if (assertEnd) {
                            // We have encountered ATEXT where it is no longer valid
                            switch (context.prev) {
                                case internals.components.contextComment:
                                case internals.components.contextFWS:
                                    updateResult(internals.diagnoses.errATEXTAfterCFWS);
                                    break;

                                case internals.components.literal:
                                    updateResult(internals.diagnoses.errATEXTAfterDomainLiteral);
                                    break;

                                    // $lab:coverage:off$
                                default:
                                    throw new Error('more atext found where none is allowed, but unrecognized prev context: ' + context.prev);
                                    // $lab:coverage:on$
                            }
                        }

                        charCode = token.charCodeAt(0);
                        // Assume this token isn't a hyphen unless we discover it is
                        hyphenFlag = false;

                        if (charCode < 33 || charCode > 126 || internals.specials(charCode)) {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingATEXT);
                        }
                        else if (token === '-') {
                            if (elementLength === 0) {
                                // Hyphens cannot be at the beginning of a subdomain, fatal error
                                updateResult(internals.diagnoses.errDomainHyphenStart);
                            }

                            hyphenFlag = true;
                        }
                            // Check if it's a neither a number nor a latin letter
                        else if (charCode < 48 || charCode > 122 || (charCode > 57 && charCode < 65) || (charCode > 90 && charCode < 97)) {
                            // This is not an RFC 5321 subdomain, but still OK by RFC 5322
                            updateResult(internals.diagnoses.rfc5322Domain);
                        }

                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                }

                break;

                // Domain literal
            case internals.components.literal:
                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   domain-literal  =   [CFWS] "[" *([FWS] dtext) [FWS] "]" [CFWS]
                //
                //   dtext           =   %d33-90 /          ; Printable US-ASCII
                //                       %d94-126 /         ;  characters not including
                //                       obs-dtext          ;  "[", "]", or "\"
                //
                //   obs-dtext       =   obs-NO-WS-CTL / quoted-pair
                switch (token) {
                    // End of domain literal
                    case ']':
                        if (maxResult < internals.categories.deprecated) {
                            // Could be a valid RFC 5321 address literal, so let's check

                            // http://tools.ietf.org/html/rfc5321#section-4.1.2
                            //   address-literal  = "[" ( IPv4-address-literal /
                            //                    IPv6-address-literal /
                            //                    General-address-literal ) "]"
                            //                    ; See Section 4.1.3
                            //
                            // http://tools.ietf.org/html/rfc5321#section-4.1.3
                            //   IPv4-address-literal  = Snum 3("."  Snum)
                            //
                            //   IPv6-address-literal  = "IPv6:" IPv6-addr
                            //
                            //   General-address-literal  = Standardized-tag ":" 1*dcontent
                            //
                            //   Standardized-tag  = Ldh-str
                            //                     ; Standardized-tag MUST be specified in a
                            //                     ; Standards-Track RFC and registered with IANA
                            //
                            //   dcontent      = %d33-90 / ; Printable US-ASCII
                            //                 %d94-126 ; excl. "[", "\", "]"
                            //
                            //   Snum          = 1*3DIGIT
                            //                 ; representing a decimal integer
                            //                 ; value in the range 0 through 255
                            //
                            //   IPv6-addr     = IPv6-full / IPv6-comp / IPv6v4-full / IPv6v4-comp
                            //
                            //   IPv6-hex      = 1*4HEXDIG
                            //
                            //   IPv6-full     = IPv6-hex 7(":" IPv6-hex)
                            //
                            //   IPv6-comp     = [IPv6-hex *5(":" IPv6-hex)] "::"
                            //                 [IPv6-hex *5(":" IPv6-hex)]
                            //                 ; The "::" represents at least 2 16-bit groups of
                            //                 ; zeros.  No more than 6 groups in addition to the
                            //                 ; "::" may be present.
                            //
                            //   IPv6v4-full   = IPv6-hex 5(":" IPv6-hex) ":" IPv4-address-literal
                            //
                            //   IPv6v4-comp   = [IPv6-hex *3(":" IPv6-hex)] "::"
                            //                 [IPv6-hex *3(":" IPv6-hex) ":"]
                            //                 IPv4-address-literal
                            //                 ; The "::" represents at least 2 16-bit groups of
                            //                 ; zeros.  No more than 4 groups in addition to the
                            //                 ; "::" and IPv4-address-literal may be present.

                            let index = -1;
                            let addressLiteral = parseData.literal;
                            const matchesIP = internals.regex.ipV4.exec(addressLiteral);

                            // Maybe extract IPv4 part from the end of the address-literal
                            if (matchesIP) {
                                index = matchesIP.index;
                                if (index !== 0) {
                                    // Convert IPv4 part to IPv6 format for futher testing
                                    addressLiteral = addressLiteral.slice(0, index) + '0:0';
                                }
                            }

                            if (index === 0) {
                                // Nothing there except a valid IPv4 address, so...
                                updateResult(internals.diagnoses.rfc5321AddressLiteral);
                            }
                            else if (addressLiteral.slice(0, 5).toLowerCase() !== 'ipv6:') {
                                updateResult(internals.diagnoses.rfc5322DomainLiteral);
                            }
                            else {
                                const match = addressLiteral.slice(5);
                                let maxGroups = internals.maxIPv6Groups;
                                const groups = match.split(':');
                                index = match.indexOf('::');

                                if (!~index) {
                                    // Need exactly the right number of groups
                                    if (groups.length !== maxGroups) {
                                        updateResult(internals.diagnoses.rfc5322IPv6GroupCount);
                                    }
                                }
                                else if (index !== match.lastIndexOf('::')) {
                                    updateResult(internals.diagnoses.rfc5322IPv62x2xColon);
                                }
                                else {
                                    if (index === 0 || index === match.length - 2) {
                                        // RFC 4291 allows :: at the start or end of an address with 7 other groups in addition
                                        ++maxGroups;
                                    }

                                    if (groups.length > maxGroups) {
                                        updateResult(internals.diagnoses.rfc5322IPv6MaxGroups);
                                    }
                                    else if (groups.length === maxGroups) {
                                        // Eliding a single "::"
                                        updateResult(internals.diagnoses.deprecatedIPv6);
                                    }
                                }

                                // IPv6 testing strategy
                                if (match[0] === ':' && match[1] !== ':') {
                                    updateResult(internals.diagnoses.rfc5322IPv6ColonStart);
                                }
                                else if (match[match.length - 1] === ':' && match[match.length - 2] !== ':') {
                                    updateResult(internals.diagnoses.rfc5322IPv6ColonEnd);
                                }
                                else if (internals.checkIpV6(groups)) {
                                    updateResult(internals.diagnoses.rfc5321AddressLiteral);
                                }
                                else {
                                    updateResult(internals.diagnoses.rfc5322IPv6BadCharacter);
                                }
                            }
                        }
                        else {
                            updateResult(internals.diagnoses.rfc5322DomainLiteral);
                        }

                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                    case '\\':
                        updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        updateResult(internals.diagnoses.cfwsFWS);

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // DTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.4.1
                        //   dtext         =   %d33-90 /  ; Printable US-ASCII
                        //                     %d94-126 / ;  characters not including
                        //                     obs-dtext  ;  "[", "]", or "\"
                        //
                        //   obs-dtext     =   obs-NO-WS-CTL / quoted-pair
                        //
                        //   obs-NO-WS-CTL =   %d1-8 /    ; US-ASCII control
                        //                     %d11 /     ;  characters that do not
                        //                     %d12 /     ;  include the carriage
                        //                     %d14-31 /  ;  return, line feed, and
                        //                     %d127      ;  white space characters
                        charCode = token.charCodeAt(0);

                        // '\r', '\n', ' ', and '\t' have already been parsed above
                        if (charCode > 127 || charCode === 0 || token === '[') {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingDTEXT);
                            break;
                        }
                        else if (charCode < 33 || charCode === 127) {
                            updateResult(internals.diagnoses.rfc5322DomainLiteralOBSDText);
                        }

                        parseData.literal += token;
                        parseData.domain += token;
                        atomData.domains[elementCount] += token;
                        ++elementLength;
                }

                break;

                // Quoted string
            case internals.components.contextQuotedString:
                // http://tools.ietf.org/html/rfc5322#section-3.2.4
                //   quoted-string = [CFWS]
                //                   DQUOTE *([FWS] qcontent) [FWS] DQUOTE
                //                   [CFWS]
                //
                //   qcontent      = qtext / quoted-pair
                switch (token) {
                    // Quoted pair
                    case '\\':
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space. Spaces are allowed as regular characters inside a quoted string - it's only FWS if we include '\t' or '\r\n'
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case '\t':
                        // http://tools.ietf.org/html/rfc5322#section-3.2.2
                        //   Runs of FWS, comment, or CFWS that occur between lexical tokens in
                        //   a structured header field are semantically interpreted as a single
                        //   space character.

                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
                        //   the CRLF in any FWS/CFWS that appears within the quoted-string [is]
                        //   semantically "invisible" and therefore not part of the
                        //   quoted-string

                        parseData.local += ' ';
                        atomData.locals[elementCount] += ' ';
                        ++elementLength;

                        updateResult(internals.diagnoses.cfwsFWS);
                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // End of quoted string
                    case '"':
                        parseData.local += token;
                        atomData.locals[elementCount] += token;
                        ++elementLength;
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                        // QTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.4
                        //   qtext          =   %d33 /             ; Printable US-ASCII
                        //                      %d35-91 /          ;  characters not including
                        //                      %d93-126 /         ;  "\" or the quote character
                        //                      obs-qtext
                        //
                        //   obs-qtext      =   obs-NO-WS-CTL
                        //
                        //   obs-NO-WS-CTL  =   %d1-8 /            ; US-ASCII control
                        //                      %d11 /             ;  characters that do not
                        //                      %d12 /             ;  include the carriage
                        //                      %d14-31 /          ;  return, line feed, and
                        //                      %d127              ;  white space characters
                        charCode = token.charCodeAt(0);

                        if (charCode > 127 || charCode === 0 || charCode === 10) {
                            updateResult(internals.diagnoses.errExpectingQTEXT);
                        }
                        else if (charCode < 32 || charCode === 127) {
                            updateResult(internals.diagnoses.deprecatedQTEXT);
                        }

                        parseData.local += token;
                        atomData.locals[elementCount] += token;
                        ++elementLength;
                }

                // http://tools.ietf.org/html/rfc5322#section-3.4.1
                //   If the string can be represented as a dot-atom (that is, it contains
                //   no characters other than atext characters or "." surrounded by atext
                //   characters), then the dot-atom form SHOULD be used and the quoted-
                //   string form SHOULD NOT be used.

                break;
                // Quoted pair
            case internals.components.contextQuotedPair:
                // http://tools.ietf.org/html/rfc5322#section-3.2.1
                //   quoted-pair     =   ("\" (VCHAR / WSP)) / obs-qp
                //
                //   VCHAR           =  %d33-126   ; visible (printing) characters
                //   WSP             =  SP / HTAB  ; white space
                //
                //   obs-qp          =   "\" (%d0 / obs-NO-WS-CTL / LF / CR)
                //
                //   obs-NO-WS-CTL   =   %d1-8 /   ; US-ASCII control
                //                       %d11 /    ;  characters that do not
                //                       %d12 /    ;  include the carriage
                //                       %d14-31 / ;  return, line feed, and
                //                       %d127     ;  white space characters
                //
                // i.e. obs-qp       =  "\" (%d0-8, %d10-31 / %d127)
                charCode = token.charCodeAt(0);

                if (charCode > 127) {
                    // Fatal error
                    updateResult(internals.diagnoses.errExpectingQPair);
                }
                else if ((charCode < 31 && charCode !== 9) || charCode === 127) {
                    // ' ' and '\t' are allowed
                    updateResult(internals.diagnoses.deprecatedQP);
                }

                // At this point we know where this qpair occurred so we could check to see if the character actually needed to be quoted at all.
                // http://tools.ietf.org/html/rfc5321#section-4.1.2
                //   the sending system SHOULD transmit the form that uses the minimum quoting possible.

                context.prev = context.now;
                // End of qpair
                context.now = context.stack.pop();
                token = '\\' + token;

                switch (context.now) {
                    case internals.components.contextComment:
                        break;

                    case internals.components.contextQuotedString:
                        parseData.local += token;
                        atomData.locals[elementCount] += token;

                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
                        elementLength += 2;
                        break;

                    case internals.components.literal:
                        parseData.domain += token;
                        atomData.domains[elementCount] += token;

                        // The maximum sizes specified by RFC 5321 are octet counts, so we must include the backslash
                        elementLength += 2;
                        break;

                        // $lab:coverage:off$
                    default:
                        throw new Error('quoted pair logic invoked in an invalid context: ' + context.now);
                        // $lab:coverage:on$
                }
                break;

                // Comment
            case internals.components.contextComment:
                // http://tools.ietf.org/html/rfc5322#section-3.2.2
                //   comment  = "(" *([FWS] ccontent) [FWS] ")"
                //
                //   ccontent = ctext / quoted-pair / comment
                switch (token) {
                    // Nested comment
                    case '(':
                        // Nested comments are ok
                        context.stack.push(context.now);
                        context.now = internals.components.contextComment;
                        break;

                        // End of comment
                    case ')':
                        context.prev = context.now;
                        context.now = context.stack.pop();
                        break;

                        // Quoted pair
                    case '\\':
                        context.stack.push(context.now);
                        context.now = internals.components.contextQuotedPair;
                        break;

                        // Folding white space
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                            break;
                        }

                        // Fallthrough

                    case ' ':
                    case '\t':
                        updateResult(internals.diagnoses.cfwsFWS);

                        context.stack.push(context.now);
                        context.now = internals.components.contextFWS;
                        prevToken = token;
                        break;

                        // CTEXT
                    default:
                        // http://tools.ietf.org/html/rfc5322#section-3.2.3
                        //   ctext         = %d33-39 /  ; Printable US-ASCII
                        //                   %d42-91 /  ;  characters not including
                        //                   %d93-126 / ;  "(", ")", or "\"
                        //                   obs-ctext
                        //
                        //   obs-ctext     = obs-NO-WS-CTL
                        //
                        //   obs-NO-WS-CTL = %d1-8 /    ; US-ASCII control
                        //                   %d11 /     ;  characters that do not
                        //                   %d12 /     ;  include the carriage
                        //                   %d14-31 /  ;  return, line feed, and
                        //                   %d127      ;  white space characters
                        charCode = token.charCodeAt(0);

                        if (charCode > 127 || charCode === 0 || charCode === 10) {
                            // Fatal error
                            updateResult(internals.diagnoses.errExpectingCTEXT);
                            break;
                        }
                        else if (charCode < 32 || charCode === 127) {
                            updateResult(internals.diagnoses.deprecatedCTEXT);
                        }
                }

                break;

                // Folding white space
            case internals.components.contextFWS:
                // http://tools.ietf.org/html/rfc5322#section-3.2.2
                //   FWS     =   ([*WSP CRLF] 1*WSP) /  obs-FWS
                //                                   ; Folding white space

                // But note the erratum:
                // http://www.rfc-editor.org/errata_search.php?rfc=5322&eid=1908:
                //   In the obsolete syntax, any amount of folding white space MAY be
                //   inserted where the obs-FWS rule is allowed.  This creates the
                //   possibility of having two consecutive "folds" in a line, and
                //   therefore the possibility that a line which makes up a folded header
                //   field could be composed entirely of white space.
                //
                //   obs-FWS =   1*([CRLF] WSP)

                if (prevToken === '\r') {
                    if (token === '\r') {
                        // Fatal error
                        updateResult(internals.diagnoses.errFWSCRLFx2);
                        break;
                    }

                    if (++crlfCount > 1) {
                        // Multiple folds => obsolete FWS
                        updateResult(internals.diagnoses.deprecatedFWS);
                    }
                    else {
                        crlfCount = 1;
                    }
                }

                switch (token) {
                    case '\r':
                        if (emailLength === ++i || email[i] !== '\n') {
                            // Fatal error
                            updateResult(internals.diagnoses.errCRNoLF);
                        }

                        break;

                    case ' ':
                    case '\t':
                        break;

                    default:
                        if (prevToken === '\r') {
                            // Fatal error
                            updateResult(internals.diagnoses.errFWSCRLFEnd);
                        }

                        crlfCount = 0;

                        // End of FWS
                        context.prev = context.now;
                        context.now = context.stack.pop();

                        // Look at this token again in the parent context
                        --i;
                }

                prevToken = token;
                break;

                // Unexpected context
                // $lab:coverage:off$
            default:
                throw new Error('unknown context: ' + context.now);
                // $lab:coverage:on$
        } // Primary state machine

        if (maxResult > internals.categories.rfc5322) {
            // Fatal error, no point continuing
            break;
        }
    } // Token loop

    // Check for errors
    if (maxResult < internals.categories.rfc5322) {
        // Fatal errors
        if (context.now === internals.components.contextQuotedString) {
            updateResult(internals.diagnoses.errUnclosedQuotedString);
        }
        else if (context.now === internals.components.contextQuotedPair) {
            updateResult(internals.diagnoses.errBackslashEnd);
        }
        else if (context.now === internals.components.contextComment) {
            updateResult(internals.diagnoses.errUnclosedComment);
        }
        else if (context.now === internals.components.literal) {
            updateResult(internals.diagnoses.errUnclosedDomainLiteral);
        }
        else if (token === '\r') {
            updateResult(internals.diagnoses.errFWSCRLFEnd);
        }
        else if (parseData.domain.length === 0) {
            updateResult(internals.diagnoses.errNoDomain);
        }
        else if (elementLength === 0) {
            updateResult(internals.diagnoses.errDotEnd);
        }
        else if (hyphenFlag) {
            updateResult(internals.diagnoses.errDomainHyphenEnd);
        }

            // Other errors
        else if (parseData.domain.length > 255) {
            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.2
            //   The maximum total length of a domain name or number is 255 octets.
            updateResult(internals.diagnoses.rfc5322DomainTooLong);
        }
        else if (parseData.local.length + parseData.domain.length + /* '@' */ 1 > 254) {
            // http://tools.ietf.org/html/rfc5321#section-4.1.2
            //   Forward-path   = Path
            //
            //   Path           = "<" [ A-d-l ":" ] Mailbox ">"
            //
            // http://tools.ietf.org/html/rfc5321#section-4.5.3.1.3
            //   The maximum total length of a reverse-path or forward-path is 256 octets (including the punctuation and element separators).
            //
            // Thus, even without (obsolete) routing information, the Mailbox can only be 254 characters long. This is confirmed by this verified
            // erratum to RFC 3696:
            //
            // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
            //   However, there is a restriction in RFC 2821 on the length of an address in MAIL and RCPT commands of 254 characters.  Since
            //   addresses that do not fit in those fields are not normally useful, the upper limit on address lengths should normally be considered
            //   to be 254.
            updateResult(internals.diagnoses.rfc5322TooLong);
        }
        else if (elementLength > 63) {
            // http://tools.ietf.org/html/rfc1035#section-2.3.4
            // labels   63 octets or less
            updateResult(internals.diagnoses.rfc5322LabelTooLong);
        }
        else if (options.minDomainAtoms && atomData.domains.length < options.minDomainAtoms) {
            updateResult(internals.diagnoses.errDomainTooShort);
        }
        else if (options.tldWhitelist || options.tldBlacklist) {
            const tldAtom = atomData.domains[elementCount];

            if (!internals.validDomain(tldAtom, options)) {
                updateResult(internals.diagnoses.errUnknownTLD);
            }
        }
    } // Check for errors

    let dnsPositive = false;
    let finishImmediately = false;

    const finish = () => {

        if (!dnsPositive && maxResult < internals.categories.dnsWarn) {
            // Per RFC 5321, domain atoms are limited to letter-digit-hyphen, so we only need to check code <= 57 to check for a digit
            const code = atomData.domains[elementCount].charCodeAt(0);
            if (code <= 57) {
                updateResult(internals.diagnoses.rfc5321TLDNumeric);
            }
            else if (elementCount === 0) {
                updateResult(internals.diagnoses.rfc5321TLD);
            }
        }

        if (maxResult < threshold) {
            maxResult = internals.diagnoses.valid;
        }

        const finishResult = diagnose ? maxResult : maxResult < internals.defaultThreshold;

        if (callback) {
            if (finishImmediately) {
                callback(finishResult);
            }
            else {
                internals.defer(callback.bind(null, finishResult));
            }
        }

        return finishResult;
    }; // Finish

    if (options.checkDNS && maxResult < internals.categories.dnsWarn) {
        // http://tools.ietf.org/html/rfc5321#section-2.3.5
        //   Names that can be resolved to MX RRs or address (i.e., A or AAAA) RRs (as discussed in Section 5) are permitted, as are CNAME RRs whose
        //   targets can be resolved, in turn, to MX or address RRs.
        //
        // http://tools.ietf.org/html/rfc5321#section-5.1
        //   The lookup first attempts to locate an MX record associated with the name.  If a CNAME record is found, the resulting name is processed
        //   as if it were the initial name. ... If an empty list of MXs is returned, the address is treated as if it was associated with an implicit
        //   MX RR, with a preference of 0, pointing to that host.
        //
        // isEmail() author's note: We will regard the existence of a CNAME to be sufficient evidence of the domain's existence. For performance
        // reasons we will not repeat the DNS lookup for the CNAME's target, but we will raise a warning because we didn't immediately find an MX
        // record.
        if (elementCount === 0) {
            // Checking TLD DNS only works if you explicitly check from the root
            parseData.domain += '.';
        }

        const dnsDomain = parseData.domain;
        Dns.resolveMx(dnsDomain, (err, mxRecords) => {

            // If we have a fatal error, then we must assume that there are no records
            if (err && err.code !== Dns.NODATA) {
                updateResult(internals.diagnoses.dnsWarnNoRecord);
                return finish();
            }

            if (mxRecords && mxRecords.length) {
                dnsPositive = true;
                return finish();
            }

            let count = 3;
            let done = false;
            updateResult(internals.diagnoses.dnsWarnNoMXRecord);

            const handleRecords = (ignoreError, records) => {

                if (done) {
                    return;
                }

                --count;

                if (records && records.length) {
                    done = true;
                    return finish();
                }

                if (count === 0) {
                    // No usable records for the domain can be found
                    updateResult(internals.diagnoses.dnsWarnNoRecord);
                    done = true;
                    finish();
                }
            };

            Dns.resolveCname(dnsDomain, handleRecords);
            Dns.resolve4(dnsDomain, handleRecords);
            Dns.resolve6(dnsDomain, handleRecords);
        });

        finishImmediately = true;
    }
    else {
        const result = finish();
        finishImmediately = true;
        return result;
    } // CheckDNS
};


exports.diagnoses = internals.validate.diagnoses = (function () {

    const diag = {};
    const keys = Object.keys(internals.diagnoses);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        diag[key] = internals.diagnoses[key];
    }

    return diag;
})();


/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Joi = __webpack_require__(3);


// Declare internals

const internals = {};

exports.options = Joi.object({
    abortEarly: Joi.boolean(),
    convert: Joi.boolean(),
    allowUnknown: Joi.boolean(),
    skipFunctions: Joi.boolean(),
    stripUnknown: [Joi.boolean(), Joi.object({ arrays: Joi.boolean(), objects: Joi.boolean() }).or('arrays', 'objects')],
    language: Joi.object(),
    presence: Joi.string().only('required', 'optional', 'forbidden', 'ignore'),
    raw: Joi.boolean(),
    context: Joi.object(),
    strip: Joi.boolean(),
    noDefaults: Joi.boolean()
}).strict();


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


internals.Lazy = class extends Any {

    constructor() {

        super();
        this._type = 'lazy';
    }

    _base(value, state, options) {

        const result = { value };
        const lazy = this._flags.lazy;

        if (!lazy) {
            result.errors = this.createError('lazy.base', null, state, options);
            return result;
        }

        const schema = lazy();

        if (!(schema instanceof Any)) {
            result.errors = this.createError('lazy.schema', null, state, options);
            return result;
        }

        return schema._validate(value, state, options);
    }

    set(fn) {

        Hoek.assert(typeof fn === 'function', 'You must provide a function as first argument');

        const obj = this.clone();
        obj._flags.lazy = fn;
        return obj;
    }

};

module.exports = new internals.Lazy();


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Cast = __webpack_require__(8);
const Ref = __webpack_require__(5);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


internals.fastSplice = function (arr, i) {

    let pos = i;
    while (pos < arr.length) {
        arr[pos++] = arr[pos];
    }

    --arr.length;
};


internals.Array = class extends Any {

    constructor() {

        super();
        this._type = 'array';
        this._inner.items = [];
        this._inner.ordereds = [];
        this._inner.inclusions = [];
        this._inner.exclusions = [];
        this._inner.requireds = [];
        this._flags.sparse = false;
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            internals.safeParse(value, result);
        }

        let isArray = Array.isArray(result.value);
        const wasArray = isArray;
        if (options.convert && this._flags.single && !isArray) {
            result.value = [result.value];
            isArray = true;
        }

        if (!isArray) {
            result.errors = this.createError('array.base', null, state, options);
            return result;
        }

        if (this._inner.inclusions.length ||
            this._inner.exclusions.length ||
            this._inner.requireds.length ||
            this._inner.ordereds.length ||
            !this._flags.sparse) {

            // Clone the array so that we don't modify the original
            if (wasArray) {
                result.value = result.value.slice(0);
            }

            result.errors = this._checkItems.call(this, result.value, wasArray, state, options);

            if (result.errors && wasArray && options.convert && this._flags.single) {

                // Attempt a 2nd pass by putting the array inside one.
                const previousErrors = result.errors;

                result.value = [result.value];
                result.errors = this._checkItems.call(this, result.value, wasArray, state, options);

                if (result.errors) {

                    // Restore previous errors and value since this didn't validate either.
                    result.errors = previousErrors;
                    result.value = result.value[0];
                }
            }
        }

        return result;
    }

    _checkItems(items, wasArray, state, options) {

        const errors = [];
        let errored;

        const requireds = this._inner.requireds.slice();
        const ordereds = this._inner.ordereds.slice();
        const inclusions = this._inner.inclusions.concat(requireds);

        let il = items.length;
        for (let i = 0; i < il; ++i) {
            errored = false;
            const item = items[i];
            let isValid = false;
            const key = wasArray ? i : state.key;
            const path = wasArray ? (state.path ? state.path + '.' : '') + i : state.path;
            const localState = { key, path, parent: state.parent, reference: state.reference };
            let res;

            // Sparse

            if (!this._flags.sparse && item === undefined) {
                errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                if (options.abortEarly) {
                    return errors;
                }

                continue;
            }

            // Exclusions

            for (let j = 0; j < this._inner.exclusions.length; ++j) {
                res = this._inner.exclusions[j]._validate(item, localState, {});                // Not passing options to use defaults

                if (!res.errors) {
                    errors.push(this.createError(wasArray ? 'array.excludes' : 'array.excludesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));
                    errored = true;

                    if (options.abortEarly) {
                        return errors;
                    }

                    break;
                }
            }

            if (errored) {
                continue;
            }

            // Ordered
            if (this._inner.ordereds.length) {
                if (ordereds.length > 0) {
                    const ordered = ordereds.shift();
                    res = ordered._validate(item, localState, options);
                    if (!res.errors) {
                        if (ordered._flags.strip) {
                            internals.fastSplice(items, i);
                            --i;
                            --il;
                        }
                        else if (!this._flags.sparse && res.value === undefined) {
                            errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                            if (options.abortEarly) {
                                return errors;
                            }

                            continue;
                        }
                        else {
                            items[i] = res.value;
                        }
                    }
                    else {
                        errors.push(this.createError('array.ordered', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                        if (options.abortEarly) {
                            return errors;
                        }
                    }
                    continue;
                }
                else if (!this._inner.items.length) {
                    errors.push(this.createError('array.orderedLength', { pos: i, limit: this._inner.ordereds.length }, { key: state.key, path: localState.path }, options));
                    if (options.abortEarly) {
                        return errors;
                    }
                    continue;
                }
            }

            // Requireds

            const requiredChecks = [];
            let jl = requireds.length;
            for (let j = 0; j < jl; ++j) {
                res = requiredChecks[j] = requireds[j]._validate(item, localState, options);
                if (!res.errors) {
                    items[i] = res.value;
                    isValid = true;
                    internals.fastSplice(requireds, j);
                    --j;
                    --jl;

                    if (!this._flags.sparse && res.value === undefined) {
                        errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));

                        if (options.abortEarly) {
                            return errors;
                        }
                    }

                    break;
                }
            }

            if (isValid) {
                continue;
            }

            // Inclusions

            const stripUnknown = options.stripUnknown
                ? (options.stripUnknown === true ? true : !!options.stripUnknown.arrays)
                : false;

            jl = inclusions.length;
            for (let j = 0; j < jl; ++j) {
                const inclusion = inclusions[j];

                // Avoid re-running requireds that already didn't match in the previous loop
                const previousCheck = requireds.indexOf(inclusion);
                if (previousCheck !== -1) {
                    res = requiredChecks[previousCheck];
                }
                else {
                    res = inclusion._validate(item, localState, options);

                    if (!res.errors) {
                        if (inclusion._flags.strip) {
                            internals.fastSplice(items, i);
                            --i;
                            --il;
                        }
                        else if (!this._flags.sparse && res.value === undefined) {
                            errors.push(this.createError('array.sparse', null, { key: state.key, path: localState.path, pos: i }, options));
                            errored = true;
                        }
                        else {
                            items[i] = res.value;
                        }
                        isValid = true;
                        break;
                    }
                }

                // Return the actual error if only one inclusion defined
                if (jl === 1) {
                    if (stripUnknown) {
                        internals.fastSplice(items, i);
                        --i;
                        --il;
                        isValid = true;
                        break;
                    }

                    errors.push(this.createError(wasArray ? 'array.includesOne' : 'array.includesOneSingle', { pos: i, reason: res.errors, value: item }, { key: state.key, path: localState.path }, options));
                    errored = true;

                    if (options.abortEarly) {
                        return errors;
                    }

                    break;
                }
            }

            if (errored) {
                continue;
            }

            if (this._inner.inclusions.length && !isValid) {
                if (stripUnknown) {
                    internals.fastSplice(items, i);
                    --i;
                    --il;
                    continue;
                }

                errors.push(this.createError(wasArray ? 'array.includes' : 'array.includesSingle', { pos: i, value: item }, { key: state.key, path: localState.path }, options));

                if (options.abortEarly) {
                    return errors;
                }
            }
        }

        if (requireds.length) {
            this._fillMissedErrors.call(this, errors, requireds, state, options);
        }

        if (ordereds.length) {
            this._fillOrderedErrors.call(this, errors, ordereds, state, options);
        }

        return errors.length ? errors : null;
    }

    describe() {

        const description = Any.prototype.describe.call(this);

        if (this._inner.ordereds.length) {
            description.orderedItems = [];

            for (let i = 0; i < this._inner.ordereds.length; ++i) {
                description.orderedItems.push(this._inner.ordereds[i].describe());
            }
        }

        if (this._inner.items.length) {
            description.items = [];

            for (let i = 0; i < this._inner.items.length; ++i) {
                description.items.push(this._inner.items[i].describe());
            }
        }

        return description;
    }

    items() {

        const obj = this.clone();

        Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {

            try {
                type = Cast.schema(type);
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = index + '.' + castErr.path;
                }
                else {
                    castErr.path = index;
                }
                castErr.message = castErr.message + '(' + castErr.path + ')';
                throw castErr;
            }

            obj._inner.items.push(type);

            if (type._flags.presence === 'required') {
                obj._inner.requireds.push(type);
            }
            else if (type._flags.presence === 'forbidden') {
                obj._inner.exclusions.push(type.optional());
            }
            else {
                obj._inner.inclusions.push(type);
            }
        });

        return obj;
    }

    ordered() {

        const obj = this.clone();

        Hoek.flatten(Array.prototype.slice.call(arguments)).forEach((type, index) => {

            try {
                type = Cast.schema(type);
            }
            catch (castErr) {
                if (castErr.hasOwnProperty('path')) {
                    castErr.path = index + '.' + castErr.path;
                }
                else {
                    castErr.path = index;
                }
                castErr.message = castErr.message + '(' + castErr.path + ')';
                throw castErr;
            }
            obj._inner.ordereds.push(type);
        });

        return obj;
    }

    min(limit) {

        const isRef = Ref.isRef(limit);

        Hoek.assert((Number.isSafeInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');

        return this._test('min', limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!(Number.isSafeInteger(compareTo) && compareTo >= 0)) {
                    return this.createError('array.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (value.length >= compareTo) {
                return value;
            }

            return this.createError('array.min', { limit, value }, state, options);
        });
    }

    max(limit) {

        const isRef = Ref.isRef(limit);

        Hoek.assert((Number.isSafeInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');

        return this._test('max', limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!(Number.isSafeInteger(compareTo) && compareTo >= 0)) {
                    return this.createError('array.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (value.length <= compareTo) {
                return value;
            }

            return this.createError('array.max', { limit, value }, state, options);
        });
    }

    length(limit) {

        const isRef = Ref.isRef(limit);

        Hoek.assert((Number.isSafeInteger(limit) && limit >= 0) || isRef, 'limit must be a positive integer or reference');

        return this._test('length', limit, function (value, state, options) {

            let compareTo;
            if (isRef) {
                compareTo = limit(state.reference || state.parent, options);

                if (!(Number.isSafeInteger(compareTo) && compareTo >= 0)) {
                    return this.createError('array.ref', { ref: limit.key }, state, options);
                }
            }
            else {
                compareTo = limit;
            }

            if (value.length === compareTo) {
                return value;
            }

            return this.createError('array.length', { limit, value }, state, options);
        });
    }

    unique(comparator) {

        Hoek.assert(comparator === undefined ||
            typeof comparator === 'function' ||
            typeof comparator === 'string', 'comparator must be a function or a string');

        const settings = {};

        if (typeof comparator === 'string') {
            settings.path = comparator;
        }
        else if (typeof comparator === 'function') {
            settings.comparator = comparator;
        }

        return this._test('unique', settings, function (value, state, options) {

            const found = {
                string: {},
                number: {},
                undefined: {},
                boolean: {},
                object: new Map(),
                function: new Map(),
                custom: new Map()
            };

            const compare = settings.comparator || Hoek.deepEqual;

            for (let i = 0; i < value.length; ++i) {
                const item = settings.path ? Hoek.reach(value[i], settings.path) : value[i];
                const records = settings.comparator ? found.custom : found[typeof item];

                // All available types are supported, so it's not possible to reach 100% coverage without ignoring this line.
                // I still want to keep the test for future js versions with new types (eg. Symbol).
                if (/* $lab:coverage:off$ */ records /* $lab:coverage:on$ */) {
                    if (records instanceof Map) {
                        const entries = records.entries();
                        let current;
                        while (!(current = entries.next()).done) {
                            if (compare(current.value[0], item)) {
                                const localState = {
                                    key: state.key,
                                    path: (state.path ? state.path + '.' : '') + i,
                                    parent: state.parent,
                                    reference: state.reference
                                };

                                const context = {
                                    pos: i,
                                    value: value[i],
                                    dupePos: current.value[1],
                                    dupeValue: value[current.value[1]]
                                };

                                if (settings.path) {
                                    context.path = settings.path;
                                }

                                return this.createError('array.unique', context, localState, options);
                            }
                        }

                        records.set(item, i);
                    }
                    else {
                        if (records[item] !== undefined) {
                            const localState = {
                                key: state.key,
                                path: (state.path ? state.path + '.' : '') + i,
                                parent: state.parent,
                                reference: state.reference
                            };

                            const context = {
                                pos: i,
                                value: value[i],
                                dupePos: records[item],
                                dupeValue: value[records[item]]
                            };

                            if (settings.path) {
                                context.path = settings.path;
                            }

                            return this.createError('array.unique', context, localState, options);
                        }

                        records[item] = i;
                    }
                }
            }

            return value;
        });
    }

    sparse(enabled) {

        const value = enabled === undefined ? true : !!enabled;

        if (this._flags.sparse === value) {
            return this;
        }

        const obj = this.clone();
        obj._flags.sparse = value;
        return obj;
    }

    single(enabled) {

        const value = enabled === undefined ? true : !!enabled;

        if (this._flags.single === value) {
            return this;
        }

        const obj = this.clone();
        obj._flags.single = value;
        return obj;
    }

    _fillMissedErrors(errors, requireds, state, options) {

        const knownMisses = [];
        let unknownMisses = 0;
        for (let i = 0; i < requireds.length; ++i) {
            const label = requireds[i]._getLabel();
            if (label) {
                knownMisses.push(label);
            }
            else {
                ++unknownMisses;
            }
        }

        if (knownMisses.length) {
            if (unknownMisses) {
                errors.push(this.createError('array.includesRequiredBoth', { knownMisses, unknownMisses }, { key: state.key, path: state.path }, options));
            }
            else {
                errors.push(this.createError('array.includesRequiredKnowns', { knownMisses }, { key: state.key, path: state.path }, options));
            }
        }
        else {
            errors.push(this.createError('array.includesRequiredUnknowns', { unknownMisses }, { key: state.key, path: state.path }, options));
        }
    }


    _fillOrderedErrors(errors, ordereds, state, options) {

        const requiredOrdereds = [];

        for (let i = 0; i < ordereds.length; ++i) {
            const presence = Hoek.reach(ordereds[i], '_flags.presence');
            if (presence === 'required') {
                requiredOrdereds.push(ordereds[i]);
            }
        }

        if (requiredOrdereds.length) {
            this._fillMissedErrors.call(this, errors, requiredOrdereds, state, options);
        }
    }

};


internals.safeParse = function (value, result) {

    try {
        const converted = JSON.parse(value);
        if (Array.isArray(converted)) {
            result.value = converted;
        }
    }
    catch (e) { }
};


module.exports = new internals.Array();


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Any = __webpack_require__(4);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


internals.Binary = class extends Any {

    constructor() {

        super();
        this._type = 'binary';
    }

    _base(value, state, options) {

        const result = {
            value
        };

        if (typeof value === 'string' &&
            options.convert) {

            try {
                result.value = new Buffer(value, this._flags.encoding);
            }
            catch (e) {
            }
        }

        result.errors = Buffer.isBuffer(result.value) ? null : this.createError('binary.base', null, state, options);
        return result;
    }

    encoding(encoding) {

        Hoek.assert(Buffer.isEncoding(encoding), 'Invalid encoding:', encoding);

        if (this._flags.encoding === encoding) {
            return this;
        }

        const obj = this.clone();
        obj._flags.encoding = encoding;
        return obj;
    }

    min(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('min', limit, function (value, state, options) {

            if (value.length >= limit) {
                return value;
            }

            return this.createError('binary.min', { limit, value }, state, options);
        });
    }

    max(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('max', limit, function (value, state, options) {

            if (value.length <= limit) {
                return value;
            }

            return this.createError('binary.max', { limit, value }, state, options);
        });
    }

    length(limit) {

        Hoek.assert(Number.isSafeInteger(limit) && limit >= 0, 'limit must be a positive integer');

        return this._test('length', limit, function (value, state, options) {

            if (value.length === limit) {
                return value;
            }

            return this.createError('binary.length', { limit, value }, state, options);
        });
    }

};


module.exports = new internals.Binary();


/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = {"_from":"joi@^10.6.0","_id":"joi@10.6.0","_inBundle":false,"_integrity":"sha512-hBF3LcqyAid+9X/pwg+eXjD2QBZI5eXnBFJYaAkH4SK3mp9QSRiiQnDYlmlz5pccMvnLcJRS4whhDOTCkmsAdQ==","_location":"/joi","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"joi@^10.6.0","name":"joi","escapedName":"joi","rawSpec":"^10.6.0","saveSpec":null,"fetchSpec":"^10.6.0"},"_requiredBy":["/catbox","/hapi","/heavy","/inert","/podium","/shot","/statehood"],"_resolved":"https://registry.npmjs.org/joi/-/joi-10.6.0.tgz","_shasum":"52587f02d52b8b75cdb0c74f0b164a191a0e1fc2","_spec":"joi@^10.6.0","_where":"E:\\code\\mk\\mk-demo-helloworld\\release\\node_modules\\hapi","bugs":{"url":"https://github.com/hapijs/joi/issues"},"bundleDependencies":false,"dependencies":{"hoek":"4.x.x","isemail":"2.x.x","items":"2.x.x","topo":"2.x.x"},"deprecated":false,"description":"Object schema validation","devDependencies":{"code":"4.x.x","hapitoc":"1.x.x","lab":"13.x.x"},"engines":{"node":">=4.0.0"},"homepage":"https://github.com/hapijs/joi","keywords":["hapi","schema","validation"],"license":"BSD-3-Clause","main":"lib/index.js","name":"joi","repository":{"type":"git","url":"git://github.com/hapijs/joi.git"},"scripts":{"test":"lab -t 100 -a code -L","test-cov-html":"lab -r html -o coverage.html -a code","test-debug":"lab -a code","toc":"hapitoc","version":"npm run toc && git add API.md README.md"},"version":"10.6.0"}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


internals.defaults = {
    maxByteSize: 100 * 1024 * 1024,          // 100MB
    allowMixedContent: false
};

// Provides a named reference for memory debugging
internals.MemoryCacheSegment = function MemoryCacheSegment() {
};

internals.MemoryCacheEntry = function MemoryCacheEntry(key, value, ttl, allowMixedContent) {

    let valueByteSize = 0;

    if (allowMixedContent && Buffer.isBuffer(value)) {
        this.item = new Buffer(value.length);
        // copy buffer to prevent value from changing while in the cache
        value.copy(this.item);
        valueByteSize = this.item.length;
    }
    else {
        // stringify() to prevent value from changing while in the cache
        this.item = JSON.stringify(value);
        valueByteSize = Buffer.byteLength(this.item);
    }

    this.stored = Date.now();
    this.ttl = ttl;

    // Approximate cache entry size without value: 144 bytes
    this.byteSize = 144 + valueByteSize + Buffer.byteLength(key.segment) + Buffer.byteLength(key.id);

    this.timeoutId = null;
};


exports = module.exports = internals.Connection = function MemoryCache(options) {

    Hoek.assert(this.constructor === internals.Connection, 'Memory cache client must be instantiated using new');
    Hoek.assert(!options || options.maxByteSize === undefined || options.maxByteSize >= 0, 'Invalid cache maxByteSize value');
    Hoek.assert(!options || options.allowMixedContent === undefined || typeof options.allowMixedContent === 'boolean', 'Invalid allowMixedContent value');

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});
    this.cache = null;
};


internals.Connection.prototype.start = function (callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        this.cache = {};
        this.byteSize = 0;
    }

    return callback();
};


internals.Connection.prototype.stop = function () {

    // Clean up pending eviction timers.
    if (this.cache) {
        const segments = Object.keys(this.cache);
        for (let i = 0; i < segments.length; ++i) {
            const segment = segments[i];
            const keys = Object.keys(this.cache[segment]);
            for (let j = 0; j < keys.length; ++j) {
                const key = keys[j];
                clearTimeout(this.cache[segment][key].timeoutId);
            }
        }
    }

    this.cache = null;
    this.byteSize = 0;
    return;
};


internals.Connection.prototype.isReady = function () {

    return !!this.cache;
};


internals.Connection.prototype.validateSegmentName = function (name) {

    if (!name) {
        return new Error('Empty string');
    }

    if (name.indexOf('\u0000') !== -1) {
        return new Error('Includes null character');
    }

    return null;
};


internals.Connection.prototype.get = function (key, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    const segment = this.cache[key.segment];

    if (!segment) {
        return callback(null, null);
    }

    const envelope = segment[key.id];

    if (!envelope) {
        return callback(null, null);
    }

    let value = null;

    if (Buffer.isBuffer(envelope.item)) {
        value = envelope.item;
    }
    else {
        value = internals.parseJSON(envelope.item);

        if (value instanceof Error) {
            return callback(new Error('Bad value content'));
        }
    }

    const result = {
        item: value,
        stored: envelope.stored,
        ttl: envelope.ttl
    };

    return callback(null, result);
};


internals.Connection.prototype.set = function (key, value, ttl, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    if (ttl > 2147483647) {                                                         // Math.pow(2, 31)
        return callback(new Error('Invalid ttl (greater than 2147483647)'));
    }

    let envelope = null;
    try {
        envelope = new internals.MemoryCacheEntry(key, value, ttl, this.settings.allowMixedContent);
    }
    catch (err) {
        return callback(err);
    }

    this.cache[key.segment] = this.cache[key.segment] || new internals.MemoryCacheSegment();
    const segment = this.cache[key.segment];
    const cachedItem = segment[key.id];

    if (cachedItem && cachedItem.timeoutId) {
        clearTimeout(cachedItem.timeoutId);
        this.byteSize -= cachedItem.byteSize;                   // If the item existed, decrement the byteSize as the value could be different
    }

    if (this.settings.maxByteSize) {
        if (this.byteSize + envelope.byteSize > this.settings.maxByteSize) {
            return callback(new Error('Cache size limit reached'));
        }
    }

    const timeoutId = setTimeout(() => {

        this.drop(key, () => {});
    }, ttl);

    envelope.timeoutId = timeoutId;

    segment[key.id] = envelope;
    this.byteSize += envelope.byteSize;

    return callback(null);
};


internals.Connection.prototype.drop = function (key, callback) {

    callback = Hoek.nextTick(callback);

    if (!this.cache) {
        return callback(new Error('Connection not started'));
    }

    const segment = this.cache[key.segment];
    if (segment) {
        const item = segment[key.id];

        if (item) {
            clearTimeout(item.timeoutId);
            this.byteSize -= item.byteSize;
        }

        delete segment[key.id];
    }

    return callback();
};


internals.parseJSON = function (json) {

    let obj = null;

    try {
        obj = JSON.parse(json);
    }
    catch (err) {
        obj = err;
    }

    return obj;
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);


// Declare internals

const internals = {};


internals.schema = {
    process: Joi.object({
        sampleInterval: Joi.number().min(0)
    }),
    policy: Joi.object({
        maxHeapUsedBytes: Joi.number().min(0),
        maxEventLoopDelay: Joi.number().min(0),
        maxRssBytes: Joi.number().min(0)
    })
};


internals.defaults = {
    process: {
        sampleInterval: 0                           // Frequency of load sampling in milliseconds (zero is no sampling)
    },
    policy: {
        maxHeapUsedBytes: 0,                        // Reject requests when V8 heap is over size in bytes (zero is no max)
        maxRssBytes: 0,                             // Reject requests when process RSS is over size in bytes (zero is no max)
        maxEventLoopDelay: 0                        // Milliseconds of delay after which requests are rejected (zero is no max)
    }
};


exports = module.exports = internals.Heavy = function (options) {

    options = options || {};

    Joi.assert(options, internals.schema.process, 'Invalid load monitoring options');
    this.settings = Hoek.applyToDefaults(internals.defaults, options);

    this._eventLoopTimer = null;
    this._loadBench = new Hoek.Bench();
    this.load = {
        eventLoopDelay: 0,
        heapUsed: 0,
        rss: 0
    };
};


internals.Heavy.prototype.start = function () {

    if (!this.settings.sampleInterval) {
        return;
    }

    const loopSample = () => {

        this._loadBench.reset();
        const measure = () => {

            const mem = process.memoryUsage();

            // Retain the same this.load object to keep external references valid

            this.load.eventLoopDelay = (this._loadBench.elapsed() - this.settings.sampleInterval);
            this.load.heapUsed = mem.heapUsed;
            this.load.rss = mem.rss;

            loopSample();
        };

        this._eventLoopTimer = setTimeout(measure, this.settings.sampleInterval);
    };

    loopSample();
};


internals.Heavy.prototype.stop = function () {

    clearTimeout(this._eventLoopTimer);
    this._eventLoopTimer = null;
};


internals.Heavy.prototype.policy = function (options) {

    return new internals.Policy(this, options);
};


internals.Policy = function (process, options) {

    options = options || {};

    Joi.assert(options, internals.schema.policy, 'Invalid load monitoring options');
    Hoek.assert(process.settings.sampleInterval || (!options.maxEventLoopDelay && !options.maxHeapUsedBytes && !options.maxRssBytes), 'Load sample interval must be set to enable load limits');

    this._process = process;
    this.settings = Hoek.applyToDefaults(internals.defaults.policy, options);
};


internals.Policy.prototype.check = function () {

    if (!this._process.settings.sampleInterval) {
        return null;
    }

    Hoek.assert(this._process._eventLoopTimer, 'Cannot check load when sampler is not started');

    const elapsed = this._process._loadBench.elapsed();
    const load = this._process.load;

    if (elapsed > this._process.settings.sampleInterval) {
        load.eventLoopDelay = Math.max(load.eventLoopDelay, elapsed - this._process.settings.sampleInterval);
    }

    if (this.settings.maxEventLoopDelay &&
        load.eventLoopDelay > this.settings.maxEventLoopDelay) {

        return Boom.serverUnavailable('Server under heavy load (event loop)', load);
    }

    if (this.settings.maxHeapUsedBytes &&
        load.heapUsed > this.settings.maxHeapUsedBytes) {

        return Boom.serverUnavailable('Server under heavy load (heap)', load);
    }

    if (this.settings.maxRssBytes &&
        load.rss > this.settings.maxRssBytes) {

        return Boom.serverUnavailable('Server under heavy load (rss)', load);
    }

    return null;
};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Path = __webpack_require__(7);
const Hoek = __webpack_require__(0);
const MimeDb = __webpack_require__(73);


// Declare internals

const internals = {};


internals.compressibleRx = /^text\/|\+json$|\+text$|\+xml$/;
internals.compile = function (override) {

    const db = Hoek.clone(MimeDb);
    Hoek.merge(db, override, true, false);

    const result = {
        byType: db,
        byExtension: {}
    };

    const keys = Object.keys(result.byType);
    for (let i = 0; i < keys.length; ++i) {
        const type = keys[i];
        const mime = result.byType[type];
        mime.type = mime.type || type;
        mime.source = mime.source || 'mime-db';
        mime.extensions = mime.extensions || [];
        mime.compressible = (mime.compressible !== undefined ? mime.compressible : internals.compressibleRx.test(type));

        Hoek.assert(!mime.predicate || typeof mime.predicate === 'function', 'predicate option must be a function');

        for (let j = 0; j < mime.extensions.length; ++j) {
            const ext = mime.extensions[j];
            result.byExtension[ext] = mime;
        }
    }

    return result;
};


module.exports = class Mimos {
    constructor(options) {

        options = options || {};
        const result = options.override ? internals.compile(options.override) : internals.base;
        this._byType = result.byType;
        this._byExtension = result.byExtension;
    }
    path(path) {

        const extension = Path.extname(path).slice(1).toLowerCase();
        const mime = this._byExtension[extension] || {};

        if (mime.predicate) {
            return mime.predicate(Hoek.clone(mime));
        }

        return mime;
    }
    type(type) {

        type = type.split(';', 1)[0].trim().toLowerCase();
        let mime = this._byType[type];
        if (!mime) {
            mime = {
                type: type,
                source: 'mimos',
                extensions: [],
                compressible: internals.compressibleRx.test(type)
            };

            this._byType[type] = mime;
            return mime;
        }

        if (mime.predicate) {
            return mime.predicate(Hoek.clone(mime));
        }

        return mime;
    }
};

internals.base = internals.compile();       // Prevents an expensive copy on each constructor when no customization is needed


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

/**
 * Module exports.
 */

module.exports = __webpack_require__(74)


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = {"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana"},"application/3gpp-ims+xml":{"source":"iana"},"application/a2l":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana"},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","extensions":["atomsvc"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana"},"application/bacnet-xdd+zip":{"source":"iana"},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana"},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana"},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/cbor":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana"},"application/ccxml+xml":{"source":"iana","extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana"},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana"},"application/cellml+xml":{"source":"iana"},"application/cfw":{"source":"iana"},"application/clue_info+xml":{"source":"iana"},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana"},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana"},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana"},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana"},"application/cstadata+xml":{"source":"iana"},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","extensions":["mpd"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana"},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana"},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/docbook+xml":{"source":"apache","extensions":["dbk"]},"application/dskpp+xml":{"source":"iana"},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/emergencycalldata.comment+xml":{"source":"iana"},"application/emergencycalldata.control+xml":{"source":"iana"},"application/emergencycalldata.deviceinfo+xml":{"source":"iana"},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana"},"application/emergencycalldata.serviceinfo+xml":{"source":"iana"},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana"},"application/emergencycalldata.veds+xml":{"source":"iana"},"application/emma+xml":{"source":"iana","extensions":["emma"]},"application/emotionml+xml":{"source":"iana"},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana"},"application/epub+zip":{"source":"iana","extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana"},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false,"extensions":["woff"]},"application/font-woff2":{"compressible":false,"extensions":["woff2"]},"application/framework-attributes+xml":{"source":"iana"},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geoxacml+xml":{"source":"iana"},"application/gml+xml":{"source":"iana","extensions":["gml"]},"application/gpx+xml":{"source":"apache","extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana"},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana"},"application/ibe-pkg-reply+xml":{"source":"iana"},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana"},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana"},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana"},"application/kpml-response+xml":{"source":"iana"},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana"},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana"},"application/lost+xml":{"source":"iana","extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana"},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","extensions":["mads"]},"application/manifest+json":{"charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana"},"application/mathml-presentation+xml":{"source":"iana"},"application/mbms-associated-procedure-description+xml":{"source":"iana"},"application/mbms-deregister+xml":{"source":"iana"},"application/mbms-envelope+xml":{"source":"iana"},"application/mbms-msk+xml":{"source":"iana"},"application/mbms-msk-response+xml":{"source":"iana"},"application/mbms-protection-description+xml":{"source":"iana"},"application/mbms-reception-report+xml":{"source":"iana"},"application/mbms-register+xml":{"source":"iana"},"application/mbms-register-response+xml":{"source":"iana"},"application/mbms-schedule+xml":{"source":"iana"},"application/mbms-user-service-description+xml":{"source":"iana"},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana"},"application/media_control+xml":{"source":"iana"},"application/mediaservercontrol+xml":{"source":"iana","extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","extensions":["meta4"]},"application/mets+xml":{"source":"iana","extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mmt-usd+xml":{"source":"iana"},"application/mods+xml":{"source":"iana","extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana"},"application/mrb-publish+xml":{"source":"iana"},"application/msc-ivr+xml":{"source":"iana"},"application/msc-mixer+xml":{"source":"iana"},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana"},"application/n-triples":{"source":"iana"},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana"},"application/news-groupinfo":{"source":"iana"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana"},"application/nss":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p2p-overlay+xml":{"source":"iana"},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana"},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana"},"application/pidf-diff+xml":{"source":"iana"},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","extensions":["pls"]},"application/poc-settings+xml":{"source":"iana"},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana"},"application/provenance+xml":{"source":"iana"},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.hpub+zip":{"source":"iana"},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana"},"application/pskc+xml":{"source":"iana","extensions":["pskcxml"]},"application/qsig":{"source":"iana"},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf"]},"application/reginfo+xml":{"source":"iana","extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","extensions":["rld"]},"application/rfc+xml":{"source":"iana"},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana"},"application/rls-services+xml":{"source":"iana","extensions":["rs"]},"application/route-apd+xml":{"source":"iana"},"application/route-s-tsid+xml":{"source":"iana"},"application/route-usd+xml":{"source":"iana"},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana"},"application/samlmetadata+xml":{"source":"iana"},"application/sbml+xml":{"source":"iana","extensions":["sbml"]},"application/scaip+xml":{"source":"iana"},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/sep+xml":{"source":"iana"},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","extensions":["shf"]},"application/sieve":{"source":"iana"},"application/simple-filter+xml":{"source":"iana"},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","extensions":["srx"]},"application/spirits-event+xml":{"source":"iana"},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","extensions":["grxml"]},"application/sru+xml":{"source":"iana","extensions":["sru"]},"application/ssdl+xml":{"source":"apache","extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","extensions":["ssml"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/tei+xml":{"source":"iana","extensions":["tei","teicorpus"]},"application/thraud+xml":{"source":"iana","extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/trig":{"source":"iana"},"application/ttml+xml":{"source":"iana"},"application/tve-trigger":{"source":"iana"},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana"},"application/urc-ressheet+xml":{"source":"iana"},"application/urc-targetdesc+xml":{"source":"iana"},"application/urc-uisocketdesc+xml":{"source":"iana"},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana"},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana"},"application/vnd.3gpp-prose+xml":{"source":"iana"},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana"},"application/vnd.3gpp.bsf+xml":{"source":"iana"},"application/vnd.3gpp.gmop+xml":{"source":"iana"},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana"},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana"},"application/vnd.3gpp.mid-call+xml":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana"},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana"},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana"},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana"},"application/vnd.3gpp.ussd+xml":{"source":"iana"},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana"},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","extensions":["mpkg"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avistar+xml":{"source":"iana"},"application/vnd.balsamiq.bmml+xml":{"source":"iana"},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana"},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana"},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","extensions":["wbs"]},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana"},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana"},"application/vnd.cybank":{"source":"iana"},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume-movie":{"source":"iana"},"application/vnd.desmume.movie":{"source":"apache"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana"},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana"},"application/vnd.dvb.notif-container+xml":{"source":"iana"},"application/vnd.dvb.notif-generic+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana"},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana"},"application/vnd.dvb.notif-init+xml":{"source":"iana"},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana"},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana"},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana"},"application/vnd.eszigno3+xml":{"source":"iana","extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana"},"application/vnd.etsi.asic-e+zip":{"source":"iana"},"application/vnd.etsi.asic-s+zip":{"source":"iana"},"application/vnd.etsi.cug+xml":{"source":"iana"},"application/vnd.etsi.iptvcommand+xml":{"source":"iana"},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana"},"application/vnd.etsi.iptvprofile+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana"},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana"},"application/vnd.etsi.iptvservice+xml":{"source":"iana"},"application/vnd.etsi.iptvsync+xml":{"source":"iana"},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana"},"application/vnd.etsi.mcid+xml":{"source":"iana"},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana"},"application/vnd.etsi.pstn+xml":{"source":"iana"},"application/vnd.etsi.sci+xml":{"source":"iana"},"application/vnd.etsi.simservs+xml":{"source":"iana"},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana"},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana"},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana"},"application/vnd.gov.sk.e-form+zip":{"source":"iana"},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana"},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana"},"application/vnd.imagemeter.image+zip":{"source":"iana"},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana"},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana"},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana"},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana"},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana"},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana"},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana"},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana"},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana"},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","extensions":["lasxml"]},"application/vnd.liberty-request+xml":{"source":"iana"},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","extensions":["lbe"]},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana"},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana"},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana"},"application/vnd.marlin.drm.license+xml":{"source":"iana"},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana"},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana"},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana"},"application/vnd.ms-printing.printticket+xml":{"source":"apache"},"application/vnd.ms-printschematicket+xml":{"source":"iana"},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana"},"application/vnd.nokia.iptv.config+xml":{"source":"iana"},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana"},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana"},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana"},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana"},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana"},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana"},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana"},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana"},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana"},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana"},"application/vnd.oipf.spdlist+xml":{"source":"iana"},"application/vnd.oipf.ueprofile+xml":{"source":"iana"},"application/vnd.oipf.userprofile+xml":{"source":"iana"},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana"},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana"},"application/vnd.oma.bcast.imd+xml":{"source":"iana"},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana"},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana"},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana"},"application/vnd.oma.bcast.sprov+xml":{"source":"iana"},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana"},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana"},"application/vnd.oma.cab-pcc+xml":{"source":"iana"},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana"},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana"},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana"},"application/vnd.oma.group-usage-list+xml":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana"},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana"},"application/vnd.oma.poc.final-report+xml":{"source":"iana"},"application/vnd.oma.poc.groups+xml":{"source":"iana"},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana"},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana"},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana"},"application/vnd.oma.xcap-directory+xml":{"source":"iana"},"application/vnd.omads-email+xml":{"source":"iana"},"application/vnd.omads-file+xml":{"source":"iana"},"application/vnd.omads-folder+xml":{"source":"iana"},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana"},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"apache","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"apache","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml-template":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"apache","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana"},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana"},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana"},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana"},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana"},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos+xml":{"source":"iana"},"application/vnd.paos.xml":{"source":"apache"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana"},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana"},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana"},"application/vnd.radisys.msml+xml":{"source":"iana"},"application/vnd.radisys.msml-audit+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana"},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana"},"application/vnd.radisys.msml-conf+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana"},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana"},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana"},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.software602.filler.form+xml":{"source":"iana"},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana"},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana"},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana"},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana"},"application/vnd.wv.ssp+xml":{"source":"iana"},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana"},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","extensions":["vxml"]},"application/vq-rtcpxr":{"source":"iana"},"application/watcherinfo+xml":{"source":"iana"},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-otf":{"source":"apache","compressible":true,"extensions":["otf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-ttf":{"source":"apache","compressible":true,"extensions":["ttf","ttc"]},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"apache","extensions":["der","crt","pem"]},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana"},"application/xaml+xml":{"source":"apache","extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana"},"application/xcap-caps+xml":{"source":"iana"},"application/xcap-diff+xml":{"source":"iana","extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana"},"application/xcap-error+xml":{"source":"iana"},"application/xcap-ns+xml":{"source":"iana"},"application/xcon-conference-info+xml":{"source":"iana"},"application/xcon-conference-info-diff+xml":{"source":"iana"},"application/xenc+xml":{"source":"iana","extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache"},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana"},"application/xmpp+xml":{"source":"iana"},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","extensions":["xpl"]},"application/xslt+xml":{"source":"iana","extensions":["xslt"]},"application/xspf+xml":{"source":"apache","extensions":["xspf"]},"application/xv+xml":{"source":"iana","extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana"},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana"},"application/yin+xml":{"source":"iana","extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana"},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana"},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/otf":{"compressible":true,"extensions":["otf"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana"},"image/emf":{"source":"iana"},"image/fits":{"source":"iana"},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana"},"image/jp2":{"source":"iana"},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jpm":{"source":"iana"},"image/jpx":{"source":"iana"},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana"},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana"},"image/tiff":{"source":"iana","compressible":false,"extensions":["tiff","tif"]},"image/tiff-fx":{"source":"iana"},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana"},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana"},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana"},"image/vnd.valve.source.texture":{"source":"iana"},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana"},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana"},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana"},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana"},"message/global-delivery-status":{"source":"iana"},"message/global-disposition-notification":{"source":"iana"},"message/global-headers":{"source":"iana"},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana"},"model/3mf":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/vnd.collada+xml":{"source":"iana","extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana"},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana"},"model/vnd.parasolid.transmit.binary":{"source":"iana"},"model/vnd.parasolid.transmit.text":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.valve.source.compiled-map":{"source":"iana"},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana"},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana"},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana","compressible":false},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/hjson":{"extensions":["hjson"]},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/slim":{"extensions":["slim","slm"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana"},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vp8":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Boom = __webpack_require__(1);
const Regex = __webpack_require__(76);
const Segment = __webpack_require__(77);


// Declare internals

const internals = {
    pathRegex: Regex.generate(),
    defaults: {
        isCaseSensitive: true
    }
};


exports.Router = internals.Router = function (options) {

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});

    this.routes = {};                               // Key: HTTP method or * for catch-all, value: sorted array of routes
    this.ids = {};                                  // Key: route id, value: record
    this.vhosts = null;                             // {} where Key: hostname, value: see this.routes

    this.specials = {
        badRequest: null,
        notFound: null,
        options: null
    };
};


internals.Router.prototype.add = function (config, route) {

    const method = config.method.toLowerCase();

    const vhost = config.vhost || '*';
    if (vhost !== '*') {
        this.vhosts = this.vhosts || {};
        this.vhosts[vhost] = this.vhosts[vhost] || {};
    }

    const table = (vhost === '*' ? this.routes : this.vhosts[vhost]);
    table[method] = table[method] || { routes: [], router: new Segment() };

    const analysis = config.analysis || this.analyze(config.path);
    const record = {
        path: config.path,
        route: route || config.path,
        segments: analysis.segments,
        params: analysis.params,
        fingerprint: analysis.fingerprint,
        settings: this.settings
    };

    // Add route

    table[method].router.add(analysis.segments, record);
    table[method].routes.push(record);
    table[method].routes.sort(internals.sort);

    const last = record.segments[record.segments.length - 1];
    if (last.empty) {
        table[method].router.add(analysis.segments.slice(0, -1), record);
    }

    if (config.id) {
        Hoek.assert(!this.ids[config.id], 'Route id', config.id, 'for path', config.path, 'conflicts with existing path', this.ids[config.id] && this.ids[config.id].path);
        this.ids[config.id] = record;
    }

    return record;
};


internals.Router.prototype.special = function (type, route) {

    Hoek.assert(Object.keys(this.specials).indexOf(type) !== -1, 'Unknown special route type:', type);

    this.specials[type] = { route };
};


internals.Router.prototype.route = function (method, path, hostname) {

    const segments = path.split('/').slice(1);

    const vhost = (this.vhosts && hostname && this.vhosts[hostname]);
    const route = (vhost && this._lookup(path, segments, vhost, method)) ||
        this._lookup(path, segments, this.routes, method) ||
        (method === 'head' && vhost && this._lookup(path, segments, vhost, 'get')) ||
        (method === 'head' && this._lookup(path, segments, this.routes, 'get')) ||
        (method === 'options' && this.specials.options) ||
        (vhost && this._lookup(path, segments, vhost, '*')) ||
        this._lookup(path, segments, this.routes, '*') ||
        this.specials.notFound || Boom.notFound();

    return route;
};


internals.Router.prototype._lookup = function (path, segments, table, method) {

    const set = table[method];
    if (!set) {
        return null;
    }

    const match = set.router.lookup(path, segments, this.settings);
    if (!match) {
        return null;
    }

    const assignments = {};
    const array = [];
    for (let i = 0; i < match.array.length; ++i) {
        const name = match.record.params[i];
        const value = internals.decode(match.array[i]);
        if (value.isBoom) {
            return this.specials.badRequest || value;
        }

        if (assignments[name] !== undefined) {
            assignments[name] = assignments[name] + '/' + value;
        }
        else {
            assignments[name] = value;
        }

        if (i + 1 === match.array.length ||                 // Only include the last segment of a multi-segment param
            name !== match.record.params[i + 1]) {

            array.push(assignments[name]);
        }
    }

    return { params: assignments, paramsArray: array, route: match.record.route };
};


internals.decode = function (value) {

    try {
        return decodeURIComponent(value);
    }
    catch (err) {
        return Boom.badRequest('Invalid request path');
    }
};


internals.Router.prototype.normalize = function (path) {

    if (path &&
        path.indexOf('%') !== -1) {

        // Uppercase %encoded values

        const uppercase = path.replace(/%[0-9a-fA-F][0-9a-fA-F]/g, (encoded) => encoded.toUpperCase());

        // Decode non-reserved path characters: a-z A-Z 0-9 _!$&'()*+,;=:@-.~
        // ! (%21) $ (%24) & (%26) ' (%27) ( (%28) ) (%29) * (%2A) + (%2B) , (%2C) - (%2D) . (%2E)
        // 0-9 (%30-39) : (%3A) ; (%3B) = (%3D)
        // @ (%40) A-Z (%41-5A) _ (%5F) a-z (%61-7A) ~ (%7E)

        const decoded = uppercase.replace(/%(?:2[146-9A-E]|3[\dABD]|4[\dA-F]|5[\dAF]|6[1-9A-F]|7[\dAE])/g, (encoded) => String.fromCharCode(parseInt(encoded.substring(1), 16)));

        path = decoded;
    }

    // Normalize path segments

    if (path &&
        (path.indexOf('/.') !== -1 || path[0] === '.')) {

        const hasLeadingDash = path[0] === '/';
        const segments = path.split('/');
        const normalized = [];
        let segment;

        for (let i = 0; i < segments.length; ++i) {
            segment = segments[i];
            if (segment === '..') {
                normalized.pop();
            }
            else if (segment !== '.') {
                normalized.push(segment);
            }
        }

        if (segment === '.' ||
            segment === '..') {         // Add trailing slash when needed

            normalized.push('');
        }

        path = normalized.join('/');

        if (path[0] !== '/' &&
            hasLeadingDash) {

            path = '/' + path;
        }
    }

    return path;
};


internals.Router.prototype.analyze = function (path) {

    Hoek.assert(internals.pathRegex.validatePath.test(path), 'Invalid path:', path);
    Hoek.assert(!internals.pathRegex.validatePathEncoded.test(path), 'Path cannot contain encoded non-reserved path characters:', path);

    const pathParts = path.split('/');
    const segments = [];
    const params = [];
    const fingers = [];

    for (let i = 1; i < pathParts.length; ++i) {                            // Skip first empty segment
        let segment = pathParts[i];

        // Literal

        if (segment.indexOf('{') === -1) {
            segment = this.settings.isCaseSensitive ? segment : segment.toLowerCase();
            fingers.push(segment);
            segments.push({ literal: segment });
            continue;
        }

        // Parameter

        const parts = internals.parseParams(segment);
        if (parts.length === 1) {

            // Simple parameter

            const item = parts[0];
            Hoek.assert(params.indexOf(item.name) === -1, 'Cannot repeat the same parameter name:', item.name, 'in:', path);
            params.push(item.name);

            if (item.wilcard) {
                if (item.count) {
                    for (let j = 0; j < item.count; ++j) {
                        fingers.push('?');
                        segments.push({});
                        if (j) {
                            params.push(item.name);
                        }
                    }
                }
                else {
                    fingers.push('#');
                    segments.push({ wildcard: true });
                }
            }
            else {
                fingers.push('?');
                segments.push({ empty: item.empty });
            }
        }
        else {

            // Mixed parameter

            const seg = {
                length: parts.length,
                first: typeof parts[0] !== 'string',
                segments: []
            };

            let finger = '';
            let regex = '^';
            for (let j = 0; j < parts.length; ++j) {
                const part = parts[j];
                if (typeof part === 'string') {
                    finger = finger + part;
                    regex = regex + Hoek.escapeRegex(part);
                    seg.segments.push(part);
                }
                else {
                    Hoek.assert(params.indexOf(part.name) === -1, 'Cannot repeat the same parameter name:', part.name, 'in:', path);
                    params.push(part.name);

                    finger = finger + '?';
                    regex = regex + '(.' + (part.empty ? '*' : '+') + ')';
                }
            }

            seg.mixed = new RegExp(regex + '$', (!this.settings.isCaseSensitive ? 'i' : ''));
            fingers.push(finger);
            segments.push(seg);
        }
    }

    return {
        segments,
        fingerprint: '/' + fingers.join('/'),
        params
    };
};


internals.parseParams = function (segment) {

    const parts = [];
    segment.replace(internals.pathRegex.parseParam, (match, literal, name, wilcard, count, empty) => {

        if (literal) {
            parts.push(literal);
        }
        else {
            parts.push({
                name,
                wilcard: !!wilcard,
                count: count && parseInt(count, 10),
                empty: !!empty
            });
        }

        return '';
    });

    return parts;
};


internals.Router.prototype.table = function (host) {

    const result = [];
    const collect = (table) => {

        if (!table) {
            return;
        }

        Object.keys(table).forEach((method) => {

            table[method].routes.forEach((record) => {

                result.push(record.route);
            });
        });
    };

    if (this.vhosts) {
        const vhosts = host ? [].concat(host) : Object.keys(this.vhosts);
        for (let i = 0; i < vhosts.length; ++i) {
            collect(this.vhosts[vhosts[i]]);
        }
    }

    collect(this.routes);

    return result;
};


internals.sort = function (a, b) {

    const aFirst = -1;
    const bFirst = 1;

    const as = a.segments;
    const bs = b.segments;

    if (as.length !== bs.length) {
        return (as.length > bs.length ? bFirst : aFirst);
    }

    for (let i = 0; ; ++i) {
        if (as[i].literal) {
            if (bs[i].literal) {
                if (as[i].literal === bs[i].literal) {
                    continue;
                }

                return (as[i].literal > bs[i].literal ? bFirst : aFirst);
            }
            return aFirst;
        }
        else if (bs[i].literal) {
            return bFirst;
        }

        return (as[i].wildcard ? bFirst : aFirst);
    }
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules


// Declare internals

const internals = {};


exports.generate = function () {

    /*
        /path/{param}/path/{param?}
        /path/{param*2}/path
        /path/{param*2}
        /path/x{param}x
        /{param*}
    */

    const empty = '(?:^\\/$)';

    const legalChars = '[\\w\\!\\$&\'\\(\\)\\*\\+\\,;\\=\\:@\\-\\.~]';
    const encoded = '%[A-F0-9]{2}';

    const literalChar = '(?:' + legalChars + '|' + encoded + ')';
    const literal = literalChar + '+';
    const literalOptional = literalChar + '*';

    const midParam = '(?:\\{\\w+(?:\\*[1-9]\\d*)?\\})';                               // {p}, {p*2}
    const endParam = '(?:\\/(?:\\{\\w+(?:(?:\\*(?:[1-9]\\d*)?)|(?:\\?))?\\})?)?';     // {p}, {p*2}, {p*}, {p?}

    const partialParam = '(?:\\{\\w+\\??\\})';                                        // {p}, {p?}
    const mixedParam = '(?:(?:' + literal + partialParam + ')+' + literalOptional + ')|(?:' + partialParam + '(?:' + literal + partialParam + ')+' + literalOptional + ')|(?:' + partialParam + literal + ')';

    const segmentContent = '(?:' + literal + '|' + midParam + '|' + mixedParam + ')';
    const segment = '\\/' + segmentContent;
    const segments = '(?:' + segment + ')*';

    const path = '(?:^' + segments + endParam + '$)';

    //                1:literal               2:name   3:*  4:count  5:?
    const parseParam = '(' + literal + ')|(?:\\{(\\w+)(?:(\\*)(\\d+)?)?(\\?)?\\})';

    const expressions = {
        parseParam: new RegExp(parseParam, 'g'),
        validatePath: new RegExp(empty + '|' + path),
        validatePathEncoded: /%(?:2[146-9A-E]|3[\dABD]|4[\dA-F]|5[\dAF]|6[1-9A-F]|7[\dAE])/g
    };

    return expressions;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports = module.exports = internals.Segment = function () {

    this._edge = null;              // { segment, record }
    this._fulls = null;             // { path: { segment, record }
    this._literals = null;          // { literal: { segment, <node> } }
    this._param = null;             // <node>
    this._mixed = null;             // [{ segment, <node> }]
    this._wildcard = null;          // { segment, record }
};


internals.Segment.prototype.add = function (segments, record) {

    /*
        { literal: 'x' }        -> x
        { empty: false }        -> {p}
        { wildcard: true }      -> {p*}
        { mixed: /regex/ }      -> a{p}b
    */

    const current = segments[0];
    const remaining = segments.slice(1);
    const isEdge = !remaining.length;

    const literals = [];
    let isLiteral = true;
    for (let i = 0; i < segments.length && isLiteral; ++i) {
        isLiteral = segments[i].literal !== undefined;
        literals.push(segments[i].literal);
    }

    if (isLiteral) {
        this._fulls = this._fulls || {};
        let literal = '/' + literals.join('/');
        if (!record.settings.isCaseSensitive) {
            literal = literal.toLowerCase();
        }

        Hoek.assert(!this._fulls[literal], 'New route', record.path, 'conflicts with existing', this._fulls[literal] && this._fulls[literal].record.path);
        this._fulls[literal] = { segment: current, record };
    }
    else if (current.literal !== undefined) {               // Can be empty string

        // Literal

        this._literals = this._literals || {};
        const currentLiteral = (record.settings.isCaseSensitive ? current.literal : current.literal.toLowerCase());
        this._literals[currentLiteral] = this._literals[currentLiteral] || new internals.Segment();
        this._literals[currentLiteral].add(remaining, record);
    }
    else if (current.wildcard) {

        // Wildcard

        Hoek.assert(!this._wildcard, 'New route', record.path, 'conflicts with existing', this._wildcard && this._wildcard.record.path);
        Hoek.assert(!this._param || !this._param._wildcard, 'New route', record.path, 'conflicts with existing', this._param && this._param._wildcard && this._param._wildcard.record.path);
        this._wildcard = { segment: current, record };
    }
    else if (current.mixed) {

        // Mixed

        this._mixed = this._mixed || [];

        let mixed = this._mixedLookup(current);
        if (!mixed) {
            mixed = { segment: current, node: new internals.Segment() };
            this._mixed.push(mixed);
            this._mixed.sort(internals.mixed);
        }

        if (isEdge) {
            Hoek.assert(!mixed.node._edge, 'New route', record.path, 'conflicts with existing', mixed.node._edge && mixed.node._edge.record.path);
            mixed.node._edge = { segment: current, record };
        }
        else {
            mixed.node.add(remaining, record);
        }
    }
    else {

        // Parameter

        this._param = this._param || new internals.Segment();

        if (isEdge) {
            Hoek.assert(!this._param._edge, 'New route', record.path, 'conflicts with existing', this._param._edge && this._param._edge.record.path);
            this._param._edge = { segment: current, record };
        }
        else {
            Hoek.assert(!this._wildcard || !remaining[0].wildcard, 'New route', record.path, 'conflicts with existing', this._wildcard && this._wildcard.record.path);
            this._param.add(remaining, record);
        }
    }
};


internals.Segment.prototype._mixedLookup = function (segment) {

    for (let i = 0; i < this._mixed.length; ++i) {
        if (internals.mixed({ segment }, this._mixed[i]) === 0) {
            return this._mixed[i];
        }
    }

    return null;
};


internals.mixed = function (a, b) {

    const aFirst = -1;
    const bFirst = 1;

    const as = a.segment;
    const bs = b.segment;

    if (as.length !== bs.length) {
        return (as.length > bs.length ? aFirst : bFirst);
    }

    if (as.first !== bs.first) {
        return (as.first ? bFirst : aFirst);
    }

    for (let i = 0; i < as.segments.length; ++i) {
        const am = as.segments[i];
        const bm = bs.segments[i];

        if (am === bm) {
            continue;
        }

        if (am.length === bm.length) {
            return (am > bm ? bFirst : aFirst);
        }

        return (am.length < bm.length ? bFirst : aFirst);
    }

    return 0;
};


internals.Segment.prototype.lookup = function (path, segments, options) {

    let match = null;

    // Literal edge

    if (this._fulls) {
        match = this._fulls[options.isCaseSensitive ? path : path.toLowerCase()];
        if (match) {
            return { record: match.record, array: [] };
        }
    }

    // Literal node

    const current = segments[0];
    const nextPath = path.slice(current.length + 1);
    const remainder = (segments.length > 1 ? segments.slice(1) : null);

    if (this._literals) {
        const literal = options.isCaseSensitive ? current : current.toLowerCase();
        match = this._literals.hasOwnProperty(literal) && this._literals[literal];
        if (match) {
            const record = internals.deeper(match, nextPath, remainder, [], options);
            if (record) {
                return record;
            }
        }
    }

    // Mixed

    if (this._mixed) {
        for (let i = 0; i < this._mixed.length; ++i) {
            match = this._mixed[i];
            const params = current.match(match.segment.mixed);
            if (params) {
                const array = [];
                for (let j = 1; j < params.length; ++j) {
                    array.push(params[j]);
                }

                const record = internals.deeper(match.node, nextPath, remainder, array, options);
                if (record) {
                    return record;
                }
            }
        }
    }

    // Param

    if (this._param) {
        if (current ||
            (this._param._edge && this._param._edge.segment.empty)) {

            const record = internals.deeper(this._param, nextPath, remainder, [current], options);
            if (record) {
                return record;
            }
        }
    }

    // Wildcard

    if (this._wildcard) {
        return { record: this._wildcard.record, array: [path.slice(1)] };
    }

    return null;
};


internals.deeper = function (match, path, segments, array, options) {

    if (!segments) {
        if (match._edge) {
            return { record: match._edge.record, array };
        }

        if (match._wildcard) {
            return { record: match._wildcard.record, array };
        }
    }
    else {
        const result = match.lookup(path, segments, options);
        if (result) {
            return { record: result.record, array: array.concat(result.array) };
        }
    }

    return null;
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(2);
const Url = __webpack_require__(23);
const Util = __webpack_require__(17);


// Declare internals

const internals = {};


exports = module.exports = internals.Request = function (options) {

    Stream.Readable.call(this);

    // options: method, url, payload, headers, remoteAddress

    let url = options.url;
    if (typeof url === 'object') {
        url = Url.format(url);
    }

    const uri = Url.parse(url);
    this.url = uri.path;

    this.httpVersion = '1.1';
    this.method = (options.method ? options.method.toUpperCase() : 'GET');

    this.headers = {};
    const headers = options.headers || {};
    const fields = Object.keys(headers);
    fields.forEach((field) => {

        this.headers[field.toLowerCase()] = headers[field];
    });

    this.headers['user-agent'] = this.headers['user-agent'] || 'shot';

    const hostHeaderFromUri = function () {

        if (uri.port) {
            return uri.host;
        }

        if (uri.protocol) {
            return uri.hostname + (uri.protocol === 'https:' ? ':443' : ':80');
        }

        return null;
    };
    this.headers.host = this.headers.host || hostHeaderFromUri() || options.authority || 'localhost:80';

    this.connection = {
        remoteAddress: options.remoteAddress || '127.0.0.1'
    };

    let payload = options.payload || null;
    if (payload &&
        typeof payload !== 'string' &&
        !(payload instanceof Stream) &&
        !Buffer.isBuffer(payload)) {

        payload = JSON.stringify(payload);
        this.headers['content-type'] = this.headers['content-type'] || 'application/json';
    }

    // Set the content-length for the corresponding payload if none set

    if (payload &&
        !(payload instanceof Stream) &&
        !this.headers.hasOwnProperty('content-length')) {

        this.headers['content-length'] = (Buffer.isBuffer(payload) ? payload.length : Buffer.byteLength(payload)).toString();
    }

    // Use _shot namespace to avoid collision with Node

    this._shot = {
        payload,
        isDone: false,
        simulate: options.simulate || {}
    };

    return this;
};

Util.inherits(internals.Request, Stream.Readable);


internals.Request.prototype.prepare = function (next) {

    if (this._shot.payload instanceof Stream === false) {
        return next();
    }

    const chunks = [];

    this._shot.payload.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

    this._shot.payload.on('end', () => {

        const payload = Buffer.concat(chunks);
        this.headers['content-length'] = this.headers['content-length'] || payload.length;
        this._shot.payload = payload;
        return next();
    });
};


internals.Request.prototype._read = function (size) {

    setImmediate(() => {

        if (this._shot.isDone) {
            if (this._shot.simulate.end !== false) {        // 'end' defaults to true
                this.push(null);
            }

            return;
        }

        this._shot.isDone = true;

        if (this._shot.payload) {
            if (this._shot.simulate.split) {
                this.push(this._shot.payload.slice(0, 1));
                this.push(this._shot.payload.slice(1));
            }
            else {
                this.push(this._shot.payload);
            }
        }

        if (this._shot.simulate.error) {
            this.emit('error', new Error('Simulated'));
        }

        if (this._shot.simulate.close) {
            this.emit('close');
        }

        if (this._shot.simulate.end !== false) {        // 'end' defaults to true
            this.push(null);
        }
    });
};


internals.Request.prototype.destroy = function () {

};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Http = __webpack_require__(10);
const Stream = __webpack_require__(2);


// Declare internals

const internals = {};


exports = module.exports = class Response extends Http.ServerResponse {

    constructor(req, onEnd) {

        super({ method: req.method, httpVersionMajor: 1, httpVersionMinor: 1 });
        this._shot = { headers: null, trailers: {}, payloadChunks: [] };
        this._headers = {};      // This forces node@8 to always render the headers
        this.assignSocket(internals.nullSocket());

        this.once('finish', () => {

            const res = internals.payload(this);
            res.raw.req = req;
            process.nextTick(() => onEnd(res));
        });
    }

    writeHead() {

        const result = super.writeHead.apply(this, arguments);

        this._shot.headers = Object.assign({}, this._headers);       // Should be .getHeaders() since node v7.7

        // Add raw headers

        ['Date', 'Connection', 'Transfer-Encoding'].forEach((name) => {

            const regex = new RegExp('\\r\\n' + name + ': ([^\\r]*)\\r\\n');
            const field = this._header.match(regex);
            if (field) {
                this._shot.headers[name.toLowerCase()] = field[1];
            }
        });

        return result;
    }

    write(data, encoding, callback) {

        super.write(data, encoding, callback);
        this._shot.payloadChunks.push(new Buffer(data, encoding));
        return true;                                                    // Write always returns false when disconnected
    }

    end(data, encoding, callback) {

        if (data) {
            this.write(data, encoding);
        }

        super.end(callback);
        this.emit('finish');
    }

    destroy() {

    }

    addTrailers(trailers) {

        for (const key in trailers) {
            this._shot.trailers[key.toLowerCase().trim()] = trailers[key].toString().trim();
        }
    }
};


internals.payload = function (response) {

    // Prepare response object

    const res = {
        raw: {
            res: response
        },
        headers: response._shot.headers,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        trailers: {}
    };

    // Prepare payload and trailers

    const rawBuffer = Buffer.concat(response._shot.payloadChunks);
    res.rawPayload = rawBuffer;
    res.payload = rawBuffer.toString();
    res.trailers = response._shot.trailers;

    return res;
};


// Throws away all written data to prevent response from buffering payload

internals.nullSocket = function () {

    return new Stream.Writable({
        write(chunk, encoding, callback) {

            setImmediate(callback);
        }
    });
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Cryptiles = __webpack_require__(38);
const Hoek = __webpack_require__(0);
const Iron = __webpack_require__(81);
const Items = __webpack_require__(6);
const Joi = __webpack_require__(3);
const Querystring = __webpack_require__(39);


// Declare internals

const internals = {};


internals.schema = Joi.object({
    strictHeader: Joi.boolean(),
    ignoreErrors: Joi.boolean(),
    isSecure: Joi.boolean(),
    isHttpOnly: Joi.boolean(),
    isSameSite: Joi.valid('Strict', 'Lax').allow(false),
    path: Joi.string().allow(null),
    domain: Joi.string().allow(null),
    ttl: Joi.number().allow(null),
    encoding: Joi.string().valid('base64json', 'base64', 'form', 'iron', 'none'),
    sign: Joi.object({
        password: [Joi.string(), Joi.binary(), Joi.object()],
        integrity: Joi.object()
    }),
    iron: Joi.object(),
    password: [Joi.string(), Joi.binary(), Joi.object()],

    // Used by hapi

    clearInvalid: Joi.boolean(),
    autoValue: Joi.any(),
    passThrough: Joi.boolean()
});


internals.defaults = {
    strictHeader: true,                             // Require an RFC 6265 compliant header format
    ignoreErrors: false,
    isSecure: true,
    isHttpOnly: true,
    isSameSite: 'Strict',
    path: null,
    domain: null,
    ttl: null,                                      // MSecs, 0 means remove
    encoding: 'none'                                // options: 'base64json', 'base64', 'form', 'iron', 'none'
};


exports.Definitions = internals.Definitions = function (options) {

    this.settings = Hoek.applyToDefaults(internals.defaults, options || {});
    Joi.assert(this.settings, internals.schema, 'Invalid state definition defaults');

    this.cookies = {};
    this.names = [];
};


internals.Definitions.prototype.add = function (name, options) {

    Hoek.assert(name && typeof name === 'string', 'Invalid name');
    Hoek.assert(!this.cookies[name], 'State already defined:', name);

    const settings = Hoek.applyToDefaults(this.settings, options || {}, true);
    Joi.assert(settings, internals.schema, 'Invalid state definition: ' + name);

    this.cookies[name] = settings;
    this.names.push(name);
};


internals.empty = new internals.Definitions();


// Header format

//                      1: name                2: quoted  3: value
internals.parseRx = /\s*([^=\s]*)\s*=\s*(?:(?:"([^\"]*)")|([^\;]*))(?:(?:;\s*)|$)/g;

internals.validateRx = {
    nameRx: {
        strict: /^[^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+$/,
        loose: /^[^=\s]*$/
    },
    valueRx: {
        strict: /^[^\x00-\x20\"\,\;\\\x7F]*$/,
        loose: /^(?:"([^\"]*)")|(?:[^\;]*)$/
    },
    domainRx: /^\.?[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d]))(?:\.[a-z\d]+(?:(?:[a-z\d]*)|(?:[a-z\d\-]*[a-z\d])))*$/,
    domainLabelLenRx: /^\.?[a-z\d\-]{1,63}(?:\.[a-z\d\-]{1,63})*$/,
    pathRx: /^\/[^\x00-\x1F\;]*$/
};

//                      1: name         2: value
internals.pairsRx = /\s*([^=\s]*)\s*=\s*([^\;]*)(?:(?:;\s*)|$)/g;


internals.Definitions.prototype.parse = function (cookies, next) {

    const state = {};
    const names = [];
    const verify = cookies.replace(internals.parseRx, ($0, $1, $2, $3) => {

        const name = $1;
        const value = $2 || $3 || '';

        if (state[name]) {
            if (!Array.isArray(state[name])) {
                state[name] = [state[name]];
            }

            state[name].push(value);
        }
        else {
            state[name] = value;
            names.push(name);
        }

        return '';
    });

    // Validate cookie header syntax

    const failed = [];                                                // All errors

    if (verify !== '') {
        if (!this.settings.ignoreErrors) {
            return next(Boom.badRequest('Invalid cookie header'), null, []);
        }

        failed.push({ settings: this.settings, reason: `Header contains unexpected syntax: ${verify}` });
    }

    // Collect errors

    const errored = [];                                               // Unignored errors
    const record = (reason, name, value, definition) => {

        const details = {
            name,
            value,
            settings: definition,
            reason: typeof reason === 'string' ? reason : reason.message
        };

        failed.push(details);
        if (!definition.ignoreErrors) {
            errored.push(details);
        }
    };

    // Parse cookies

    const parsed = {};
    Items.serial(names, (name, nextName) => {

        const value = state[name];
        const definition = this.cookies[name] || this.settings;

        // Validate cookie

        if (definition.strictHeader) {
            if (!name.match(internals.validateRx.nameRx.strict)) {
                record('Invalid cookie name', name, value, definition);
                return nextName();
            }

            const values = [].concat(state[name]);
            for (let i = 0; i < values.length; ++i) {
                if (!values[i].match(internals.validateRx.valueRx.strict)) {
                    record('Invalid cookie value', name, value, definition);
                    return nextName();
                }
            }
        }

        // Check cookie format

        if (definition.encoding === 'none') {
            parsed[name] = value;
            return nextName();
        }

        // Single value

        if (!Array.isArray(value)) {
            internals.unsign(name, value, definition, (err, unsigned) => {

                if (err) {
                    record(err, name, value, definition);
                    return nextName();
                }

                internals.decode(unsigned, definition, (err, result) => {

                    if (err) {
                        record(err, name, value, definition);
                        return nextName();
                    }

                    parsed[name] = result;
                    return nextName();
                });
            });

            return;
        }

        // Array

        const arrayResult = [];
        Items.serial(value, (arrayValue, nextArray) => {

            internals.unsign(name, arrayValue, definition, (err, unsigned) => {

                if (err) {
                    record(err, name, value, definition);
                    return nextName();
                }

                internals.decode(unsigned, definition, (err, result) => {

                    if (err) {
                        record(err, name, value, definition);
                        return nextArray();
                    }

                    arrayResult.push(result);
                    nextArray();
                });
            });
        },
        (ignoreErr) => {                // Error not possible

            parsed[name] = arrayResult;
            return nextName();
        });
    },
    (ignoreErr) => {                    // Error not possible

        return next(errored.length ? Boom.badRequest('Invalid cookie value', errored) : null, parsed, failed);
    });
};


internals.macPrefix = 'hapi.signed.cookie.1';


internals.unsign = function (name, value, definition, next) {

    if (!definition.sign) {
        return next(null, value);
    }

    const pos = value.lastIndexOf('.');
    if (pos === -1) {
        return next(Boom.badRequest('Missing signature separator'));
    }

    const unsigned = value.slice(0, pos);
    const sig = value.slice(pos + 1);

    if (!sig) {
        return next(Boom.badRequest('Missing signature'));
    }

    const sigParts = sig.split('*');
    if (sigParts.length !== 2) {
        return next(Boom.badRequest('Invalid signature format'));
    }

    const hmacSalt = sigParts[0];
    const hmac = sigParts[1];

    const macOptions = Hoek.clone(definition.sign.integrity || Iron.defaults.integrity);
    macOptions.salt = hmacSalt;
    Iron.hmacWithPassword(definition.sign.password, macOptions, [internals.macPrefix, name, unsigned].join('\n'), (err, mac) => {

        if (err) {
            return next(err);
        }

        if (!Cryptiles.fixedTimeComparison(mac.digest, hmac)) {
            return next(Boom.badRequest('Invalid hmac value'));
        }

        return next(null, unsigned);
    });
};


internals.decode = function (value, definition, next) {

    if (!value &&
        definition.encoding === 'form') {

        return next(null, {});
    }

    Hoek.assert(typeof value === 'string', 'Invalid string');

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (definition.encoding === 'iron') {
        Iron.unseal(value, definition.password, definition.iron || Iron.defaults, (err, unsealed) => {

            if (err) {
                return next(err);
            }

            return next(null, unsealed);
        });

        return;
    }

    let result = value;

    try {
        if (definition.encoding === 'base64json') {
            const decoded = (new Buffer(value, 'base64')).toString('binary');
            result = JSON.parse(decoded);
        }
        else if (definition.encoding === 'base64') {
            result = (new Buffer(value, 'base64')).toString('binary');
        }
        else {                                                                  // encoding: 'form'
            result = Querystring.parse(value);
        }
    }
    catch (err) {
        return next(err);
    }

    return next(null, result);
};


internals.Definitions.prototype.format = function (cookies, callback) {

    if (!cookies ||
        (Array.isArray(cookies) && !cookies.length)) {

        return Hoek.nextTick(callback)(null, []);
    }

    if (!Array.isArray(cookies)) {
        cookies = [cookies];
    }

    const header = [];
    Items.serial(cookies, (cookie, next) => {

        // Apply definition to local configuration

        const base = this.cookies[cookie.name] || this.settings;
        const definition = cookie.options ? Hoek.applyToDefaults(base, cookie.options, true) : base;

        // Validate name

        const nameRx = (definition.strictHeader ? internals.validateRx.nameRx.strict : internals.validateRx.nameRx.loose);
        if (!nameRx.test(cookie.name)) {
            return callback(Boom.badImplementation('Invalid cookie name: ' + cookie.name));
        }

        // Prepare value (encode, sign)

        exports.prepareValue(cookie.name, cookie.value, definition, (err, value) => {

            if (err) {
                return callback(err);
            }

            // Validate prepared value

            const valueRx = (definition.strictHeader ? internals.validateRx.valueRx.strict : internals.validateRx.valueRx.loose);
            if (value &&
                (typeof value !== 'string' || !value.match(valueRx))) {

                return callback(Boom.badImplementation('Invalid cookie value: ' + cookie.value));
            }

            // Construct cookie

            let segment = cookie.name + '=' + (value || '');

            if (definition.ttl !== null &&
                definition.ttl !== undefined) {            // Can be zero

                const expires = new Date(definition.ttl ? Date.now() + definition.ttl : 0);
                segment = segment + '; Max-Age=' + Math.floor(definition.ttl / 1000) + '; Expires=' + expires.toUTCString();
            }

            if (definition.isSecure) {
                segment = segment + '; Secure';
            }

            if (definition.isHttpOnly) {
                segment = segment + '; HttpOnly';
            }

            if (definition.isSameSite) {
                segment = segment + `; SameSite=${definition.isSameSite}`;
            }

            if (definition.domain) {
                const domain = definition.domain.toLowerCase();
                if (!domain.match(internals.validateRx.domainLabelLenRx)) {
                    return callback(Boom.badImplementation('Cookie domain too long: ' + definition.domain));
                }

                if (!domain.match(internals.validateRx.domainRx)) {
                    return callback(Boom.badImplementation('Invalid cookie domain: ' + definition.domain));
                }

                segment = segment + '; Domain=' + domain;
            }

            if (definition.path) {
                if (!definition.path.match(internals.validateRx.pathRx)) {
                    return callback(Boom.badImplementation('Invalid cookie path: ' + definition.path));
                }

                segment = segment + '; Path=' + definition.path;
            }

            header.push(segment);
            return next();
        });
    },
    (ignoreErr) => {                // Error not possible

        return callback(null, header);
    });
};


exports.prepareValue = function (name, value, options, callback) {

    Hoek.assert(options && typeof options === 'object', 'Missing or invalid options');

    // Encode value

    internals.encode(value, options, (err, encoded) => {

        if (err) {
            return callback(Boom.badImplementation('Failed to encode cookie (' + name + ') value: ' + err.message));
        }

        // Sign cookie

        internals.sign(name, encoded, options.sign, (err, signed) => {

            if (err) {
                return callback(Boom.badImplementation('Failed to sign cookie (' + name + ') value: ' + err.message));
            }

            return callback(null, signed);
        });
    });
};


internals.encode = function (value, options, callback) {

    callback = Hoek.nextTick(callback);

    // Encodings: 'base64json', 'base64', 'form', 'iron', 'none'

    if (value === undefined) {
        return callback(null, value);
    }

    if (options.encoding === 'none') {
        return callback(null, value);
    }

    if (options.encoding === 'iron') {
        Iron.seal(value, options.password, options.iron || Iron.defaults, (err, sealed) => {

            if (err) {
                return callback(err);
            }

            return callback(null, sealed);
        });

        return;
    }

    let result = value;

    try {
        if (options.encoding === 'base64') {
            result = (new Buffer(value, 'binary')).toString('base64');
        }
        else if (options.encoding === 'base64json') {
            const stringified = JSON.stringify(value);
            result = (new Buffer(stringified, 'binary')).toString('base64');
        }
        else {                                                                  // encoding: 'form'
            result = Querystring.stringify(value);
        }
    }
    catch (err) {
        return callback(err);
    }

    return callback(null, result);
};


internals.sign = function (name, value, options, callback) {

    if (value === undefined ||
        !options) {

        return Hoek.nextTick(callback)(null, value);
    }

    Iron.hmacWithPassword(options.password, options.integrity || Iron.defaults.integrity, [internals.macPrefix, name, value].join('\n'), (err, mac) => {

        if (err) {
            return callback(err);
        }

        const signed = value + '.' + mac.salt + '*' + mac.digest;
        return callback(null, signed);
    });
};


internals.Definitions.prototype.passThrough = function (header, fallback) {

    if (!this.names.length) {
        return header;
    }

    const exclude = [];
    for (let i = 0; i < this.names.length; ++i) {
        const name = this.names[i];
        const definition = this.cookies[name];
        const passCookie = definition.passThrough !== undefined ? definition.passThrough : fallback;
        if (!passCookie) {
            exclude.push(name);
        }
    }

    return exports.exclude(header, exclude);
};


exports.exclude = function (cookies, excludes) {

    let result = '';
    const verify = cookies.replace(internals.pairsRx, ($0, $1, $2) => {

        if (excludes.indexOf($1) === -1) {
            result = result + (result ? ';' : '') + $1 + '=' + $2;
        }

        return '';
    });

    return verify === '' ? result : Boom.badRequest('Invalid cookie header');
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Crypto = __webpack_require__(12);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Cryptiles = __webpack_require__(38);


// Declare internals

const internals = {};


// Common defaults

exports.defaults = {
    encryption: {
        saltBits: 256,
        algorithm: 'aes-256-cbc',
        iterations: 1,
        minPasswordlength: 32
    },

    integrity: {
        saltBits: 256,
        algorithm: 'sha256',
        iterations: 1,
        minPasswordlength: 32
    },

    ttl: 0,                                             // Milliseconds, 0 means forever
    timestampSkewSec: 60,                               // Seconds of permitted clock skew for incoming expirations
    localtimeOffsetMsec: 0                              // Local clock time offset express in a number of milliseconds (positive or negative)
};


// Algorithm configuration

exports.algorithms = {
    'aes-128-ctr': { keyBits: 128, ivBits: 128 },       // Requires node 0.10.x
    'aes-256-cbc': { keyBits: 256, ivBits: 128 },
    'sha256': { keyBits: 256 }
};


// MAC normalization format version

exports.macFormatVersion = '2';                         // Prevent comparison of mac values generated with different normalized string formats
exports.macPrefix = 'Fe26.' + exports.macFormatVersion;


// Generate a unique encryption key

/*
    const options =  {
        saltBits: 256,                                  // Ignored if salt is set
        salt: '4d8nr9q384nr9q384nr93q8nruq9348run',
        algorithm: 'aes-128-ctr',
        iterations: 10000,
        iv: 'sdfsdfsdfsdfscdrgercgesrcgsercg',          // Optional
        minPasswordlength: 32
    };
*/

exports.generateKey = function (password, options, callback) {

    const callbackTick = Hoek.nextTick(callback);

    if (!password) {
        return callbackTick(Boom.internal('Empty password'));
    }

    if (!options ||
        typeof options !== 'object') {

        return callbackTick(Boom.internal('Bad options'));
    }

    const algorithm = exports.algorithms[options.algorithm];
    if (!algorithm) {
        return callbackTick(Boom.internal('Unknown algorithm: ' + options.algorithm));
    }

    const generate = () => {

        if (Buffer.isBuffer(password)) {
            if (password.length < algorithm.keyBits / 8) {
                return callbackTick(Boom.internal('Key buffer (password) too small'));
            }

            const result = {
                key: password,
                salt: ''
            };

            return generateIv(result);
        }

        if (password.length < options.minPasswordlength) {
            return callbackTick(Boom.internal('Password string too short (min ' + options.minPasswordlength + ' characters required)'));
        }

        if (options.salt) {
            return generateKey(options.salt);
        }

        if (options.saltBits) {
            return generateSalt();
        }

        return callbackTick(Boom.internal('Missing salt or saltBits options'));
    };

    const generateSalt = () => {

        const randomSalt = Cryptiles.randomBits(options.saltBits);
        if (randomSalt instanceof Error) {
            return callbackTick(Boom.wrap(randomSalt));
        }

        const salt = randomSalt.toString('hex');
        return generateKey(salt);
    };

    const generateKey = (salt) => {

        Crypto.pbkdf2(password, salt, options.iterations, algorithm.keyBits / 8, 'sha1', (err, derivedKey) => {

            if (err) {
                return callback(Boom.wrap(err));
            }

            const result = {
                key: derivedKey,
                salt
            };

            return generateIv(result);
        });
    };

    const generateIv = (result) => {

        if (algorithm.ivBits &&
            !options.iv) {

            const randomIv = Cryptiles.randomBits(algorithm.ivBits);
            if (randomIv instanceof Error) {
                return callbackTick(Boom.wrap(randomIv));
            }

            result.iv = randomIv;
            return callbackTick(null, result);
        }

        if (options.iv) {
            result.iv = options.iv;
        }

        return callbackTick(null, result);
    };

    generate();
};


// Encrypt data
// options: see exports.generateKey()

exports.encrypt = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const cipher = Crypto.createCipheriv(options.algorithm, key.key, key.iv);
        const enc = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

        callback(null, enc, key);
    });
};


// Decrypt data
// options: see exports.generateKey()

exports.decrypt = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const decipher = Crypto.createDecipheriv(options.algorithm, key.key, key.iv);
        let dec = decipher.update(data, null, 'utf8');
        dec = dec + decipher.final('utf8');

        callback(null, dec);
    });
};


// HMAC using a password
// options: see exports.generateKey()

exports.hmacWithPassword = function (password, options, data, callback) {

    exports.generateKey(password, options, (err, key) => {

        if (err) {
            return callback(err);
        }

        const hmac = Crypto.createHmac(options.algorithm, key.key).update(data);
        const digest = hmac.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

        const result = {
            digest,
            salt: key.salt
        };

        return callback(null, result);
    });
};


// Normalizes a password parameter into a { id, encryption, integrity } object
// password: string, buffer or object with { id, secret } or { id, encryption, integrity }

internals.normalizePassword = function (password) {

    const obj = {};

    if (password instanceof Object &&
        !Buffer.isBuffer(password)) {

        obj.id = password.id;
        obj.encryption = password.secret || password.encryption;
        obj.integrity = password.secret || password.integrity;
    }
    else {
        obj.encryption = password;
        obj.integrity = password;
    }

    return obj;
};


// Encrypt and HMAC an object
// password: string, buffer or object with { id, secret } or { id, encryption, integrity }
// options: see exports.defaults

exports.seal = function (object, password, options, callback) {

    const now = Date.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

    const callbackTick = Hoek.nextTick(callback);

    // Serialize object

    const objectString = internals.stringify(object);
    if (objectString instanceof Error) {
        return callbackTick(objectString);
    }

    // Obtain password

    let passwordId = '';
    password = internals.normalizePassword(password);
    if (password.id) {
        if (!/^\w+$/.test(password.id)) {
            return callbackTick(Boom.internal('Invalid password id'));
        }

        passwordId = password.id;
    }

    // Encrypt object string

    exports.encrypt(password.encryption, options.encryption, objectString, (err, encrypted, key) => {

        if (err) {
            return callback(err);
        }

        // Base64url the encrypted value

        const encryptedB64 = Hoek.base64urlEncode(encrypted);
        const iv = Hoek.base64urlEncode(key.iv);
        const expiration = (options.ttl ? now + options.ttl : '');
        const macBaseString = exports.macPrefix + '*' + passwordId + '*' + key.salt + '*' + iv + '*' + encryptedB64 + '*' + expiration;

        // Mac the combined values

        exports.hmacWithPassword(password.integrity, options.integrity, macBaseString, (err, mac) => {

            if (err) {
                return callback(err);
            }

            // Put it all together

            // prefix*[password-id]*encryption-salt*encryption-iv*encrypted*[expiration]*hmac-salt*hmac
            // Allowed URI query name/value characters: *-. \d \w

            const sealed = macBaseString + '*' + mac.salt + '*' + mac.digest;
            return callback(null, sealed);
        });
    });
};


// Decrypt and validate sealed string
// password: string, buffer or object with { id: secret } or { id: { encryption, integrity } }
// options: see exports.defaults

exports.unseal = function (sealed, password, options, callback) {

    const now = Date.now() + (options.localtimeOffsetMsec || 0);                 // Measure now before any other processing

    const callbackTick = Hoek.nextTick(callback);

    // Break string into components

    const parts = sealed.split('*');
    if (parts.length !== 8) {
        return callbackTick(Boom.internal('Incorrect number of sealed components'));
    }

    const macPrefix = parts[0];
    const passwordId = parts[1];
    const encryptionSalt = parts[2];
    const encryptionIv = parts[3];
    const encryptedB64 = parts[4];
    const expiration = parts[5];
    const hmacSalt = parts[6];
    const hmac = parts[7];
    const macBaseString = macPrefix + '*' + passwordId + '*' + encryptionSalt + '*' + encryptionIv + '*' + encryptedB64 + '*' + expiration;

    // Check prefix

    if (macPrefix !== exports.macPrefix) {
        return callbackTick(Boom.internal('Wrong mac prefix'));
    }

    // Check expiration

    if (expiration) {
        if (!expiration.match(/^\d+$/)) {
            return callbackTick(Boom.internal('Invalid expiration'));
        }

        const exp = parseInt(expiration, 10);
        if (exp <= (now - (options.timestampSkewSec * 1000))) {
            return callbackTick(Boom.internal('Expired seal'));
        }
    }

    // Obtain password

    if (password instanceof Object &&
        !(Buffer.isBuffer(password))) {

        password = password[passwordId || 'default'];
        if (!password) {
            return callbackTick(Boom.internal('Cannot find password: ' + passwordId));
        }
    }
    password = internals.normalizePassword(password);

    // Check hmac

    const macOptions = Hoek.clone(options.integrity);
    macOptions.salt = hmacSalt;
    exports.hmacWithPassword(password.integrity, macOptions, macBaseString, (err, mac) => {

        if (err) {
            return callback(err);
        }

        if (!Cryptiles.fixedTimeComparison(mac.digest, hmac)) {
            return callback(Boom.internal('Bad hmac value'));
        }

        // Decrypt

        const encrypted = Hoek.base64urlDecode(encryptedB64, 'buffer');
        if (encrypted instanceof Error) {
            return callback(Boom.wrap(encrypted));
        }

        const decryptOptions = Hoek.clone(options.encryption);
        decryptOptions.salt = encryptionSalt;

        decryptOptions.iv = Hoek.base64urlDecode(encryptionIv, 'buffer');
        if (decryptOptions.iv instanceof Error) {
            return callback(Boom.wrap(decryptOptions.iv));
        }

        exports.decrypt(password.encryption, decryptOptions, encrypted, (ignoreErr, decrypted) => {         // Cannot fail since all errors covered by hmacWithPassword()

            // Parse JSON

            let object = null;
            try {
                object = JSON.parse(decrypted);
            }
            catch (err) {
                return callback(Boom.internal('Failed parsing sealed object JSON: ' + err.message));
            }

            return callback(null, object);
        });
    });
};


internals.stringify = function (object) {

    try {
        return JSON.stringify(object);
    }
    catch (err) {
        return Boom.internal('Failed to stringify object: ' + err.message);
    }
};


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Zlib = __webpack_require__(40);
const Accept = __webpack_require__(83);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports = module.exports = internals.Compression = function () {

    this.encodings = ['identity', 'gzip', 'deflate'];
    this._encoders = {
        identity: null,
        gzip: (options) => Zlib.createGzip(options),
        deflate: (options) => Zlib.createDeflate(options)
    };

    this._decoders = {
        gzip: (options) => Zlib.createGunzip(options),
        deflate: (options) => Zlib.createInflate(options)
    };
};


internals.Compression.prototype.addEncoder = function (encoding, encoder) {

    Hoek.assert(this._encoders[encoding] === undefined, `Cannot override existing encoder for ${encoding}`);
    Hoek.assert(typeof encoder === 'function', `Invalid encoder function for ${encoding}`);
    this._encoders[encoding] = encoder;
    this.encodings.push(encoding);
};


internals.Compression.prototype.addDecoder = function (encoding, decoder) {

    Hoek.assert(this._decoders[encoding] === undefined, `Cannot override existing decoder for ${encoding}`);
    Hoek.assert(typeof decoder === 'function', `Invalid decoder function for ${encoding}`);
    this._decoders[encoding] = decoder;
};


internals.Compression.prototype.accept = function (request) {

    const header = request.headers['accept-encoding'];
    const accept = Accept.encoding(header, this.encodings);
    if (accept instanceof Error) {
        request.log(['accept-encoding', 'error'], { header, error: accept });
        return 'identity';
    }

    return accept;
};


internals.Compression.prototype.encoding = function (response) {

    const request = response.request;
    if (!request.connection.settings.compression) {
        return null;
    }

    const mime = request.server.mime.type(response.headers['content-type'] || 'application/octet-stream');
    if (!mime.compressible) {
        return null;
    }

    response.vary('accept-encoding');

    if (response.headers['content-encoding']) {
        return null;
    }

    return (request.info.acceptEncoding === 'identity' ? null : request.info.acceptEncoding);
};


internals.Compression.prototype.encoder = function (request, encoding) {

    const encoder = this._encoders[encoding];
    Hoek.assert(encoder !== undefined, `Unknown encoding ${encoding}`);
    return encoder(request.route.settings.compression[encoding]);
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Charset = __webpack_require__(84);
const Encoding = __webpack_require__(85);
const Language = __webpack_require__(86);
const MediaType = __webpack_require__(87);

exports.charset = Charset.charset;
exports.charsets = Charset.charsets;

exports.encoding = Encoding.encoding;
exports.encodings = Encoding.encodings;

exports.language = Language.language;
exports.languages = Language.languages;

exports.mediaTypes = MediaType.mediaTypes;

exports.parseAll = function (requestHeaders) {

    return {
        charsets: Charset.charsets(requestHeaders['accept-charset']),
        encodings: Encoding.encodings(requestHeaders['accept-encoding']),
        languages: Language.languages(requestHeaders['accept-language']),
        mediaTypes: MediaType.mediaTypes(requestHeaders.accept)
    };
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


// From https://tools.ietf.org/html/rfc7231#section-5.3.3
// Accept-Charset: iso-8859-5, unicode-1-1;q=0.8

exports.charset = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    const charsets = header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmpty)
        .sort(internals.compareByWeight);

    // Tack on a default return

    charsets.push({
        weight: 0.001,
        charset: ''
    });

    // No preferences.  Take the first non-disallowed charset

    if (!preferences || preferences.length === 0) {
        return charsets.filter(internals.removeDisallowed)[0].charset;
    }

    // Lower case all preferences

    preferences = preferences.map(internals.lowerCase);

    // Remove any disallowed preferences

    internals.removeDisallowedPreferences(charsets, preferences);

    // If charsets includes * (that isn't disallowed *;q=0) return first preference

    const splatLocation = internals.findCharsetItem(charsets, '*');
    if (splatLocation !== -1 && charsets[splatLocation].weight > 0) {
        return preferences[0];
    }

    // Try to find the first match in the array of preferences, ignoring case

    for (let i = 0; i < charsets.length; ++i) {
        if (preferences.indexOf(charsets[i].charset.toLowerCase()) !== -1 && charsets[i].weight > 0) {
            return charsets[i].charset;
        }
    }

    return '';
};


exports.charsets = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    header = header.toLowerCase();

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmptyAndDisallowed)
        .sort(internals.compareByWeight)
        .map(internals.partToCharset);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        charset: ''
    };

    const match = item.match(internals.partsRegex);
    if (!match) {
        return result;
    }

    result.charset = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};

//                         1: token               2: qvalue
internals.partsRegex = /\s*([^;]+)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*/;


internals.removeEmpty = function (item) {

    return item.charset !== '';
};


internals.removeDisallowed = function (item) {

    return item.weight !== 0;
};


internals.removeEmptyAndDisallowed = function (item) {

    return item.charset !== '' && item.weight !== 0;
};


internals.removeDisallowedPreferences = function (charsets, preferences) {

    for (let i = 0; i < charsets.length; ++i) {
        let location;
        if (charsets[i].weight === 0) {
            location = preferences.indexOf(charsets[i].charset.toLowerCase());
            if (location !== -1) {
                preferences.splice(location, 1);
            }
        }
    }
};


internals.compareByWeight = function (a, b) {

    return a.weight < b.weight;
};


internals.partToCharset = function (item) {

    return item.charset;
};


internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


internals.lowerCase = function (str) {

    return str.toLowerCase();
};


internals.findCharsetItem = function (charsets, charset) {

    for (let i = 0; i < charsets.length; ++i) {
        if (charsets[i].charset === charset) {
            return i;
        }
    }

    return -1;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};

/*
    RFC 7231 Section 5.3.4 (https://tools.ietf.org/html/rfc7231#section-5.3.4)

    Accept-Encoding  = #( codings [ weight ] )
    codings          = content-coding / "identity" / "*"

    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

exports.encoding = function (header, preferences) {

    const encodings = exports.encodings(header, preferences);
    if (encodings.isBoom) {
        return encodings;
    }

    return encodings.length ? encodings[0] : '';
};


exports.encodings = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    const scores = internals.parse(header, 'encoding');
    if (scores.isBoom) {
        return scores;
    }

    if (!preferences) {
        preferences = Object.keys(scores.accept);
        preferences.push('*');
    }

    return internals.map(preferences, scores);
};


/*
    RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)

   The weight is normalized to a real number in the range 0 through 1,
   where 0.001 is the least preferred and 1 is the most preferred; a
   value of 0 means "not acceptable".  If no "q" parameter is present,
   the default weight is 1.

     weight = OWS ";" OWS "q=" qvalue
     qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )
*/

//                              1: token               2: qvalue
internals.preferenceRegex = /\s*([^;\,]+)(?:\s*;\s*[qQ]\=([01](?:\.\d{0,3})?))?\s*(?:\,|$)/g;


internals.equivalents = {
    encoding: {
        'x-compress': 'compress',
        'x-gzip': 'gzip'
    }
};

internals.parse = function (header, type) {

    const scores = {
        accept: {},
        reject: {},
        any: 0.0
    };

    if (header) {
        const leftovers = header.replace(internals.preferenceRegex, ($0, $1, $2) => {

            $1 = $1.toLowerCase();
            const key = internals.equivalents[type][$1] || $1;
            const score = $2 ? parseFloat($2) : 1.0;
            if (key === '*') {
                scores.any = score;
            }
            else if (score > 0) {
                scores.accept[key] = score;
            }
            else {
                scores.reject[key] = true;
            }

            return '';
        });

        if (leftovers) {
            return Boom.badRequest('Invalid accept-' + type + ' header');
        }
    }

    // Add identity at the lowest score if not explicitly set

    if (!scores.reject.identity &&
        !scores.accept.identity) {

        scores.accept.identity = scores.any || 0.001;
    }

    return scores;
};


internals.map = function (preferences, scores) {

    const scored = [];
    for (let i = 0; i < preferences.length; ++i) {
        const key = preferences[i].toLowerCase();
        if (!scores.reject[key]) {
            const score = scores.accept[key] || scores.any;
            if (score > 0) {
                scored.push({ key, score });
            }
        }
    }

    scored.sort(internals.sort);

    const result = [];
    for (let i = 0; i < scored.length; ++i) {
        result.push(scored[i].key);
    }

    return result;
};


internals.sort = function (a, b) {

    return (a.score === b.score ? 0 : (a.score < b.score ? 1 : -1));
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


// https://tools.ietf.org/html/rfc7231#section-5.3.5
// Accept-Language: da, en-gb;q=0.8, en;q=0.7


exports.language = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    const languages = exports.languages(header);

    if (languages.length === 0) {
        languages.push('');
    }

    // No preferences.  Take the first charset.

    if (!preferences || preferences.length === 0) {
        return languages[0];
    }

    // If languages includes * return first preference

    if (languages.indexOf('*') !== -1) {
        return preferences[0];
    }

    // Try to find the first match in the array of preferences

    preferences = preferences.map((str) => str.toLowerCase());

    for (let i = 0; i < languages.length; ++i) {
        if (preferences.indexOf(languages[i].toLowerCase()) !== -1) {
            return languages[i];
        }
    }

    return '';
};


exports.languages = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeUnwanted)
        .sort(internals.compareByWeight)
        .map(internals.partToLanguage);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        language: ''
    };

    const match = item.match(internals.partsRegex);

    if (!match) {
        return result;
    }

    result.language = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};


//                         1: token               2: qvalue
internals.partsRegex = /\s*([^;]+)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*/;


internals.removeUnwanted = function (item) {

    return item.weight !== 0 && item.language !== '';
};


internals.compareByWeight = function (a, b) {

    return a.weight < b.weight;
};


internals.partToLanguage = function (item) {

    return item.language;
};


internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Declare internals

const internals = {};

// Accept: audio/*; q=0.2, audio/basic
// text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
// text/plain, application/json;q=0.5, text/html, */*;q=0.1
// text/plain, application/json;q=0.5, text/html, text/drop;q=0
// text/*, text/plain, text/plain;format=flowed, */*
// text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5

exports.mediaTypes = function (header) {

    if (header === undefined || typeof header !== 'string') {
        return ['*/*'];
    }

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeEmptyAndDisallowed)
        .sort(internals.compareByWeightAndSpecificity)
        .map(internals.partToMediaType);
};


internals.getParts = function (item) {

    const result = {
        weight: 1,
        mediaType: ''
    };

    const match = item.match(internals.partsRegex);

    if (!match) {
        return result;
    }

    result.mediaType = match[1];
    if (match[2] && internals.isNumber(match[2])) {
        const weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};

//                         1: token              2: qvalue
internals.partsRegex = /\s*(.+\/.+?)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*$/;

internals.removeEmptyAndDisallowed = function (item) {

    return item.mediaType !== '' && item.weight !== 0;
};

internals.compareByWeightAndSpecificity = function (a, b) {

    if (a.weight !== b.weight) {
        return a.weight < b.weight;
    }

    // We have the same weight, so now look for specificity
    const aSlashParts = a.mediaType.split('/');
    const bSlashParts = b.mediaType.split('/');

    if (aSlashParts[0] !== bSlashParts[0]) {
        // First part of items are different so no
        // further specificity is implied.
        // Don't change order.
        return 0;
    }

    if (aSlashParts[1] !== '*' && bSlashParts[1] === '*') {
        return -1;
    }
    if (aSlashParts[1] === '*' && bSlashParts[1] !== '*') {
        return 1;
    }

    // look for items with extensions
    const aHasExtension = aSlashParts[1].indexOf(';') !== -1;
    const bHasExtension = bSlashParts[1].indexOf(';') !== -1;
    if (aHasExtension) {
        return -1;
    }
    else if (bHasExtension) {
        return 1;
    }

    return 0;
};

internals.partToMediaType = function (item) {

    return item.mediaType;
};

internals.isNumber = function (n) {

    return !isNaN(parseFloat(n));
};


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Fs = __webpack_require__(26);
const Os = __webpack_require__(22);
const Querystring = __webpack_require__(39);
const Stream = __webpack_require__(2);
const Zlib = __webpack_require__(40);
const Boom = __webpack_require__(1);
const Content = __webpack_require__(42);
const Hoek = __webpack_require__(0);
const Pez = __webpack_require__(89);
const Wreck = __webpack_require__(43);


// Declare internals

const internals = {
    decoders: {
        gzip: (options) => Zlib.createGunzip(options),
        deflate: (options) => Zlib.createInflate(options)
    }
};


exports.parse = function (req, tap, options, next) {

    Hoek.assert(options, 'Missing options');
    Hoek.assert(options.parse !== undefined, 'Missing parse option setting');
    Hoek.assert(options.output !== undefined, 'Missing output option setting');

    const parser = new internals.Parser(req, tap, options, next);
    return parser.read();
};


internals.Parser = function (req, tap, options, next) {

    this.req = req;
    this.settings = options;
    this.tap = tap;

    this.result = {};
    this.next = (err) => next(err, this.result);
};


internals.Parser.prototype.read = function () {

    const next = this.next;

    // Content size

    const req = this.req;
    const contentLength = req.headers['content-length'];
    if (this.settings.maxBytes !== undefined &&
        contentLength &&
        parseInt(contentLength, 10) > this.settings.maxBytes) {

        return next(Boom.entityTooLarge('Payload content length greater than maximum allowed: ' + this.settings.maxBytes));
    }

    // Content type

    const contentType = Content.type(this.settings.override || req.headers['content-type'] || this.settings.defaultContentType || 'application/octet-stream');
    if (contentType.isBoom) {
        return next(contentType);
    }

    this.result.contentType = contentType;
    this.result.mime = contentType.mime;

    if (this.settings.allow &&
        this.settings.allow.indexOf(contentType.mime) === -1) {

        return next(Boom.unsupportedMediaType());
    }

    // Parse: true

    if (this.settings.parse === true) {
        return this.parse(contentType);
    }

    // Parse: false, 'gunzip'

    return this.raw();
};


internals.Parser.prototype.parse = function (contentType) {

    let next = this.next;

    const output = this.settings.output;        // Output: 'data', 'stream', 'file'
    let source = this.req;

    // Content-encoding

    const contentEncoding = source.headers['content-encoding'];
    const decoder = (this.settings.decoders || internals.decoders)[contentEncoding];
    if (decoder) {
        const decoderOptions = (this.settings.compression && this.settings.compression[contentEncoding]) || null;
        const stream = decoder(decoderOptions);
        next = Hoek.once(next);                 // Modify next() for async events
        this.next = next;
        stream.once('error', (err) => {

            return next(Boom.badRequest('Invalid compressed payload', err));
        });

        source = source.pipe(stream);
    }

    // Tap request

    if (this.tap) {
        source = source.pipe(this.tap);
    }

    // Multipart

    if (this.result.contentType.mime === 'multipart/form-data') {
        if (this.settings.multipart === false) {                            // Defaults to true
            return next(Boom.unsupportedMediaType());
        }

        return this.multipart(source, contentType);
    }

    // Output: 'stream'

    if (output === 'stream') {
        this.result.payload = source;
        return next();
    }

    // Output: 'file'

    if (output === 'file') {
        this.writeFile(source, (err, path, bytes) => {

            if (err) {
                return next(err);
            }

            this.result.payload = { path, bytes };
            return next();
        });

        return;
    }

    // Output: 'data'

    return Wreck.read(source, { timeout: this.settings.timeout, maxBytes: this.settings.maxBytes }, (err, payload) => {

        if (err) {
            return next(err);
        }

        this.object(payload, this.result.contentType.mime, (err, result) => {

            if (err) {
                this.result.payload = null;
                err.raw = payload;
                return next(err);
            }

            this.result.payload = result;
            return next();
        });
    });
};


internals.Parser.prototype.raw = function () {

    let next = this.next;

    const output = this.settings.output;      // Output: 'data', 'stream', 'file'
    let source = this.req;

    // Content-encoding

    if (this.settings.parse === 'gunzip') {
        const contentEncoding = source.headers['content-encoding'];
        const decoder = (this.settings.decoders || internals.decoders)[contentEncoding];
        if (decoder) {
            const decoderOptions = (this.settings.compression && this.settings.compression[contentEncoding]) || null;
            const stream = decoder(decoderOptions);
            next = Hoek.once(next);                                                                     // Modify next() for async events

            stream.once('error', (err) => {

                return next(Boom.badRequest('Invalid compressed payload', err));
            });

            source = source.pipe(stream);
        }
    }

    // Setup source

    if (this.tap) {
        source = source.pipe(this.tap);
    }

    // Output: 'stream'

    if (output === 'stream') {
        this.result.payload = source;
        return next();
    }

    // Output: 'file'

    if (output === 'file') {
        this.writeFile(source, (err, path, bytes) => {

            if (err) {
                return next(err);
            }

            this.result.payload = { path, bytes };
            return next();
        });

        return;
    }

    // Output: 'data'

    return Wreck.read(source, { timeout: this.settings.timeout, maxBytes: this.settings.maxBytes }, (err, payload) => {

        if (err) {
            return next(err);
        }

        this.result.payload = payload;
        return next();
    });
};


internals.Parser.prototype.object = function (payload, mime, next) {

    // Binary

    if (mime === 'application/octet-stream') {
        return next(null, payload.length ? payload : null);
    }

    // Text

    if (mime.match(/^text\/.+$/)) {
        return next(null, payload.toString('utf8'));
    }

    // JSON

    if (/^application\/(?:.+\+)?json$/.test(mime)) {
        return internals.jsonParse(payload, next);                      // Isolate try...catch for V8 optimization
    }

    // Form-encoded

    if (mime === 'application/x-www-form-urlencoded') {
        const parse = (this.settings.querystring || Querystring.parse);
        return next(null, payload.length ? parse(payload.toString('utf8')) : {});
    }

    return next(Boom.unsupportedMediaType());
};


internals.jsonParse = function (payload, next) {

    if (!payload.length) {
        return next(null, null);
    }

    let parsed;
    try {
        parsed = JSON.parse(payload.toString('utf8'));
    }
    catch (err) {
        return next(Boom.badRequest('Invalid request payload JSON format', err));
    }

    return next(null, parsed);
};


internals.Parser.prototype.multipart = function (source, contentType) {

    let next = this.next;
    next = Hoek.once(next);                                            // Modify next() for async events
    this.next = next;

    // Set stream timeout

    const clientTimeout = this.settings.timeout;
    let clientTimeoutId = null;

    const dispenserOptions = Hoek.applyToDefaults(contentType, { maxBytes: this.settings.maxBytes });
    const dispenser = new Pez.Dispenser(dispenserOptions);

    const onError = (err) => {

        return next(Boom.badRequest('Invalid multipart payload format', err));
    };

    dispenser.once('error', onError);

    const data = {};
    const finalize = () => {

        clearTimeout(clientTimeoutId);
        dispenser.removeListener('error', onError);
        dispenser.removeListener('part', onPart);
        dispenser.removeListener('field', onField);
        dispenser.removeListener('close', onClose);

        this.result.payload = data;
        return next();
    };

    if (clientTimeout &&
        clientTimeout > 0) {

        clientTimeoutId = setTimeout(() => {

            return next(Boom.clientTimeout());
        }, clientTimeout);
    }

    const set = (name, value) => {

        if (!data.hasOwnProperty(name)) {
            data[name] = value;
        }
        else if (Array.isArray(data[name])) {
            data[name].push(value);
        }
        else {
            data[name] = [data[name], value];
        }
    };

    const pendingFiles = {};
    let nextId = 0;
    let closed = false;

    const output = (this.settings.multipart ? this.settings.multipart.output : this.settings.output);

    const onPart = (part) => {

        if (output === 'file') {                                                                // Output: 'file'
            const id = nextId++;
            pendingFiles[id] = true;
            this.writeFile(part, (err, path, bytes) => {

                delete pendingFiles[id];

                if (err) {
                    return next(err);
                }

                const item = {
                    filename: part.filename,
                    path,
                    headers: part.headers,
                    bytes
                };

                set(part.name, item);

                if (closed &&
                    !Object.keys(pendingFiles).length) {

                    return finalize(data);
                }
            });
        }
        else {                                                                                  // Output: 'data'
            Wreck.read(part, {}, (ignoreErr, payload) => {

                // Error handled by dispenser.once('error')

                if (output === 'stream') {                                                      // Output: 'stream'
                    const item = Wreck.toReadableStream(payload);

                    item.hapi = {
                        filename: part.filename,
                        headers: part.headers
                    };

                    return set(part.name, item);
                }

                const ct = part.headers['content-type'] || '';
                const mime = ct.split(';')[0].trim().toLowerCase();
                const annotate = (value) => set(part.name, output === 'annotated' ? { filename: part.filename, headers: part.headers, payload: value } : value);

                if (!mime) {
                    return annotate(payload);
                }

                if (!payload.length) {
                    return annotate({});
                }

                this.object(payload, mime, (err, result) => annotate(err ? payload : result));
            });
        }
    };

    dispenser.on('part', onPart);

    const onField = (name, value) => set(name, value);

    dispenser.on('field', onField);

    const onClose = () => {

        if (Object.keys(pendingFiles).length) {
            closed = true;
            return;
        }

        return finalize(data);
    };

    dispenser.once('close', onClose);

    source.pipe(dispenser);
};


internals.Parser.prototype.writeFile = function (stream, callback) {

    const path = Hoek.uniqueFilename(this.settings.uploads || Os.tmpdir());
    const file = Fs.createWriteStream(path, { flags: 'wx' });
    const counter = new internals.Counter();

    const finalize = Hoek.once((err) => {

        this.req.removeListener('aborted', onAbort);
        file.removeListener('close', finalize);
        file.removeListener('error', finalize);

        if (!err) {
            return callback(null, path, counter.bytes);
        }

        file.destroy();
        Fs.unlink(path, (/* fsErr */) => {      // Ignore unlink errors

            return callback(err);
        });
    });

    file.once('close', finalize);
    file.once('error', finalize);

    const onAbort = () => {

        return finalize(Boom.badRequest('Client connection aborted'));
    };

    this.req.once('aborted', onAbort);

    stream.pipe(counter).pipe(file);
};


internals.Counter = function () {

    Stream.Transform.call(this);
    this.bytes = 0;
};

Hoek.inherits(internals.Counter, Stream.Transform);


internals.Counter.prototype._transform = function (chunk, encoding, next) {

    this.bytes = this.bytes + chunk.length;
    return next(null, chunk);
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(2);
const B64 = __webpack_require__(90);
const Boom = __webpack_require__(1);
const Content = __webpack_require__(42);
const Hoek = __webpack_require__(0);
const Nigel = __webpack_require__(93);


// Declare internals

const internals = {};


/*
    RFC 2046 (http://tools.ietf.org/html/rfc2046)

    multipart-body = [preamble CRLF]
                    dash-boundary *( SPACE / HTAB ) CRLF body-part
                    *( CRLF dash-boundary *( SPACE / HTAB ) CRLF body-part )
                    CRLF dash-boundary "--" *( SPACE / HTAB )
                    [CRLF epilogue]

    boundary       = 0*69<bchars> bcharsnospace
    bchars         = bcharsnospace / " "
    bcharsnospace  = DIGIT / ALPHA / "'" / "(" / ")" / "+" / "_" / "," / "-" / "." / "/" / ":" / "=" / "?"
    dash-boundary  = "--" boundary

    preamble       = discard-text
    epilogue       = discard-text
    discard-text   = *(*text CRLF) *text

    body-part      = MIME-part-headers [CRLF *OCTET]
    OCTET          = <any 0-255 octet value>

    SPACE          = 32
    HTAB           = 9
    CRLF           = 13 10
*/


internals.state = {
    preamble: 0,                // Until the first boundary is received
    boundary: 1,                // After a boundary, waiting for first line with optional linear-whitespace
    header: 2,                  // Receiving part headers
    payload: 3,                 // Receiving part payload
    epilogue: 4
};


internals.defaults = {
    maxBytes: Infinity
};


exports.Dispenser = internals.Dispenser = function (options) {

    Stream.Writable.call(this);

    Hoek.assert(options !== null && typeof options === 'object',
                'options must be an object');
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    this._boundary = settings.boundary;
    this._state = internals.state.preamble;
    this._held = '';

    this._stream = null;
    this._headers = {};
    this._name = '';
    this._pendingHeader = '';
    this._error = null;
    this._bytes = 0;
    this._maxBytes = settings.maxBytes;

    this._parts = new Nigel.Stream(new Buffer('--' + settings.boundary));
    this._lines = new Nigel.Stream(new Buffer('\r\n'));

    this._parts.on('needle', () => {

        this._onPartEnd();
    });

    this._parts.on('haystack', (chunk) => {

        this._onPart(chunk);
    });

    this._lines.on('needle', () => {

        this._onLineEnd();
    });

    this._lines.on('haystack', (chunk) => {

        this._onLine(chunk);
    });

    this.once('finish', () => {

        this._parts.end();
    });

    this._parts.once('close', () => {

        this._lines.end();
    });

    let piper = null;
    let finish = (err) => {

        if (piper) {
            piper.removeListener('data', onReqData);
            piper.removeListener('error', finish);
            piper.removeListener('aborted', onReqAborted);
        }

        if (err) {
            return this._abort(err);
        }

        this._emit('close');
    };

    finish = Hoek.once(finish);

    this._lines.once('close', () => {

        if (this._state === internals.state.epilogue) {
            if (this._held) {
                this._emit('epilogue', this._held);
                this._held = '';
            }
        }
        else if (this._state === internals.state.boundary) {
            if (!this._held) {
                this._abort(Boom.badRequest('Missing end boundary'));
            }
            else if (this._held !== '--') {
                this._abort(Boom.badRequest('Only white space allowed after boundary at end'));
            }
        }
        else {
            this._abort(Boom.badRequest('Incomplete multipart payload'));
        }

        setImmediate(finish);                  // Give pending events a chance to fire
    });

    const onReqAborted = () => {

        finish(Boom.badRequest('Client request aborted'));
    };

    const onReqData = (data) => {

        this._bytes += Buffer.byteLength(data);

        if (this._bytes > this._maxBytes) {
            finish(Boom.badRequest('Maximum size exceeded'));
        }
    };

    this.once('pipe', (req) => {

        piper = req;
        req.on('data', onReqData);
        req.once('error', finish);
        req.once('aborted', onReqAborted);
    });
};

Hoek.inherits(internals.Dispenser, Stream.Writable);


internals.Dispenser.prototype._write = function (buffer, encoding, next) {

    if (this._error) {
        return next();
    }

    this._parts.write(buffer);
    return next();
};


internals.Dispenser.prototype._emit = function () {

    if (this._error) {
        return;
    }

    this.emit.apply(this, arguments);
};


internals.Dispenser.prototype._abort = function (err) {

    this._emit('error', err);
    this._error = err;
};


internals.Dispenser.prototype._onPartEnd = function () {

    this._lines.flush();

    if (this._state === internals.state.preamble) {
        if (this._held) {
            const last = this._held.length - 1;

            if (this._held[last] !== '\n' ||
                this._held[last - 1] !== '\r') {

                return this._abort(Boom.badRequest('Preamble missing CRLF terminator'));
            }

            this._emit('preamble', this._held.slice(0, -2));
            this._held = '';
        }

        this._parts.needle(new Buffer('\r\n--' + this._boundary));                      // CRLF no longer optional
    }

    this._state = internals.state.boundary;

    if (this._stream) {
        this._stream.end();
        this._stream = null;
    }
    else if (this._name) {
        this._emit('field', this._name, this._held);
        this._name = '';
        this._held = '';
    }
};


internals.Dispenser.prototype._onPart = function (chunk) {

    if (this._state === internals.state.preamble) {
        this._held = this._held + chunk.toString();
    }
    else if (this._state === internals.state.payload) {
        if (this._stream) {
            this._stream.write(chunk);                                                 // Stream payload
        }
        else {
            this._held = this._held + chunk.toString();
        }
    }
    else {
        this._lines.write(chunk);                                                       // Look for boundary
    }
};


internals.Dispenser.prototype._onLineEnd = function () {

    // Boundary whitespace

    if (this._state === internals.state.boundary) {
        if (this._held) {
            this._held = this._held.replace(/[\t ]/g, '');                                // trim() removes new lines
            if (this._held) {
                if (this._held === '--') {
                    this._state = internals.state.epilogue;
                    this._held = '';

                    return;
                }

                return this._abort(Boom.badRequest('Only white space allowed after boundary'));
            }
        }

        this._state = internals.state.header;

        return;
    }

    // Part headers

    if (this._state === internals.state.header) {

        // Header

        if (this._held) {

            // Header continuation

            if (this._held[0] === ' ' ||
                this._held[0] === '\t') {

                if (!this._pendingHeader) {
                    return this._abort(Boom.badRequest('Invalid header continuation without valid declaration on previous line'));
                }

                this._pendingHeader = this._pendingHeader + ' ' + this._held.slice(1);                       // Drop tab
                this._held = '';
                return;
            }

            // Start of new header

            this._flushHeader();
            this._pendingHeader = this._held;
            this._held = '';

            return;
        }

        // End of headers

        this._flushHeader();

        this._state = internals.state.payload;

        const disposition = Content.disposition(this._headers['content-disposition']);

        if (disposition.isBoom) {
            return this._abort(disposition);
        }

        if (disposition.filename !== undefined) {
            const stream = new Stream.PassThrough();
            const transferEncoding = this._headers['content-transfer-encoding'];

            if (transferEncoding &&
                transferEncoding.toLowerCase() === 'base64') {

                this._stream = new B64.Decoder();
                this._stream.pipe(stream);
            }
            else {
                this._stream = stream;
            }

            stream.name = disposition.name;
            stream.filename = disposition.filename;
            stream.headers = this._headers;
            this._headers = {};
            this._emit('part', stream);
        }
        else {
            this._name = disposition.name;
        }

        this._lines.flush();
        return;
    }

    // Epilogue

    this._held = this._held + '\r\n';                               // Put the new line back
};


internals.Dispenser.prototype._onLine = function (chunk) {

    if (this._stream) {
        this._stream.write(chunk);                      // Stream payload
    }
    else {
        this._held = this._held + chunk.toString();                 // Reading header or field
    }
};


internals.Dispenser.prototype._flushHeader = function () {

    if (!this._pendingHeader) {
        return;
    }

    const sep = this._pendingHeader.indexOf(':');

    if (sep === -1) {
        return this._abort(Boom.badRequest('Invalid header missing colon separator'));
    }

    if (!sep) {
        return this._abort(Boom.badRequest('Invalid header missing field name'));
    }

    this._headers[this._pendingHeader.slice(0, sep).toLowerCase()] = this._pendingHeader.slice(sep + 1).trim();
    this._pendingHeader = '';
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Decoder = __webpack_require__(91);
const Encoder = __webpack_require__(92);


exports.decode = Decoder.decode;
exports.encode = Encoder.encode;

exports.Decoder = Decoder.Decoder;
exports.Encoder = Encoder.Encoder;


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
    Decode functions adapted from:
    Version 1.0 12/25/99 Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
    http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt
*/

// Load modules

const Stream = __webpack_require__(2);


// Declare internals

const internals = {
    decodeChars: [
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
        52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
        -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
        -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
    ]
};


exports.decode = function (buffer) {

    const decodeChars = internals.decodeChars;
    const len = buffer.length;
    const allocated = Math.ceil(len / 4) * 3;
    const result = Buffer.alloc(allocated);

    let c1;
    let c2;
    let c3;
    let c4;
    let j = 0;

    for (let i = 0; i < len; ) {
        do {
            c1 = decodeChars[buffer[i++] & 0xff];
        }
        while (i < len && c1 === -1);

        if (c1 === -1) {
            break;
        }

        do {
            c2 = decodeChars[buffer[i++] & 0xff];
        }
        while (i < len && c2 === -1);

        if (c2 === -1) {
            break;
        }

        result[j++] = (c1 << 2) | ((c2 & 0x30) >> 4);

        do {
            c3 = buffer[i++] & 0xff;
            if (c3 === 61) {                        // =
                return result.slice(0, j);
            }

            c3 = decodeChars[c3];
        }
        while (i < len && c3 === -1);

        if (c3 === -1) {
            break;
        }

        result[j++] = ((c2 & 0x0f) << 4) | ((c3 & 0x3c) >> 2);

        do {
            c4 = buffer[i++] & 0xff;
            if (c4 === 61) {                        // =
                return result.slice(0, j);
            }

            c4 = decodeChars[c4];
        }
        while (i < len && c4 === -1);

        if (c4 !== -1) {
            result[j++] = ((c3 & 0x03) << 6) | c4;
        }
    }

    return (j === allocated ? result : result.slice(0, j));
};


exports.Decoder = class Decoder extends Stream.Transform {
    constructor() {

        super();
        this._reminder = null;
    }
    _transform(chunk, encoding, callback) {

        let part = this._reminder ? Buffer.concat([this._reminder, chunk]) : chunk;
        const remaining = part.length % 4;
        if (remaining) {
            this._reminder = part.slice(part.length - remaining);
            part = part.slice(0, part.length - remaining);
        }
        else {
            this._reminder = null;
        }

        this.push(exports.decode(part));
        return callback();
    }
    _flush(callback) {

        if (this._reminder) {
            this.push(exports.decode(this._reminder));
        }

        return callback();
    }
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
    Encode functions adapted from:
    Version 1.0 12/25/99 Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
    http://www.onicos.com/staff/iz/amuse/javascript/expert/base64.txt
*/

// Load modules

const Stream = __webpack_require__(2);


// Declare internals

const internals = {};


exports.encode = function (buffer) {

    return Buffer.from(buffer.toString('base64'));
};


exports.Encoder = class Encoder extends Stream.Transform {
    constructor() {

        super();
        this._reminder = null;
    }
    _transform(chunk, encoding, callback) {

        let part = this._reminder ? Buffer.concat([this._reminder, chunk]) : chunk;
        const remaining = part.length % 3;
        if (remaining) {
            this._reminder = part.slice(part.length - remaining);
            part = part.slice(0, part.length - remaining);
        }
        else {
            this._reminder = null;
        }

        this.push(exports.encode(part));
        return callback();
    }
    _flush(callback) {

        if (this._reminder) {
            this.push(exports.encode(this._reminder));
        }

        return callback();
    }
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Stream = __webpack_require__(2);
const Hoek = __webpack_require__(0);
const Vise = __webpack_require__(94);


// Declare internals

const internals = {};


exports.compile = function (needle) {

    Hoek.assert(needle && needle.length, 'Missing needle');
    Hoek.assert(Buffer.isBuffer(needle), 'Needle must be a buffer');

    const profile = {
        value: needle,
        lastPos: needle.length - 1,
        last: needle[needle.length - 1],
        length: needle.length,
        badCharShift: new Buffer(256)                  // Lookup table of how many characters can be skipped for each match
    };

    for (let i = 0; i < 256; ++i) {
        profile.badCharShift[i] = profile.length;       // Defaults to the full length of the needle
    }

    const last = profile.length - 1;
    for (let i = 0; i < last; ++i) {                    // For each character in the needle (skip last since its position is already the default)
        profile.badCharShift[profile.value[i]] = last - i;
    }

    return profile;
};


exports.horspool = function (haystack, needle, start) {

    Hoek.assert(haystack, 'Missing haystack');

    needle = (needle.badCharShift ? needle : exports.compile(needle));
    start = start || 0;

    for (let i = start; i <= haystack.length - needle.length;) {       // Has enough room to fit the entire needle
        const lastChar = haystack.readUInt8(i + needle.lastPos, true);
        if (lastChar === needle.last &&
            internals.startsWith(haystack, needle, i)) {

            return i;
        }

        i += needle.badCharShift[lastChar];           // Jump to the next possible position based on last character location in needle
    }

    return -1;
};


internals.startsWith = function (haystack, needle, pos) {

    if (haystack.startsWith) {
        return haystack.startsWith(needle.value, pos, needle.lastPos);
    }

    for (let i = 0; i < needle.lastPos; ++i) {
        if (needle.value[i] !== haystack.readUInt8(pos + i, true)) {
            return false;
        }
    }

    return true;
};


exports.all = function (haystack, needle, start) {

    needle = exports.compile(needle);
    start = start || 0;

    const matches = [];
    for (let i = start; i !== -1 && i < haystack.length;) {

        i = exports.horspool(haystack, needle, i);
        if (i !== -1) {
            matches.push(i);
            i += needle.length;
        }
    }

    return matches;
};


internals._indexOf = function (haystack, needle) {

    Hoek.assert(haystack, 'Missing haystack');

    for (let i = 0; i <= haystack.length - needle.length; ++i) {       // Has enough room to fit the entire needle
        if (haystack.startsWith(needle.value, i)) {
            return i;
        }
    }

    return -1;
};


exports.Stream = internals.Stream = function (needle) {

    const self = this;

    Stream.Writable.call(this);

    this.needle(needle);
    this._haystack = new Vise();
    this._indexOf = this._needle.length > 2 ? exports.horspool : internals._indexOf;

    this.on('finish', () => {

        // Flush out the remainder

        const chunks = self._haystack.chunks();
        for (let i = 0; i < chunks.length; ++i) {
            self.emit('haystack', chunks[i]);
        }

        setImmediate(() => {                  // Give pending events a chance to fire

            self.emit('close');
        });
    });
};

Hoek.inherits(internals.Stream, Stream.Writable);


internals.Stream.prototype.needle = function (needle) {

    this._needle = exports.compile(needle);
};


internals.Stream.prototype._write = function (chunk, encoding, next) {

    this._haystack.push(chunk);

    let match = this._indexOf(this._haystack, this._needle);
    if (match === -1 &&
        chunk.length >= this._needle.length) {

        this._flush(this._haystack.length - chunk.length);
    }

    while (match !== -1) {
        this._flush(match);
        this._haystack.shift(this._needle.length);
        this.emit('needle');

        match = this._indexOf(this._haystack, this._needle);
    }

    if (this._haystack.length) {
        const notChecked = this._haystack.length - this._needle.length + 1;       // Not enough space for Horspool
        let i = notChecked;
        for (; i < this._haystack.length; ++i) {
            if (this._haystack.startsWith(this._needle.value, i, this._haystack.length - i)) {
                break;
            }
        }

        this._flush(i);
    }

    return next();
};


internals.Stream.prototype._flush = function (pos) {

    const chunks = this._haystack.shift(pos);
    for (let i = 0; i < chunks.length; ++i) {
        this.emit('haystack', chunks[i]);
    }
};


internals.Stream.prototype.flush = function () {

    const chunks = this._haystack.shift(this._haystack.length);
    for (let i = 0; i < chunks.length; ++i) {
        this.emit('haystack', chunks[i]);
    }
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports = module.exports = internals.Vise = function (chunks) {

    this.length = 0;
    this._chunks = [];
    this._offset = 0;

    if (chunks) {
        chunks = [].concat(chunks);
        for (let i = 0; i < chunks.length; ++i) {
            this.push(chunks[i]);
        }
    }
};


internals.Vise.prototype.push = function (chunk) {

    Hoek.assert(Buffer.isBuffer(chunk), 'Chunk must be a buffer');

    const item = {
        data: chunk,
        length: chunk.length,
        offset: this.length + this._offset,
        index: this._chunks.length
    };

    this._chunks.push(item);
    this.length += chunk.length;
};


internals.Vise.prototype.shift = function (length) {

    if (!length) {
        return [];
    }

    const prevOffset = this._offset;
    const item = this._chunkAt(length);

    let dropTo = this._chunks.length;
    this._offset = 0;

    if (item) {
        dropTo = item.chunk.index;
        this._offset = item.offset;
    }

    // Drop lower chunks

    const chunks = [];
    for (let i = 0; i < dropTo; ++i) {
        const chunk = this._chunks.shift();
        if (i === 0 &&
            prevOffset) {

            chunks.push(chunk.data.slice(prevOffset));
        }
        else {
            chunks.push(chunk.data);
        }
    }

    if (this._offset) {
        chunks.push(item.chunk.data.slice(dropTo ? 0 : prevOffset, this._offset));
    }

    // Recalculate existing chunks

    this.length = 0;
    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        chunk.offset = this.length,
        chunk.index = i;

        this.length += chunk.length;
    }

    this.length -= this._offset;

    return chunks;
};


internals.Vise.prototype.at = internals.Vise.prototype.readUInt8 = function (pos) {

    const item = this._chunkAt(pos);
    return item ? item.chunk.data[item.offset] : undefined;
};


internals.Vise.prototype._chunkAt = function (pos) {

    if (pos < 0) {
        return null;
    }

    pos = pos + this._offset;

    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        const offset = pos - chunk.offset;
        if (offset < chunk.length) {
            return { chunk: chunk, offset: offset };
        }
    }

    return null;
};


internals.Vise.prototype.chunks = function () {

    const chunks = [];

    for (let i = 0; i < this._chunks.length; ++i) {
        const chunk = this._chunks[i];
        if (i === 0 &&
            this._offset) {

            chunks.push(chunk.data.slice(this._offset));
        }
        else {
            chunks.push(chunk.data);
        }
    }

    return chunks;
};


internals.Vise.prototype.startsWith = function (value, pos, length) {

    pos = pos || 0;

    length = length ? Math.min(value.length, length) : value.length;
    if (pos + length > this.length) {                                   // Not enough length to fit value
        return false;
    }

    const start = this._chunkAt(pos);
    if (!start) {
        return false;
    }

    let j = start.chunk.index;
    for (let i = 0; j < this._chunks.length && i < length; ++j) {
        const chunk = this._chunks[j];

        let k = (j === start.chunk.index ? start.offset : 0);
        for (; k < chunk.length && i < length; ++k, ++i) {
            if (chunk.data[k] !== value[i]) {
                return false;
            }
        }
    }

    return true;
};


/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Stream = __webpack_require__(2);


// Declare internals

const internals = {};


module.exports = internals.Recorder = function (options) {

    Stream.Writable.call(this);

    this.settings = options;                // No need to clone since called internally with new object
    this.buffers = [];
    this.length = 0;
};

Hoek.inherits(internals.Recorder, Stream.Writable);


internals.Recorder.prototype._write = function (chunk, encoding, next) {

    if (this.settings.maxBytes &&
        this.length + chunk.length > this.settings.maxBytes) {

        return this.emit('error', Boom.badRequest('Payload content length greater than maximum allowed: ' + this.settings.maxBytes));
    }

    this.length = this.length + chunk.length;
    this.buffers.push(chunk);
    next();
};


internals.Recorder.prototype.collect = function () {

    const buffer = (this.buffers.length === 0 ? new Buffer(0) : (this.buffers.length === 1 ? this.buffers[0] : Buffer.concat(this.buffers, this.length)));
    return buffer;
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Stream = __webpack_require__(2);
const Payload = __webpack_require__(44);


// Declare internals

const internals = {};


module.exports = internals.Tap = function () {

    Stream.Transform.call(this);
    this.buffers = [];
};

Hoek.inherits(internals.Tap, Stream.Transform);


internals.Tap.prototype._transform = function (chunk, encoding, next) {

    this.buffers.push(chunk);
    next(null, chunk);
};


internals.Tap.prototype.collect = function () {

    return new Payload(this.buffers);
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Boom = __webpack_require__(1);
const Items = __webpack_require__(6);
const Methods = __webpack_require__(45);
const Promises = __webpack_require__(27);
const Response = __webpack_require__(15);


// Declare internals

const internals = {};


exports.execute = function (request, next) {

    const finalize = (err, result) => {

        request._setResponse(err || result);
        return next();                              // Must not include an argument
    };

    request._protect.run(finalize, (exit) => {

        if (request._route._prerequisites) {
            internals.prerequisites(request, Hoek.once(exit));
        }
        else {
            internals.handler(request, exit);
        }
    });
};


internals.prerequisites = function (request, callback) {

    const each = (set, nextSet) => {

        Items.parallel(set, (pre, next) => {

            pre(request, (err, result) => {

                if (err) {
                    return next(err);
                }

                if (result._takeover) {
                    return callback(null, result);
                }

                return next();
            });
        }, nextSet);
    };

    const domain = request.domain;      // Save a reference to the current domain

    Items.serial(request._route._prerequisites, each, (err) => {

        if (err) {
            return callback(err);
        }

        const wrapped = domain ? domain.bind(internals.handler) : internals.handler;
        return wrapped(request, callback);
    });
};


internals.handler = function (request, callback) {

    const timer = new Hoek.Bench();
    const finalize = (response) => {

        if (response === null) {                            // reply.continue()
            response = Response.wrap(null, request);
            return response._prepare(finalize);
        }

        // Check for Error result

        if (response.isBoom) {
            request._log(['handler', 'error'], { msec: timer.elapsed(), error: response.message, data: response });
            return callback(response);
        }

        request._log(['handler'], { msec: timer.elapsed() });
        return callback(null, response);
    };

    // Decorate request

    const reply = request.server._replier.interface(request, request.route.realm, {}, finalize);
    const bind = request.route.settings.bind;

    // Execute handler

    const result = request.route.settings.handler.call(bind, request, reply);
    if (result &&
        Promises.isThennable(result)) {

        result.then(null, (err) => reply(err instanceof Error ? Boom.boomify(err) : Boom.badImplementation('Unhandled rejected promise', err)));
    }
};


exports.defaults = function (method, handler, server) {

    let defaults = null;

    if (typeof handler === 'object') {
        const type = Object.keys(handler)[0];
        const serverHandler = server._handlers[type];

        Hoek.assert(serverHandler, 'Unknown handler:', type);

        if (serverHandler.defaults) {
            defaults = (typeof serverHandler.defaults === 'function' ? serverHandler.defaults(method) : serverHandler.defaults);
        }
    }

    return defaults || {};
};


exports.configure = function (handler, route) {

    if (typeof handler === 'object') {
        const type = Object.keys(handler)[0];
        const serverHandler = route.server._handlers[type];

        Hoek.assert(serverHandler, 'Unknown handler:', type);

        return serverHandler(route.public, handler[type]);
    }

    if (typeof handler === 'string') {
        const parsed = internals.fromString('handler', handler, route.server);
        return parsed.method;
    }

    return handler;
};


exports.prerequisitesConfig = function (config, server) {

    if (!config) {
        return null;
    }

    /*
        [
            [
                function (request, reply) { },
                {
                    method: function (request, reply) { }
                    assign: key1
                },
                {
                    method: function (request, reply) { },
                    assign: key2
                }
            ],
            'user(params.id)'
        ]
    */

    const prerequisites = [];

    for (let i = 0; i < config.length; ++i) {
        const pres = [].concat(config[i]);

        const set = [];
        for (let j = 0; j < pres.length; ++j) {
            let pre = pres[j];
            if (typeof pre !== 'object') {
                pre = { method: pre };
            }

            const item = {
                method: pre.method,
                assign: pre.assign,
                failAction: pre.failAction || 'error'
            };

            if (typeof item.method === 'string') {
                const parsed = internals.fromString('pre', item.method, server);
                item.method = parsed.method;
                item.assign = item.assign || parsed.name;
            }

            set.push(internals.pre(item));
        }

        prerequisites.push(set);
    }

    return prerequisites.length ? prerequisites : null;
};


internals.fromString = function (type, notation, server) {

    //                                  1:name            2:(        3:arguments
    const methodParts = notation.match(/^([\w\.]+)(?:\s*)(?:(\()(?:\s*)(\w+(?:\.\w+)*(?:\s*\,\s*\w+(?:\.\w+)*)*)?(?:\s*)\))?$/);
    Hoek.assert(methodParts, 'Invalid server method string notation:', notation);

    const name = methodParts[1];
    Hoek.assert(name.match(Methods.methodNameRx), 'Invalid server method name:', name);

    const method = server._methods._normalized[name];
    Hoek.assert(method, 'Unknown server method in string notation:', notation);

    const result = { name };
    const argsNotation = !!methodParts[2];
    const methodArgs = (argsNotation ? (methodParts[3] || '').split(/\s*\,\s*/) : null);

    result.method = (request, reply) => {

        if (!argsNotation) {
            return method(request, reply);                      // Method is already bound to context
        }

        const finalize = (err, value, cached, report) => {

            if (report) {
                request._log([type, 'method', name], report);
            }

            return reply(err, value);
        };

        const args = [];
        for (let i = 0; i < methodArgs.length; ++i) {
            const arg = methodArgs[i];
            if (arg) {
                args.push(Hoek.reach(request, arg));
            }
        }

        args.push(finalize);
        method.apply(null, args);
    };

    return result;
};


internals.pre = function (pre) {

    /*
        {
            method: function (request, next) { }
            assign:     'key'
            failAction: 'error'* | 'log' | 'ignore'
        }
    */

    return (request, next) => {

        const timer = new Hoek.Bench();
        const finalize = (response) => {

            if (response === null) {                            // reply.continue()
                response = Response.wrap(null, request);
                return response._prepare(finalize);
            }

            if (response instanceof Error) {
                if (pre.failAction !== 'ignore') {
                    request._log(['pre', 'error'], { msec: timer.elapsed(), assign: pre.assign, error: response });
                }

                if (pre.failAction === 'error') {
                    return next(response);
                }
            }
            else {
                request._log(['pre'], { msec: timer.elapsed(), assign: pre.assign });
            }

            if (pre.assign) {
                request.pre[pre.assign] = (response instanceof Error ? response : response.source);
                request.preResponses[pre.assign] = response;
            }

            return next(null, response);
        };

        // Setup environment

        const reply = request.server._replier.interface(request, request.route.realm, {}, finalize);
        const bind = request.route.settings.bind;

        // Execute handler

        pre.method.call(bind, request, reply);
    };
};


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);


// Declare internals

const internals = {};


exports.compile = function (rule) {

    // null, undefined, true - anything allowed
    // false - nothing allowed
    // {...} - ... allowed

    return (rule === false) ?
        Joi.object({}).allow(null) :
        (typeof rule === 'function' ?
            rule :
            !rule || rule === true ? null : Joi.compile(rule));     // false tested earlier

};


exports.query = function (request, next) {

    return internals.input('query', request, next);
};


exports.payload = function (request, next) {

    if (request.method === 'get' ||
        request.method === 'head') {                // When route.method is '*'

        return next();
    }

    return internals.input('payload', request, next);
};


exports.params = function (request, next) {

    return internals.input('params', request, next);
};


exports.headers = function (request, next) {

    return internals.input('headers', request, next);
};


internals.input = function (source, request, next) {

    const postValidate = (err, value) => {

        request.orig[source] = request[source];
        if (value !== undefined) {
            request[source] = value;
        }

        if (!err) {
            return next();
        }

        if (err.isDeveloperError) {
            return next(err);
        }

        // failAction: 'error', 'log', 'ignore', function (source, err, next)

        if (request.route.settings.validate.failAction === 'ignore') {
            return next();
        }

        // Prepare error

        const error = (err.isBoom ? err : Boom.badRequest(err.message, err));
        error.output.payload.validation = { source, keys: [] };
        if (err.details) {
            for (let i = 0; i < err.details.length; ++i) {
                error.output.payload.validation.keys.push(Hoek.escapeHtml(err.details[i].path));
            }
        }

        if (request.route.settings.validate.errorFields) {
            const fields = Object.keys(request.route.settings.validate.errorFields);
            for (let i = 0; i < fields.length; ++i) {
                const field = fields[i];
                error.output.payload[field] = request.route.settings.validate.errorFields[field];
            }
        }

        request._log(['validation', 'error', source], error);

        // Log only

        if (request.route.settings.validate.failAction === 'log') {
            return next();
        }

        // Return error

        if (typeof request.route.settings.validate.failAction !== 'function') {
            return next(error);
        }

        // Custom handler

        request._protect.run(next, (exit) => {

            const reply = request.server._replier.interface(request, request.route.realm, {}, exit);
            request.route.settings.validate.failAction(request, reply, source, error);
        });
    };

    const localOptions = {
        context: {
            headers: request.headers,
            params: request.params,
            query: request.query,
            payload: request.payload,
            auth: request.auth,
            app: {
                route: request.route.settings.app,
                request: request.app
            }
        }
    };

    delete localOptions.context[source];
    Hoek.merge(localOptions, request.route.settings.validate.options);

    const schema = request.route.settings.validate[source];
    if (typeof schema !== 'function') {
        return Joi.validate(request[source], schema, localOptions, postValidate);
    }

    request._protect.run(postValidate, (exit) => {

        const bind = request.route.settings.bind;
        return schema.call(bind, request[source], localOptions, exit);
    });
};


exports.response = function (request, next) {

    if (request.route.settings.response.sample) {
        const currentSample = Math.ceil((Math.random() * 100));
        if (currentSample > request.route.settings.response.sample) {
            return next();
        }
    }

    const response = request.response;
    const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;

    const statusSchema = request.route.settings.response.status[statusCode];
    if (statusCode >= 400 &&
        !statusSchema) {

        return next();          // Do not validate errors by default
    }

    const schema = statusSchema || request.route.settings.response.schema;
    if (schema === null) {
        return next();          // No rules
    }

    if (!response.isBoom &&
        request.response.variety !== 'plain') {

        return next(Boom.badImplementation('Cannot validate non-object response'));
    }

    const postValidate = (err, value) => {

        if (!err) {
            if (value !== undefined &&
                request.route.settings.response.modify) {

                if (response.isBoom) {
                    response.output.payload = value;
                }
                else {
                    response.source = value;
                }
            }

            return next();
        }

        // failAction: 'error', 'log'

        if (request.route.settings.response.failAction === 'log') {
            request._log(['validation', 'response', 'error'], err.message);
            return next();
        }

        // Return error

        if (typeof request.route.settings.response.failAction !== 'function') {
            return next(Boom.badImplementation(err.message));
        }

        // Custom handler

        request._protect.run(next, (exit) => {

            const reply = request.server._replier.interface(request, request.route.realm, {}, exit);
            request.route.settings.response.failAction(request, reply, err);
        });
    };

    const localOptions = {
        context: {
            headers: request.headers,
            params: request.params,
            query: request.query,
            payload: request.payload,
            auth: request.auth,
            app: {
                route: request.route.settings.app,
                request: request.app
            }
        }
    };

    const source = response.isBoom ? response.output.payload : response.source;
    Hoek.merge(localOptions, request.route.settings.response.options);

    if (typeof schema !== 'function') {
        return Joi.validate(source, schema, localOptions, postValidate);
    }

    request._protect.run(postValidate, (exit) => {

        return schema(source, localOptions, exit);
    });
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Catbox = __webpack_require__(16);
const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Podium = __webpack_require__(9);
const Connection = __webpack_require__(36);
const Ext = __webpack_require__(14);
const Package = __webpack_require__(101);
const Promises = __webpack_require__(27);
const Schema = __webpack_require__(11);


// Declare internals

const internals = {};


exports = module.exports = internals.Plugin = function (server, connections, env, parent) {         // env can be a realm or plugin name

    Podium.call(this, [connections && connections.length ? connections : Connection._events, server._events]);

    this._parent = parent;

    // Public interface

    this.root = server;
    this.app = this.root._app;
    this.connections = connections;
    this.load = this.root._heavy.load;
    this.methods = this.root._methods.methods;
    this.mime = this.root._mime;
    this.plugins = this.root._plugins;
    this.settings = this.root._settings;
    this.version = Package.version;

    this.realm = typeof env !== 'string' ? env : {
        _extensions: {
            onPreAuth: new Ext('onPreAuth', this.root),
            onPostAuth: new Ext('onPostAuth', this.root),
            onPreHandler: new Ext('onPreHandler', this.root),
            onPostHandler: new Ext('onPostHandler', this.root),
            onPreResponse: new Ext('onPreResponse', this.root)
        },
        modifiers: {
            route: {}
        },
        plugin: env,
        pluginOptions: {},
        plugins: {},
        settings: {
            bind: undefined,
            files: {
                relativeTo: undefined
            }
        }
    };

    this.auth = {
        default: (opts) => this._applyChild('auth.default', 'auth', 'default', [opts]),
        scheme: (name, scheme) => this._applyChild('auth.scheme', 'auth', 'scheme', [name, scheme]),
        strategy: (name, scheme, mode, opts) => this._applyChild('auth.strategy', 'auth', 'strategy', [name, scheme, mode, opts]),
        test: (name, request, next) => request.connection.auth.test(name, request, next)
    };

    this.cache = internals.cache(this);
    this._single();

    // Decorations

    const methods = Object.keys(this.root._decorations);
    for (let i = 0; i < methods.length; ++i) {
        const method = methods[i];
        this[method] = this.root._decorations[method];
    }
};

Hoek.inherits(internals.Plugin, Podium);


internals.Plugin.prototype._single = function () {

    if (this.connections &&
        this.connections.length === 1) {

        this.info = this.connections[0].info;
        this.listener = this.connections[0].listener;
        this.registrations = this.connections[0].registrations;
        this.auth.api = this.connections[0].auth.api;
    }
    else {
        this.info = null;
        this.listener = null;
        this.registrations = null;
        this.auth.api = null;
    }
};


internals.Plugin.prototype.select = function (/* labels */) {

    let labels = [];
    for (let i = 0; i < arguments.length; ++i) {
        labels.push(arguments[i]);
    }

    labels = Hoek.flatten(labels);
    return this._select(labels);
};


internals.Plugin.prototype._select = function (labels, plugin) {

    let connections = this.connections;

    if (labels &&
        labels.length) {            // Captures both empty arrays and empty strings

        Hoek.assert(this.connections, 'Cannot select inside a connectionless plugin');

        connections = [];
        for (let i = 0; i < this.connections.length; ++i) {
            const connection = this.connections[i];
            if (Hoek.intersect(connection.settings.labels, labels).length) {
                connections.push(connection);
            }
        }

        if (!plugin &&
            connections.length === this.connections.length) {

            return this;
        }
    }

    const env = (plugin !== undefined ? plugin : this.realm);                     // Allow empty string
    return new internals.Plugin(this.root, connections, env, this);
};


internals.Plugin.prototype._clone = function (connections, plugin) {

    const env = (plugin !== undefined ? plugin : this.realm);                     // Allow empty string
    return new internals.Plugin(this.root, connections, env, this);
};


internals.Plugin.prototype.register = function (plugins /*, [options], callback */) {

    let options = (typeof arguments[1] === 'object' ? arguments[1] : {});
    const callback = (typeof arguments[1] === 'object' ? arguments[2] : arguments[1]);

    if (!callback) {
        return Promises.wrap(this, this.register, [plugins, options]);
    }

    if (this.realm.modifiers.route.prefix ||
        this.realm.modifiers.route.vhost) {

        options = Hoek.clone(options);
        options.routes = options.routes || {};

        options.routes.prefix = (this.realm.modifiers.route.prefix || '') + (options.routes.prefix || '') || undefined;
        options.routes.vhost = this.realm.modifiers.route.vhost || options.routes.vhost;
    }

    options = Schema.apply('register', options);

    /*
        const register = function (server, options, next) { return next(); };
        register.attributes = {
            pkg: require('../package.json'),
            name: 'plugin',
            version: '1.1.1',
            multiple: false,
            dependencies: [],
            connections: false,
            once: true
        };

        const item = {
            register: register,
            options: options        // -optional--
        };

        - OR -

        const item = function () {}
        item.register = register;
        item.options = options;

        const plugins = register, items, [register, item]
    */

    const registrations = [];
    plugins = [].concat(plugins);
    for (let i = 0; i < plugins.length; ++i) {
        let plugin = plugins[i];

        if (typeof plugin === 'function') {
            if (!plugin.register) {                                 // plugin is register() function
                plugin = { register: plugin };
            }
            else {
                plugin = Hoek.shallow(plugin);                      // Convert function to object
            }
        }

        if (plugin.register.register) {                             // Required plugin
            plugin.register = plugin.register.register;
        }

        plugin = Schema.apply('plugin', plugin);

        const attributes = plugin.register.attributes;
        const registration = {
            register: plugin.register,
            name: attributes.name || attributes.pkg.name,
            version: attributes.version || attributes.pkg.version,
            multiple: attributes.multiple,
            pluginOptions: plugin.options,
            dependencies: attributes.dependencies,
            connections: attributes.connections,
            options: {
                once: attributes.once || (plugin.once !== undefined ? plugin.once : options.once),
                routes: {
                    prefix: plugin.routes.prefix || options.routes.prefix,
                    vhost: plugin.routes.vhost || options.routes.vhost
                },
                select: plugin.select || options.select
            }
        };

        registrations.push(registration);
    }

    this.root._registring = true;

    const each = (item, next) => {

        const selection = this._select(item.options.select, item.name);
        selection.realm.modifiers.route.prefix = item.options.routes.prefix;
        selection.realm.modifiers.route.vhost = item.options.routes.vhost;
        selection.realm.pluginOptions = item.pluginOptions || {};

        const registrationData = {
            version: item.version,
            name: item.name,
            options: item.pluginOptions,
            attributes: item.register.attributes
        };

        // Protect against multiple registrations

        const connectionless = (item.connections === 'conditional' ? selection.connections.length === 0 : !item.connections);
        if (connectionless) {
            if (this.root._registrations[item.name]) {
                if (item.options.once) {
                    return next();
                }

                Hoek.assert(item.multiple, 'Plugin', item.name, 'already registered');
            }
            else {
                this.root._registrations[item.name] = registrationData;
            }
        }

        const connections = [];
        if (selection.connections) {
            for (let i = 0; i < selection.connections.length; ++i) {
                const connection = selection.connections[i];
                if (connection.registrations[item.name]) {
                    if (item.options.once) {
                        continue;
                    }

                    Hoek.assert(item.multiple, 'Plugin', item.name, 'already registered in:', connection.info.uri);
                }
                else {
                    connection.registrations[item.name] = registrationData;
                }

                connections.push(connection);
            }

            if (item.options.once &&
                !connectionless &&
                !connections.length) {

                return next();                                              // All the connections already registered
            }
        }

        selection.connections = (connectionless ? null : connections);
        selection._single();

        if (item.dependencies) {
            selection.dependency(item.dependencies);
        }

        if (connectionless) {
            selection.connection = this.root.connection;
        }

        // Register

        item.register(selection, item.pluginOptions || {}, next);
    };

    Items.serial(registrations, each, (err) => {

        this.root._registring = false;
        return Hoek.nextTick(callback)(err);
    });
};


internals.Plugin.prototype.bind = function (context) {

    Hoek.assert(typeof context === 'object', 'bind must be an object');
    this.realm.settings.bind = context;
};


internals.cache = (plugin) => {

    const policy = function (options, _segment) {

        options = Schema.apply('cachePolicy', options);

        const segment = options.segment || _segment || (plugin.realm.plugin ? '!' + plugin.realm.plugin : '');
        Hoek.assert(segment, 'Missing cache segment name');

        const cacheName = options.cache || '_default';
        const cache = plugin.root._caches[cacheName];
        Hoek.assert(cache, 'Unknown cache', cacheName);
        Hoek.assert(!cache.segments[segment] || cache.shared || options.shared, 'Cannot provision the same cache segment more than once');
        cache.segments[segment] = true;

        return new Catbox.Policy(options, cache.client, segment);
    };

    policy.provision = (opts, callback) => {

        if (!callback) {
            return Promises.wrap(null, plugin.cache.provision, [opts]);
        }

        return plugin.root._createCache(opts, callback);
    };

    return policy;
};


internals.Plugin.prototype.decoder = function (encoding, decoder) {

    this._apply('decoder', Connection.prototype.decoder, [encoding, decoder]);
};


internals.Plugin.prototype.decorate = function (type, property, method, options) {

    Hoek.assert(['reply', 'request', 'server'].indexOf(type) !== -1, 'Unknown decoration type:', type);
    Hoek.assert(property, 'Missing decoration property name');
    Hoek.assert(typeof property === 'string', 'Decoration property must be a string');
    Hoek.assert(property[0] !== '_', 'Property name cannot begin with an underscore:', property);

    // Request

    if (type === 'request') {
        this.root._requestor.decorate(property, method, options);
        this.root.decorations.request.push(property);
        return;
    }

    Hoek.assert(!options, 'Cannot specify options for non-request decoration');

    // Reply

    if (type === 'reply') {
        this.root._replier.decorate(property, method);
        this.root.decorations.reply.push(property);
        return;
    }

    // Server

    Hoek.assert(!this.root._decorations[property], 'Server decoration already defined:', property);
    Hoek.assert(this[property] === undefined && this.root[property] === undefined, 'Cannot override the built-in server interface method:', property);

    this.root._decorations[property] = method;
    this.root.decorations.server.push(property);

    this[property] = method;
    let parent = this._parent;
    while (parent) {
        parent[property] = method;
        parent = parent._parent;
    }
};

internals.Plugin.prototype.dependency = function (dependencies, after) {

    Hoek.assert(this.realm.plugin, 'Cannot call dependency() outside of a plugin');
    Hoek.assert(!after || typeof after === 'function', 'Invalid after method');

    dependencies = [].concat(dependencies);
    this.root._dependencies.push({ plugin: this.realm.plugin, connections: this.connections, deps: dependencies });

    if (after) {
        this.ext('onPreStart', after, { after: dependencies });
    }
};


internals.Plugin.prototype.emit = function (criteria, data, callback) {

    this.root._events.emit(criteria, data, callback);
};


internals.Plugin.prototype.encoder = function (encoding, encoder) {

    this._apply('encoder', Connection.prototype.encoder, [encoding, encoder]);
};


internals.Plugin.prototype.event = function (event) {

    this.root._events.registerEvent(event);
};


internals.Plugin.prototype.expose = function (key, value) {

    Hoek.assert(this.realm.plugin, 'Cannot call expose() outside of a plugin');

    const plugin = this.realm.plugin;
    this.root.plugins[plugin] = this.root.plugins[plugin] || {};

    if (typeof key === 'string') {
        this.root.plugins[plugin][key] = value;
    }
    else {
        Hoek.merge(this.root.plugins[plugin], key);
    }
};


internals.Plugin.prototype.ext = function (events) {        // (event, method, options) -OR- (events)

    if (typeof events === 'string') {
        events = { type: arguments[0], method: arguments[1], options: arguments[2] };
    }

    events = Schema.apply('exts', events);

    for (let i = 0; i < events.length; ++i) {
        this._ext(events[i]);
    }
};


internals.Plugin.prototype._ext = function (event) {

    event = Hoek.shallow(event);
    event.plugin = this;
    const type = event.type;

    if (!this.root._extensions[type]) {

        // Realm route extensions

        if (event.options.sandbox === 'plugin') {
            Hoek.assert(this.realm._extensions[type], 'Unknown event type', type);
            return this.realm._extensions[type].add(event);
        }

        // Connection route extensions

        return this._apply('ext', Connection.prototype._ext, [event]);
    }

    // Server extensions

    Hoek.assert(!event.options.sandbox, 'Cannot specify sandbox option for server extension');
    Hoek.assert(type !== 'onPreStart' || this.root._state === 'stopped', 'Cannot add onPreStart (after) extension after the server was initialized');
    this.root._extensions[type].add(event);
};


internals.Plugin.prototype.handler = function (name, method) {

    Hoek.assert(typeof name === 'string', 'Invalid handler name');
    Hoek.assert(!this.root._handlers[name], 'Handler name already exists:', name);
    Hoek.assert(typeof method === 'function', 'Handler must be a function:', name);
    Hoek.assert(!method.defaults || typeof method.defaults === 'object' || typeof method.defaults === 'function', 'Handler defaults property must be an object or function');
    this.root._handlers[name] = method;
};


internals.Plugin.prototype.inject = function (options, callback) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].inject(options, callback);
};


internals.Plugin.prototype.log = function (tags, data, timestamp, _internal) {

    tags = [].concat(tags);
    timestamp = (timestamp ? (timestamp instanceof Date ? timestamp.getTime() : timestamp) : Date.now());
    const internal = !!_internal;

    const update = (typeof data !== 'function' ? { timestamp, tags, data, internal } : () => {

        return { timestamp, tags, data: data(), internal };
    });

    this.root._events.emit({ name: 'log', tags }, update);
};


internals.Plugin.prototype._log = function (tags, data) {

    return this.log(tags, data, null, true);
};


internals.Plugin.prototype.lookup = function (id) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].lookup(id);
};


internals.Plugin.prototype.match = function (method, path, host) {

    Hoek.assert(this.connections.length === 1, 'Method not available when the selection has more than one connection or none');
    return this.connections[0].match(method, path, host);
};


internals.Plugin.prototype.method = function (name, method, options) {

    return this.root._methods.add(name, method, options, this.realm);
};


internals.Plugin.prototype.path = function (relativeTo) {

    Hoek.assert(relativeTo && typeof relativeTo === 'string', 'relativeTo must be a non-empty string');
    this.realm.settings.files.relativeTo = relativeTo;
};


internals.Plugin.prototype.route = function (options) {

    Hoek.assert(arguments.length === 1, 'Method requires a single object argument or a single array of objects');
    Hoek.assert(typeof options === 'object', 'Invalid route options');
    Hoek.assert(this.connections, 'Cannot add route from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add a route without any connections');

    this._apply('route', Connection.prototype._route, [options, this]);
};


internals.Plugin.prototype.state = function (name, options) {

    this._applyChild('state', 'states', 'add', [name, options]);
};


internals.Plugin.prototype.table = function (host) {

    Hoek.assert(this.connections, 'Cannot request routing table from a connectionless plugin');

    const table = [];
    for (let i = 0; i < this.connections.length; ++i) {
        const connection = this.connections[i];
        table.push({ info: connection.info, labels: connection.settings.labels, table: connection.table(host) });
    }

    return table;
};


internals.Plugin.prototype._apply = function (type, func, args) {

    Hoek.assert(this.connections, 'Cannot add ' + type + ' from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add ' + type + ' without a connection');

    for (let i = 0; i < this.connections.length; ++i) {
        func.apply(this.connections[i], args);
    }
};


internals.Plugin.prototype._applyChild = function (type, child, func, args) {

    Hoek.assert(this.connections, 'Cannot add ' + type + ' from a connectionless plugin');
    Hoek.assert(this.connections.length, 'Cannot add ' + type + ' without a connection');

    for (let i = 0; i < this.connections.length; ++i) {
        const obj = this.connections[i][child];
        obj[func].apply(obj, args);
    }
};


/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = {"_from":"hapi@^16.4.3","_id":"hapi@16.5.2","_inBundle":false,"_integrity":"sha512-8aXEiC2IT1bfF/5RYz9LtWqm99oGVDd2JcQ3KRRvFGDngEE35kZl9Bk2jproY97fBrmAlvkNrmQKWf3jb2lNxw==","_location":"/hapi","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"hapi@^16.4.3","name":"hapi","escapedName":"hapi","rawSpec":"^16.4.3","saveSpec":null,"fetchSpec":"^16.4.3"},"_requiredBy":["/mk-server"],"_resolved":"https://registry.npmjs.org/hapi/-/hapi-16.5.2.tgz","_shasum":"d1dadf33721c6ac3aaa905ce086d9c7ffb883092","_spec":"hapi@^16.4.3","_where":"E:\\code\\mk\\mk-demo-helloworld\\release\\node_modules\\mk-server","bugs":{"url":"https://github.com/hapijs/hapi/issues"},"bundleDependencies":false,"dependencies":{"accept":"^2.1.4","ammo":"^2.0.4","boom":"^5.2.0","call":"^4.0.2","catbox":"^7.1.5","catbox-memory":"^2.0.4","cryptiles":"^3.1.2","heavy":"^4.0.4","hoek":"^4.2.0","iron":"^4.0.5","items":"^2.1.1","joi":"^10.6.0","mimos":"^3.0.3","podium":"^1.3.0","shot":"^3.4.2","statehood":"^5.0.3","subtext":"^5.0.0","topo":"^2.0.2"},"deprecated":false,"description":"HTTP Server framework","devDependencies":{"code":"4.x.x","handlebars":"4.x.x","inert":"4.x.x","lab":"14.x.x","vision":"4.x.x","wreck":"12.x.x"},"engines":{"node":">=4.8.0"},"homepage":"http://hapijs.com","keywords":["framework","http","api","web"],"license":"BSD-3-Clause","main":"lib/index.js","name":"hapi","repository":{"type":"git","url":"git://github.com/hapijs/hapi.git"},"scripts":{"test":"lab -a code -t 100 -L -m 3000","test-cov-html":"lab -a code -r html -o coverage.html -m 3000","test-tap":"lab -a code -r tap -o tests.tap -m 3000"},"version":"16.5.2"}

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Hoek = __webpack_require__(0);
const Response = __webpack_require__(15);


// Declare internals

const internals = {};


exports = module.exports = internals.Reply = function () {

    this._decorations = null;
};


internals.Reply.prototype.decorate = function (property, method) {

    Hoek.assert(!this._decorations || !this._decorations[property], 'Reply interface decoration already defined:', property);
    Hoek.assert(['request', 'response', 'close', 'state', 'unstate', 'redirect', 'continue'].indexOf(property) === -1, 'Cannot override built-in reply interface decoration:', property);

    this._decorations = this._decorations || {};
    this._decorations[property] = method;
};


/*
    const handler = function (request, reply) {

        reply(error, result, ignore);   -> error || result (continue)
        reply(...).takeover();          -> ... (continue)

        reply.continue(ignore);         -> null (continue)
    };

    const ext = function (request, reply) {

        reply(error, result, ignore);   -> error || result (respond)
        reply(...).takeover();          -> ... (respond)

        reply.continue(ignore);         -> (continue)
    };

    const pre = function (request, reply) {

        reply(error);                   -> error (respond)  // failAction override
        reply(null, result, ignore);    -> result (continue)
        reply(...).takeover();          -> ... (respond)

        reply.continue(ignore);         -> null (continue)
    };

    const auth = function (request, reply) {

        reply(error, result, data);     -> error || result (respond) + data
        reply(..., data).takeover();    -> ... (respond) + data

        reply.continue(data);           -> (continue) + data
    };
*/

internals.Reply.prototype.interface = function (request, realm, options, next) {        // next(err || response, data);

    let reply = (err, response, data) => {

        Hoek.assert(data === undefined || options.data, 'Reply interface does not allow a third argument');

        reply._data = data;                 // Held for later
        return reply.response(err !== null && err !== undefined ? err : response);
    };

    const domain = request.domain;
    if (domain) {
        reply = domain.bind(reply);

        reply.close = domain.bind(internals.close);
        reply.continue = domain.bind(internals.continue);
        reply.redirect = domain.bind(internals.redirect);
        reply.response = domain.bind(internals.response);
        reply.entity = domain.bind(internals.entity);
    }
    else {
        reply.close = internals.close;
        reply.continue = internals.continue;
        reply.redirect = internals.redirect;
        reply.response = internals.response;
        reply.entity = internals.entity;
    }

    reply._settings = options;
    reply._replied = false;
    reply._next = Hoek.once(next);

    reply.realm = realm;
    reply.request = request;

    reply.state = internals.state;
    reply.unstate = internals.unstate;

    if (this._decorations) {
        const methods = Object.keys(this._decorations);
        for (let i = 0; i < methods.length; ++i) {
            const method = methods[i];
            const decoration = this._decorations[method];
            reply[method] = (domain && typeof decoration === 'function') ? domain.bind(decoration) : decoration;
        }
    }

    return reply;
};


internals.close = function (options) {

    options = options || {};
    this._next({ closed: true, end: options.end !== false });
};


internals.continue = function (data) {

    if (data !== undefined) {
        if (this._settings.data) {
            this._data = data;
        }
        else if (this._settings.postHandler) {
            const next = this._next;
            this._next = (result) => next(null, result);            // Shift argument to signal not to stop processing other extensions
            return this.response(data);
        }
        else {
            throw new Error('reply.continue() does not allow any arguments');
        }
    }

    this._next(null);
    this._next = null;
};


internals.state = function (name, value, options) {

    this.request._setState(name, value, options);
};


internals.unstate = function (name, options) {

    this.request._clearState(name, options);
};


internals.redirect = function (location) {

    return this.response('').redirect(location);
};


internals.response = function (result) {

    Hoek.assert(!this._replied, 'reply interface called twice');
    this._replied = true;

    const response = Response.wrap(result, this.request);
    if (response.isBoom) {
        this._next(response);
        this._next = null;
        return response;
    }

    response.hold = internals.hold(this);

    process.nextTick(() => {

        response.hold = undefined;

        if (!response.send &&
            this._next) {

            response._prepare(this._next);
            this._next = null;
        }
    });

    return response;
};


internals.hold = function (reply) {

    return function () {

        this.hold = undefined;
        this.send = () => {

            this.send = undefined;
            this._prepare(reply._next);
            this._next = null;
        };

        return this;
    };
};


internals.entity = function (options) {

    Hoek.assert(options, 'Entity method missing required options');
    Hoek.assert(options.etag || options.modified, 'Entity methods missing require options key');

    this.request._entity = options;

    const entity = Response.entity(options.etag, options);
    if (Response.unmodified(this.request, entity)) {
        return this.response().code(304).takeover();
    }

    return null;
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Url = __webpack_require__(23);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Podium = __webpack_require__(9);
const Cors = __webpack_require__(13);
const Protect = __webpack_require__(104);
const Response = __webpack_require__(15);
const Transmit = __webpack_require__(106);


// Declare internals

const internals = {
    properties: ['connection', 'server', 'url', 'query', 'path', 'method', 'mime', 'setUrl', 'setMethod', 'headers', 'id', 'app', 'plugins', 'route', 'auth', 'pre', 'preResponses', 'info', 'orig', 'params', 'paramsArray', 'payload', 'state', 'jsonp', 'response', 'raw', 'tail', 'addTail', 'domain', 'log', 'getLog', 'generateResponse'],
    emitter: new Podium(['finish', { name: 'peek', spread: true }, 'disconnect'])
};


exports = module.exports = internals.Generator = function () {

    this._decorations = null;
};


internals.Generator.prototype.request = function (connection, req, res, options) {

    const request = new internals.Request(connection, req, res, options);

    // Decorate

    if (this._decorations) {
        const properties = Object.keys(this._decorations);
        for (let i = 0; i < properties.length; ++i) {
            const property = properties[i];
            const assignment = this._decorations[property];
            request[property] = (assignment.apply ? assignment.method(request) : assignment.method);
        }
    }

    return request;
};


internals.Generator.prototype.decorate = function (property, method, options) {

    options = options || {};

    Hoek.assert(!this._decorations || this._decorations[property] === undefined, 'Request interface decoration already defined:', property);
    Hoek.assert(internals.properties.indexOf(property) === -1, 'Cannot override built-in request interface decoration:', property);

    this._decorations = this._decorations || {};
    this._decorations[property] = { method, apply: options.apply };
};


internals.Request = function (connection, req, res, options) {

    Podium.decorate(this, internals.emitter);

    // Take measurement as soon as possible

    this._bench = new Hoek.Bench();
    const now = Date.now();

    // Public members

    this.connection = connection;
    this.server = connection.server;

    this.url = null;
    this.query = null;
    this.path = null;
    this.method = null;
    this.mime = null;                       // Set if payload is parsed
    this.headers = req.headers;

    // Request info

    this.info = {
        received: now,
        responded: 0,
        remoteAddress: req.connection.remoteAddress,
        remotePort: req.connection.remotePort || '',
        referrer: req.headers.referrer || req.headers.referer || '',
        host: req.headers.host ? req.headers.host.replace(/\s/g, '') : ''
    };

    this.info.hostname = this.info.host.split(':')[0];

    this.setUrl = this._setUrl;             // Decoration removed after 'onRequest'
    this.setMethod = this._setMethod;

    this._setUrl(req.url, this.connection.settings.router.stripTrailingSlash);      // Sets: this.url, this.path, this.query
    this._setMethod(req.method);                                                    // Sets: this.method

    this.id = now + ':' + connection.info.id + ':' + connection._requestCounter.value++;
    if (connection._requestCounter.value > connection._requestCounter.max) {
        connection._requestCounter.value = connection._requestCounter.min;
    }

    this.app = (options.app ? Hoek.shallow(options.app) : {});              // Place for application-specific state without conflicts with hapi, should not be used by plugins
    this.plugins = (options.plugins ? Hoek.shallow(options.plugins) : {});  // Place for plugins to store state without conflicts with hapi, should be namespaced using plugin name

    this._route = this.connection._router.specials.notFound.route;    // Used prior to routing (only settings are used, not the handler)
    this.route = this._route.public;

    this.auth = {
        isAuthenticated: false,
        credentials: options.credentials || null,       // Special keys: 'app', 'user', 'scope'
        artifacts: options.artifacts || null,           // Scheme-specific artifacts
        strategy: null,
        mode: null,
        error: null
    };

    this.pre = {};                          // Pre raw values
    this.preResponses = {};                 // Pre response values

    // Assigned elsewhere:

    this.orig = {};
    this.params = {};
    this.paramsArray = [];              // Array of path parameters in path order
    this.payload = null;
    this.state = null;
    this.jsonp = null;
    this.response = null;

    // Semi-public members

    this.raw = {
        req,
        res
    };

    this.tail = this.addTail = this._addTail;       // Removed once wagging

    // Private members

    this._states = {};
    this._entity = {};                  // Entity information set via reply.entity()
    this._logger = [];
    this._allowInternals = !!options.allowInternals;
    this._expectContinue = !!options.expectContinue;
    this._isPayloadPending = !!(req.headers['content-length'] || req.headers['transfer-encoding']);      // false when incoming payload fully processed
    this._isBailed = false;             // true when lifecycle should end
    this._isReplied = false;            // true when response processing started
    this._isFinalized = false;          // true when request completed (may be waiting on tails to complete)
    this._tails = {};                   // tail id -> name (tracks pending tails)
    this._tailIds = 0;                  // Used to generate a unique tail id
    this._protect = new Protect(this);
    this.domain = this._protect.domain;

    // Encoding

    this.info.acceptEncoding = this.connection._compression.accept(this);       // Delay until request object fully initialized

    // Listen to request state

    this._onEnd = () => {

        this._isPayloadPending = false;
    };

    this.raw.req.once('end', this._onEnd);

    this._onClose = () => {

        this._log(['request', 'closed', 'error']);
        this._isPayloadPending = false;
        this._isBailed = true;
    };

    this.raw.req.once('close', this._onClose);

    this._onError = (err) => {

        this._log(['request', 'error'], err);
        this._isPayloadPending = false;
    };

    this.raw.req.once('error', this._onError);

    this._onAbort = () => {

        this._log(['request', 'abort', 'error']);
        this._isPayloadPending = false;
        this._isBailed = true;

        this.emit('disconnect');
    };

    this.raw.req.once('aborted', this._onAbort);

    // Log request

    const about = {
        method: this.method,
        url: this.url.href,
        agent: this.raw.req.headers['user-agent']
    };

    this._log(['received'], about, now);     // Must be last for object to be fully constructed
};

Hoek.inherits(internals.Request, Podium);


internals.Request.prototype._setUrl = function (url, stripTrailingSlash) {

    url = (typeof url === 'string' ? Url.parse(url, true) : Hoek.clone(url));

    // Apply path modifications

    let path = this.connection._router.normalize(url.pathname || '');        // pathname excludes query

    if (stripTrailingSlash &&
        path.length > 1 &&
        path[path.length - 1] === '/') {

        path = path.slice(0, -1);
    }

    // Update derived url properties

    if (path !== url.pathname) {
        url.pathname = path;
        url.path = url.search ? path + url.search : path;
        url.href = Url.format(url);
    }

    // Store request properties

    this.url = url;
    this.query = url.query;
    this.path = url.pathname;

    if (url.hostname) {
        this.info.hostname = url.hostname;
        this.info.host = url.host;
    }
};


internals.Request.prototype._setMethod = function (method) {

    Hoek.assert(method && typeof method === 'string', 'Missing method');
    this.method = method.toLowerCase();
};


internals.Request.prototype.log = function (tags, data, timestamp, _internal) {

    tags = [].concat(tags);
    timestamp = (timestamp ? (timestamp instanceof Date ? timestamp.getTime() : timestamp) : Date.now());
    const internal = !!_internal;

    let update = (typeof data !== 'function' ? [this, { request: this.id, timestamp, tags, data, internal }] : () => {

        return [this, { request: this.id, timestamp, tags, data: data(), internal }];
    });

    if (this.route.settings.log) {
        if (typeof data === 'function') {
            update = update();
        }

        this._logger.push(update[1]);       // Add to request array
    }

    this.connection.emit({ name: internal ? 'request-internal' : 'request', tags }, update);
};


internals.Request.prototype._log = function (tags, data) {

    return this.log(tags, data, null, true);
};


internals.Request.prototype.getLog = function (tags, internal) {

    Hoek.assert(this.route.settings.log, 'Request logging is disabled');

    if (typeof tags === 'boolean') {
        internal = tags;
        tags = [];
    }

    tags = [].concat(tags || []);
    if (!tags.length &&
        internal === undefined) {

        return this._logger;
    }

    const filter = tags.length ? Hoek.mapToObject(tags) : null;
    const result = [];

    for (let i = 0; i < this._logger.length; ++i) {
        const event = this._logger[i];
        if (internal === undefined || event.internal === internal) {
            if (filter) {
                for (let j = 0; j < event.tags.length; ++j) {
                    const tag = event.tags[j];
                    if (filter[tag]) {
                        result.push(event);
                        break;
                    }
                }
            }
            else {
                result.push(event);
            }
        }
    }

    return result;
};


internals.Request.prototype._execute = function () {

    // Execute onRequest extensions (can change request method and url)

    if (!this.connection._extensions.onRequest.nodes) {
        return this._lifecycle();
    }

    this._invoke(this.connection._extensions.onRequest, (err) => {

        return this._lifecycle(err);
    });
};


internals.Request.prototype._lifecycle = function (err) {

    // Undecorate request

    this.setUrl = undefined;
    this.setMethod = undefined;

    if (err) {
        return this._reply(err);
    }

    if (!this.path ||
        this.path[0] !== '/') {

        return this._reply(Boom.badRequest('Invalid path'));
    }

    // Lookup route

    const match = this.connection._router.route(this.method, this.path, this.info.hostname);
    if (!match.route.settings.isInternal ||
        this._allowInternals) {

        this._route = match.route;
        this.route = this._route.public;
    }

    this.params = match.params || {};
    this.paramsArray = match.paramsArray || [];

    if (this.route.settings.cors) {
        this.info.cors = {
            isOriginMatch: Cors.matchOrigin(this.headers.origin, this.route.settings.cors)
        };
    }

    // Setup timeout

    if (this.raw.req.socket &&
        this.route.settings.timeout.socket !== undefined) {

        this.raw.req.socket.setTimeout(this.route.settings.timeout.socket || 0);    // Value can be false or positive
    }

    let serverTimeout = this.route.settings.timeout.server;
    if (serverTimeout) {
        serverTimeout = Math.floor(serverTimeout - this._bench.elapsed());          // Calculate the timeout from when the request was constructed
        const timeoutReply = () => {

            this._log(['request', 'server', 'timeout', 'error'], { timeout: serverTimeout, elapsed: this._bench.elapsed() });
            this._reply(Boom.serverUnavailable());
        };

        if (serverTimeout <= 0) {
            return timeoutReply();
        }

        this._serverTimeoutId = setTimeout(timeoutReply, serverTimeout);
    }

    // Execute lifecycle steps

    const each = (func, next) => {

        if (this._isReplied ||
            this._isBailed) {

            return next(Boom.internal('Already closed'));                       // Error is not used
        }

        if (typeof func !== 'function') {                                       // Extension point
            return this._invoke(func, next);                                    // next() called with response object which ends processing (treated like error)
        }

        return func(this, next);
    };

    return Items.serial(this._route._cycle, each, (err) => this._reply(err));
};


internals.Request.prototype._invoke = function (event, callback) {

    this._protect.run(callback, (exit) => {

        const each = (ext, next) => {

            const options = { postHandler: (event.type === 'onPostHandler' || event.type === 'onPreResponse') };
            const finalize = (result, override) => {

                if (override) {
                    this._setResponse(override);
                }

                return next(result);            // next() called with response object which ends processing (treated like error)
            };

            const reply = this.server._replier.interface(this, ext.plugin.realm, options, finalize);
            const bind = (ext.bind || ext.plugin.realm.settings.bind);

            ext.func.call(bind, this, reply);
        };

        Items.serial(event.nodes, each, exit);
    });
};


internals.Request.prototype._reply = function (exit) {

    if (this._isReplied) {                                  // Prevent any future responses to this request
        return;
    }

    this._isReplied = true;

    clearTimeout(this._serverTimeoutId);

    if (this._isBailed) {
        return this._finalize();
    }

    if (this.response &&                                    // Can be null if response coming from exit
        this.response.closed) {

        if (this.response.end) {
            this.raw.res.end();                             // End the response in case it wasn't already closed
        }

        return this._finalize();
    }

    if (exit) {                                             // Can be a valid response or error (if returned from an ext, already handled because this.response is also set)
        this._setResponse(Response.wrap(exit, this));
    }

    this._protect.reset();

    const transmit = (err) => {

        if (err) {                                          // Can be valid response or error
            this._setResponse(Response.wrap(err, this));
        }

        return Transmit.send(this, () => this._finalize());
    };

    if (!this._route._extensions.onPreResponse.nodes) {
        return transmit();
    }

    return this._invoke(this._route._extensions.onPreResponse, transmit);
};


internals.Request.prototype._finalize = function () {

    this.info.responded = Date.now();

    if (this.response &&
        this.response.statusCode === 500 &&
        this.response._error) {

        this.connection.emit('request-error', [this, this.response._error]);
        this._log(this.response._error.isDeveloperError ? ['internal', 'implementation', 'error'] : ['internal', 'error'], this.response._error);
    }

    this.connection.emit('response', this);

    this._isFinalized = true;
    this.addTail = undefined;
    this.tail = undefined;

    if (Object.keys(this._tails).length === 0) {
        this.connection.emit('tail', this);
    }

    // Cleanup

    this.raw.req.removeListener('end', this._onEnd);
    this.raw.req.removeListener('close', this._onClose);
    this.raw.req.removeListener('error', this._onError);
    this.raw.req.removeListener('error', this._onAbort);

    if (this.response &&
        this.response._close) {

        this.response._close();
    }

    this._protect.logger = this.server;
};


internals.Request.prototype._setResponse = function (response) {

    if (this.response &&
        !this.response.isBoom &&
        this.response !== response &&
        (response.isBoom || this.response.source !== response.source)) {

        this.response._close();
    }

    if (this._isFinalized) {
        if (response._close) {
            response._close();
        }

        return;
    }

    this.response = response;
};


internals.Request.prototype._addTail = function (name) {

    name = name || 'unknown';
    const tailId = this._tailIds++;
    this._tails[tailId] = name;
    this._log(['tail', 'add'], { name, id: tailId });

    const drop = () => {

        if (!this._tails[tailId]) {
            this._log(['tail', 'remove', 'error'], { name, id: tailId });             // Already removed
            return;
        }

        delete this._tails[tailId];

        if (Object.keys(this._tails).length === 0 &&
            this._isFinalized) {

            this._log(['tail', 'remove', 'last'], { name, id: tailId });
            this.connection.emit('tail', this);
        }
        else {
            this._log(['tail', 'remove'], { name, id: tailId });
        }
    };

    return drop;
};


internals.Request.prototype._setState = function (name, value, options) {          // options: see Defaults.state

    const state = { name, value };
    if (options) {
        Hoek.assert(!options.autoValue, 'Cannot set autoValue directly in a response');
        state.options = Hoek.clone(options);
    }

    this._states[name] = state;
};


internals.Request.prototype._clearState = function (name, options) {

    const state = { name };

    state.options = Hoek.clone(options || {});
    state.options.ttl = 0;

    this._states[name] = state;
};


internals.Request.prototype._tap = function () {

    return (this.hasListeners('finish') || this.hasListeners('peek') ? new Response.Peek(this) : null);
};


internals.Request.prototype.generateResponse = function (source, options) {

    return new Response(source, this, options);
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

let Domain = null;                                  // Loaded as needed
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports = module.exports = internals.Protect = function (request) {

    this._error = null;
    this.logger = request;                          // Replaced with server when request completes

    if (!request.server.settings.useDomains) {
        this.domain = null;
        return;
    }

    Domain = Domain || __webpack_require__(105);

    this.domain = Domain.create();
    this.domain.on('error', this._onError.bind(this));
    request.onPodiumError = (err) => this._onError(err);
};


internals.Protect.prototype._onError = function (err) {

    const handler = this._error;
    if (handler) {
        this._error = null;
        return handler(err);
    }

    this.logger._log(['internal', 'implementation', 'error'], err);
};


internals.Protect.prototype.run = function (next, enter) {              // enter: function (exit)

    const finish = Hoek.once((arg0, arg1, arg2) => {

        this._error = null;
        return next(arg0, arg1, arg2);
    });

    if (this.domain) {
        this._error = (err) => {

            return finish(Boom.badImplementation('Uncaught error', err));
        };
    }

    return enter(finish);
};


internals.Protect.prototype.reset = function () {

    this._error = null;
};


internals.Protect.prototype.enter = function (func) {

    if (!this.domain) {
        return func();
    }

    this.domain.run(func);
};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Http = __webpack_require__(10);
const Stream = __webpack_require__(2);
const Ammo = __webpack_require__(47);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Shot = __webpack_require__(37);
const Auth = __webpack_require__(24);
const Cors = __webpack_require__(13);
const Response = __webpack_require__(15);


// Declare internals

const internals = {};


exports.send = function (request, callback) {

    const response = request.response;
    if (response.isBoom) {
        return internals.fail(request, response, callback);
    }

    internals.marshal(request, (err) => {

        if (err) {
            request._setResponse(err);
            return internals.fail(request, err, callback);
        }

        return internals.transmit(response, (err) => {

            if (err) {
                request._setResponse(err);
                return internals.fail(request, err, callback);
            }

            return callback();
        });
    });
};


internals.marshal = function (request, next) {

    const response = request.response;

    Cors.headers(response);
    internals.content(response, false);
    internals.security(response);
    internals.unmodified(response);

    internals.state(response, (err) => {

        if (err) {
            request._log(['state', 'response', 'error'], err);
            request._states = {};                                           // Clear broken state
            return next(err);
        }

        internals.cache(response);

        if (!response._isPayloadSupported() &&
            request.method !== 'head') {

            // Set empty stream

            response._close();                                  // Close unused file streams
            response._payload = new internals.Empty();
            delete response.headers['content-length'];
            return Auth.response(request, next);                // Must be last in case requires access to headers
        }

        response._marshal((err) => {

            if (err) {
                return next(Boom.boomify(err));
            }

            if (request.jsonp &&
                response._payload.jsonp) {

                response._header('content-type', 'text/javascript' + (response.settings.charset ? '; charset=' + response.settings.charset : ''));
                response._header('x-content-type-options', 'nosniff');
                response._payload.jsonp(request.jsonp);
            }

            if (response._payload.size &&
                typeof response._payload.size === 'function') {

                response._header('content-length', response._payload.size(), { override: false });
            }

            if (!response._isPayloadSupported()) {
                response._close();                              // Close unused file streams
                response._payload = new internals.Empty();      // Set empty stream
            }

            internals.content(response, true);
            return Auth.response(request, next);               // Must be last in case requires access to headers
        });
    });
};


internals.fail = function (request, boom, callback) {

    const error = boom.output;
    const response = new Response(error.payload, request);
    response._error = boom;
    response.code(error.statusCode);
    response.headers = Hoek.clone(error.headers);           // Prevent source from being modified
    request.response = response;                            // Not using request._setResponse() to avoid double log

    internals.marshal(request, (err) => {

        if (err) {

            // Failed to marshal an error - replace with minimal representation of original error

            const minimal = {
                statusCode: error.statusCode,
                error: Http.STATUS_CODES[error.statusCode],
                message: boom.message
            };

            response._payload = new Response.Payload(JSON.stringify(minimal), {});
        }

        return internals.transmit(response, callback);
    });
};


internals.transmit = function (response, callback) {

    // Setup source

    const request = response.request;
    const source = response._payload;
    const length = parseInt(response.headers['content-length'], 10);      // In case value is a string

    // Empty response

    if (length === 0 &&
        response.statusCode === 200 &&
        request.route.settings.response.emptyStatusCode === 204) {

        response.code(204);
        delete response.headers['content-length'];
    }

    // Compression

    const encoding = request.connection._compression.encoding(response);

    // Range

    let ranger = null;
    if (request.route.settings.response.ranges &&
        request.method === 'get' &&
        response.statusCode === 200 &&
        length > 0 &&
        !encoding) {

        if (request.headers.range) {

            // Check If-Range

            if (!request.headers['if-range'] ||
                request.headers['if-range'] === response.headers.etag) {            // Ignoring last-modified date (weak)

                // Parse header

                const ranges = Ammo.header(request.headers.range, length);
                if (!ranges) {
                    const error = Boom.rangeNotSatisfiable();
                    error.output.headers['content-range'] = 'bytes */' + length;
                    return internals.fail(request, error, callback);
                }

                // Prepare transform

                if (ranges.length === 1) {                                          // Ignore requests for multiple ranges
                    const range = ranges[0];
                    ranger = new Ammo.Stream(range);
                    response.code(206);
                    response.bytes(range.to - range.from + 1);
                    response._header('content-range', 'bytes ' + range.from + '-' + range.to + '/' + length);
                }
            }
        }

        response._header('accept-ranges', 'bytes');
    }

    // Content-Encoding

    let compressor = null;
    if (encoding &&
        length !== 0 &&
        response.statusCode !== 206 &&
        response._isPayloadSupported()) {

        delete response.headers['content-length'];
        response._header('content-encoding', encoding);

        compressor = request.connection._compression.encoder(request, encoding);
    }

    if ((response.headers['content-encoding'] || encoding) &&
        response.headers.etag &&
        response.settings.varyEtag) {

        response.headers.etag = response.headers.etag.slice(0, -1) + '-' + (response.headers['content-encoding'] || encoding) + '"';
    }

    // Connection: close

    const isInjection = Shot.isInjection(request.raw.req);
    if (!(isInjection || request.connection._started) ||
        (request._isPayloadPending && !request.raw.req._readableState.ended)) {

        response._header('connection', 'close');
    }

    // Write headers

    const error = internals.writeHead(response);
    if (error) {
        return Hoek.nextTick(callback)(error);
    }

    // Injection

    if (isInjection) {
        request.raw.res._hapi = { request };

        if (response.variety === 'plain') {
            request.raw.res._hapi.result = response._isPayloadSupported() ? response.source : null;
        }
    }

    // Write payload

    const end = Hoek.once((err, event) => {

        source.removeListener('error', end);

        request.raw.req.removeListener('aborted', onAborted);
        request.raw.req.removeListener('close', onClose);

        request.raw.res.removeListener('close', onClose);
        request.raw.res.removeListener('error', end);
        request.raw.res.removeListener('finish', end);

        if (err) {
            request.raw.res.destroy();

            if (request.raw.res._hapi) {
                request.raw.res.statusCode = 500;
                request.raw.res._hapi.result = Boom.boomify(err).output.payload;           // Force injected response to error
            }

            source.unpipe();
            Response.drain(source);
        }

        if (!request.raw.res.finished &&
            event !== 'aborted') {

            request.raw.res.end();
        }

        if (event || err) {
            request.emit('disconnect');
        }

        const tags = (err ? ['response', 'error'] : (event ? ['response', 'error', event] : ['response']));
        request._log(tags, err);
        return callback();
    });

    source.once('error', end);

    const onAborted = () => end(null, 'aborted');
    const onClose = () => end(null, 'close');

    request.raw.req.once('aborted', onAborted);
    request.raw.req.once('close', onClose);

    request.raw.res.once('close', onClose);
    request.raw.res.once('error', end);
    request.raw.res.once('finish', end);

    const tap = response._tap();
    const preview = (tap ? source.pipe(tap) : source);
    const compressed = (compressor ? preview.pipe(compressor) : preview);
    const ranged = (ranger ? compressed.pipe(ranger) : compressed);
    ranged.pipe(request.raw.res);
};


internals.writeHead = function (response) {

    const res = response.request.raw.res;
    const headers = Object.keys(response.headers);
    let i = 0;

    try {
        for (; i < headers.length; ++i) {
            const header = headers[i];
            const value = response.headers[header];
            if (value !== undefined) {
                res.setHeader(header, value);
            }
        }
    }
    catch (err) {

        for (--i; i >= 0; --i) {
            res.setHeader(headers[i], null);        // Undo headers
        }

        return Boom.boomify(err);
    }

    try {
        res.writeHead(response.statusCode);
    }
    catch (err) {
        return Boom.boomify(err);
    }

    if (response.settings.message) {
        res.statusMessage = response.settings.message;
    }

    return null;
};


internals.Empty = function () {

    Stream.Readable.call(this);
};

Hoek.inherits(internals.Empty, Stream.Readable);


internals.Empty.prototype._read = function (/* size */) {

    this.push(null);
};


internals.cache = function (response) {

    const request = response.request;

    if (response.headers['cache-control']) {
        return;
    }

    const policy = request.route.settings.cache &&
        request._route._cache &&
        (request.route.settings.cache._statuses[response.statusCode] || (response.statusCode === 304 && request.route.settings.cache._statuses['200']));

    if (policy ||
        response.settings.ttl) {

        const ttl = (response.settings.ttl !== null ? response.settings.ttl : request._route._cache.ttl());
        const privacy = (request.auth.isAuthenticated || response.headers['set-cookie'] ? 'private' : request.route.settings.cache.privacy || 'default');
        response._header('cache-control', 'max-age=' + Math.floor(ttl / 1000) + ', must-revalidate' + (privacy !== 'default' ? ', ' + privacy : ''));
    }
    else if (request.route.settings.cache) {
        response._header('cache-control', request.route.settings.cache.otherwise);
    }
};


internals.security = function (response) {

    const request = response.request;

    const security = request.route.settings.security;
    if (security) {
        if (security._hsts) {
            response._header('strict-transport-security', security._hsts, { override: false });
        }

        if (security._xframe) {
            response._header('x-frame-options', security._xframe, { override: false });
        }

        if (security.xss) {
            response._header('x-xss-protection', '1; mode=block', { override: false });
        }

        if (security.noOpen) {
            response._header('x-download-options', 'noopen', { override: false });
        }

        if (security.noSniff) {
            response._header('x-content-type-options', 'nosniff', { override: false });
        }
    }
};


internals.content = function (response, postMarshal) {

    let type = response.headers['content-type'];
    if (!type) {
        if (response._contentType) {
            const charset = (response.settings.charset && response._contentType !== 'application/octet-stream' ? '; charset=' + response.settings.charset : '');
            response.type(response._contentType + charset);
        }
    }
    else {
        type = type.trim();
        if ((!response._contentType || !postMarshal) &&
            response.settings.charset &&
            type.match(/^(?:text\/)|(?:application\/(?:json)|(?:javascript))/)) {

            if (!type.match(/; *charset=/)) {
                const semi = (type[type.length - 1] === ';');
                response.type(type + (semi ? ' ' : '; ') + 'charset=' + (response.settings.charset));
            }
        }
    }
};


internals.state = function (response, next) {

    const request = response.request;

    const names = {};
    const states = [];

    const requestStates = Object.keys(request._states);
    for (let i = 0; i < requestStates.length; ++i) {
        const stateName = requestStates[i];
        names[stateName] = true;
        states.push(request._states[stateName]);
    }

    const each = (name, nextKey) => {

        const autoValue = request.connection.states.cookies[name].autoValue;
        if (!autoValue || names[name]) {
            return nextKey();
        }

        names[name] = true;

        if (typeof autoValue !== 'function') {
            states.push({ name, value: autoValue });
            return nextKey();
        }

        autoValue(request, (err, value) => {

            if (err) {
                return nextKey(err);
            }

            states.push({ name, value });
            return nextKey();
        });
    };

    const keys = Object.keys(request.connection.states.cookies);
    Items.parallel(keys, each, (err) => {

        if (err) {
            return next(Boom.boomify(err));
        }

        if (!states.length) {
            return next();
        }

        request.connection.states.format(states, (err, header) => {

            if (err) {
                return next(Boom.boomify(err));
            }

            const existing = response.headers['set-cookie'];
            if (existing) {
                header = (Array.isArray(existing) ? existing : [existing]).concat(header);
            }

            response._header('set-cookie', header);
            return next();
        });
    });
};


internals.unmodified = function (response) {

    const request = response.request;

    // Set headers from reply.entity()

    if (request._entity.etag &&
        !response.headers.etag) {

        response.etag(request._entity.etag, { vary: request._entity.vary });
    }

    if (request._entity.modified &&
        !response.headers['last-modified']) {

        response.header('last-modified', request._entity.modified);
    }

    if (response.statusCode === 304) {
        return;
    }

    const entity = {
        etag: response.headers.etag,
        vary: response.settings.varyEtag,
        modified: response.headers['last-modified']
    };

    if (Response.unmodified(request, entity)) {
        response.code(304);
    }
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(7)
const wsdl = __webpack_require__(108)

//处理全部服务的api与url绑定。
const apiRouter = (apiRootUrl, services, interceptors) => {
  let routes = [];
  Object.keys(services).forEach(key => {
    let service = services[key];
    let apis = service.api;
    if (!apis || service.apiRootUrl === false) return;

    let name = service.name || key;
    let serviceApiUrl = urlJoin(apiRootUrl, service.apiRootUrl || name.replace(/\_/g, "/"));

    //服务的api绑定到对应的url上。
    Object.keys(apis).filter(i => typeof apis[i] == "function" && i[0] != "_").forEach(apiName => {
      let handler = apis[apiName];
      let apiUrl = urlJoin(serviceApiUrl, apiName);

      let urls = [apiUrl]
      if (handler.apiUrl) {
        if (handler.apiUrl.indexOf(",") != -1) {
          urls = apiUrl.split(",").map(url => urlJoin(apiRootUrl, url))
        } else {
          apiUrl = urlJoin(apiRootUrl, handler.apiUrl);
          urls = [apiUrl]
        }
      }
      else if (handler.apiUrl === false) {
        return
      }

      console.log(`api path:  ${apiUrl} \t\t=>\t ${service.name}.api.${apiName}`);
      urls.forEach(url => routes.push({
        method: ["GET", "POST"],
        path: url,
        handler: (request, reply) => handlerWrapper(context({ request, reply, interceptors, apiUrl: url, handler, service }))
      }))
    })
  })

  wsdl(apiRootUrl, routes);//生成api描述文档

  return routes;
}

function urlJoin() {
  return path.join(...arguments).replace(/\\/g, "/");
}

function context(ctx) {
  return Object.assign(ctx, {
    resBody: {},
    return: (value) => {
      ctx.resBody.result = true;
      ctx.resBody.value = value;
      ctx.reply(ctx.resBody);
    },
    error: (ex) => {
      ctx.resBody.result = false;
      ctx.resBody.error = {
        message: ex.message || ex,
        code: ex.code,
        stack: ex.stack,
      };
      ctx.reply(ctx.resBody);
      console.error(ctx.resBody.error)
    }
  });
}

function handlerWrapper(ctx) { 
  let request = ctx.request
  let data = null
  if (request.method == "get") {
    data = Object.assign({}, request.url.query);
  } else {
    data = request.payload
  }
  
  let array = ctx.interceptors
  if (array && Array.isArray(array)) {
    for (var i = 0; i < array.length; i++) {
      if (array[i](ctx) === false) return false; //执行拦截器，如果返回false终止执行。
    }
  }

  try {
    var value = ctx.handler(data, ctx);  //执行handler，无返回值时，表示handler异步调用ctx.return或ctx.error。
    var promise = value;
    if (promise instanceof Promise || promise && promise.catch && promise.then) {
      promise
        .then(ctx.return)
        .catch(ctx.error)
    }
    else if (value !== undefined) {
      ctx.return(value);
    }
  } catch (ex) {
    ctx.error(ex);
  }

}

module.exports = apiRouter


/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = (url, routes) => {
    console.log("wsdl path: " + url);

    routes.push({
        method: 'GET',
        path: url,
        handler: (request, reply) => {
            var apis = routes.filter(r => r.method == 'POST' || r.method == "*");
            var html = wsdlHtml(apis);
            reply(html);
        }
    });

    return routes;
}


function wsdlHtml(routes) {
    return routes
        .map(r => `<a href='${r.path}'>${r.path}</a>`)
        .join('<br>')
}


/***/ }),
/* 109 */
/***/ (function(module, exports) {


const webRouter = (cfg) => {
  if (!cfg) return {}
  let routes = { dir: [], proxy: [] }
  if (typeof cfg == "string") {
    cfg = { "/": cfg }
  }

  buildRouters(cfg, routes)

  return routes
}

function buildRouters(obj, routes, hosts) {
  Object.keys(obj).forEach(key => {
    let value = obj[key]
    if (key.startsWith("/")) {
      let uri = value.uri || value;
      if (typeof uri == "string" && uri.startsWith("http:")) {
        routes.proxy.push(proxyRouter(key, value, hosts))
      } else {
        routes.dir.push(dirRouter(key, value, hosts))
      }
    }
    else if (key.startsWith("server_name:")) {
      buildRouters(value, routes, key.split("server_name:")[1].split(" "))
    } else {
      throw ("route path mast start with / or http: , current value: " + value)
    }
  })
}

function dirRouter(path, obj, hosts) {
  let directoryPath = obj.path || obj;
  if (path.endsWith("/")) {
    path += "{param*}"
  }
  let route = {
    method: '*',
    path,
    handler: {
      directory: {
        path: directoryPath
      }
    }
  }
  if (obj.method) {
    route.method = obj.method
  }
  if (hosts) {
    route.vhost = hosts
  }
  return route
}

function proxyRouter(path, obj, hosts) {
  let host = obj.host
  let uri = obj.uri || obj
  if (path.endsWith("/")) {
    path += "{path*}"
  }
  if (uri.endsWith("/")) {
    uri += "{path*}"
  }
  let route = {
    method: ["GET", "POST"],
    path,
    handler: {
      proxy: {
        xforward: true,
        passThrough: true,
        host,
        uri,
      }
    }
  }
  if (hosts) {
    route.vhost = hosts
  }
  return route
}

module.exports = webRouter

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Directory = __webpack_require__(111);
const Etag = __webpack_require__(49);
const File = __webpack_require__(48);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {
    defaults: {
        etagsCacheMaxSize: 1000
    }
};


exports.register = function (server, options, next) {

    const settings = Hoek.applyToDefaults(internals.defaults, options);

    server.expose('_etags', settings.etagsCacheMaxSize ? new Etag.Cache(settings.etagsCacheMaxSize) : null);

    server.handler('file', File.handler);
    server.handler('directory', Directory.handler);

    server.decorate('reply', 'file', function (path, responseOptions) {

        // Set correct confine value

        responseOptions = responseOptions || {};

        if (typeof responseOptions.confine === 'undefined' || responseOptions.confine === true) {
            responseOptions.confine = '.';
        }

        Hoek.assert(responseOptions.end === undefined || +responseOptions.start <= +responseOptions.end, 'options.start must be less than or equal to options.end');

        return this.response(File.response(path, responseOptions, this.request));
    });

    return next();
};


exports.register.attributes = {
    pkg: __webpack_require__(117),
    connections: false,
    once: true
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Fs = __webpack_require__(26);
const Path = __webpack_require__(7);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);
const Items = __webpack_require__(6);
const Joi = __webpack_require__(3);
const File = __webpack_require__(48);


// Declare internals

const internals = {};


internals.schema = Joi.object({
    path: Joi.alternatives(Joi.array().items(Joi.string()).single(), Joi.func()).required(),
    index: Joi.alternatives(Joi.boolean(), Joi.array().items(Joi.string()).single()).default(true),
    listing: Joi.boolean(),
    showHidden: Joi.boolean(),
    redirectToSlash: Joi.boolean(),
    lookupCompressed: Joi.boolean(),
    lookupMap: Joi.object().min(1).pattern(/.+/, Joi.string()),
    etagMethod: Joi.string().valid('hash', 'simple').allow(false),
    defaultExtension: Joi.string().alphanum()
});


exports.handler = function (route, options) {

    const settings = Joi.attempt(options, internals.schema, 'Invalid directory handler options (' + route.path + ')');
    Hoek.assert(route.path[route.path.length - 1] === '}', 'The route path for a directory handler must end with a parameter:', route.path);

    const paramName = /\w+/.exec(route.path.slice(route.path.lastIndexOf('{')))[0];

    const normalize = (paths) => {

        const normalized = [];
        for (let i = 0; i < paths.length; ++i) {
            let path = paths[i];

            if (!Path.isAbsolute(path)) {
                path = Path.join(route.settings.files.relativeTo, path);
            }

            normalized.push(path);
        }

        return normalized;
    };

    const normalized = (Array.isArray(settings.path) ? normalize(settings.path) : []);            // Array or function

    const indexNames = (settings.index === true) ? ['index.html'] : (settings.index || []);

    // Declare handler

    const handler = (request, reply) => {

        let paths = normalized;
        if (typeof settings.path === 'function') {
            const result = settings.path.call(null, request);
            if (result instanceof Error) {
                return reply(result);
            }

            if (Array.isArray(result)) {
                paths = normalize(result);
            }
            else if (typeof result === 'string') {
                paths = normalize([result]);
            }
            else {
                return reply(Boom.badImplementation('Invalid path function'));
            }
        }

        // Append parameter

        const selection = request.params[paramName];
        if (selection &&
            !settings.showHidden &&
            internals.isFileHidden(selection)) {

            return reply(Boom.notFound());
        }

        // Generate response

        const resource = request.path;
        const hasTrailingSlash = resource.endsWith('/');
        const fileOptions = {
            confine: null,
            lookupCompressed: settings.lookupCompressed,
            lookupMap: settings.lookupMap,
            etagMethod: settings.etagMethod
        };

        Items.serial(paths, (baseDir, nextPath) => {

            fileOptions.confine = baseDir;

            let path = selection || '';

            File.load(path, request, fileOptions, (response) => {

                // File loaded successfully

                if (!response.isBoom) {
                    return reply(response);
                }

                // Not found

                const err = response;
                if (err.output.statusCode === 404) {
                    if (!settings.defaultExtension) {
                        return nextPath();
                    }

                    if (hasTrailingSlash) {
                        path = path.slice(0, -1);
                    }

                    return File.load(path + '.' + settings.defaultExtension, request, fileOptions, (extResponse) => {

                        if (!extResponse.isBoom) {
                            return reply(extResponse);
                        }

                        return nextPath();
                    });
                }

                // Propagate non-directory errors

                if (err.output.statusCode !== 403 || err.data !== 'EISDIR') {
                    return reply(err);
                }

                // Directory

                if (indexNames.length === 0 &&
                    !settings.listing) {

                    return reply(Boom.forbidden());
                }

                if (settings.redirectToSlash !== false &&                       // Defaults to true
                    !request.connection.settings.router.stripTrailingSlash &&
                    !hasTrailingSlash) {

                    return reply.redirect(resource + '/');
                }

                Items.serial(indexNames, (indexName, nextIndex) => {

                    const indexFile = Path.join(path, indexName);
                    File.load(indexFile, request, fileOptions, (indexResponse) => {

                        // File loaded successfully

                        if (!indexResponse.isBoom) {
                            return reply(indexResponse);
                        }

                        // Directory

                        const err = indexResponse;
                        if (err.output.statusCode !== 404) {
                            return reply(Boom.badImplementation(indexName + ' is a directory'));
                        }

                        // Not found, try the next one

                        return nextIndex();
                    });
                },
                (/* err */) => {

                    // None of the index files were found

                    if (!settings.listing) {
                        return reply(Boom.forbidden());
                    }

                    return internals.generateListing(Path.join(baseDir, path), resource, selection, hasTrailingSlash, settings, request, reply);
                });
            });
        },
        (/* err */) => {

            return reply(Boom.notFound());
        });
    };

    return handler;
};


internals.generateListing = function (path, resource, selection, hasTrailingSlash, settings, request, reply) {

    Fs.readdir(path, (err, files) => {

        if (err) {
            return reply(Boom.internal('Error accessing directory', err));
        }

        resource = decodeURIComponent(resource);
        const display = Hoek.escapeHtml(resource);
        let html = '<html><head><title>' + display + '</title></head><body><h1>Directory: ' + display + '</h1><ul>';

        if (selection) {
            const parent = resource.substring(0, resource.lastIndexOf('/', resource.length - (hasTrailingSlash ? 2 : 1))) + '/';
            html = html + '<li><a href="' + internals.pathEncode(parent) + '">Parent Directory</a></li>';
        }

        for (let i = 0; i < files.length; ++i) {
            if (settings.showHidden ||
                !internals.isFileHidden(files[i])) {

                html = html + '<li><a href="' + internals.pathEncode(resource + (selection && !hasTrailingSlash ? '/' : '') + files[i]) + '">' + Hoek.escapeHtml(files[i]) + '</a></li>';
            }
        }

        html = html + '</ul></body></html>';

        return reply(request.generateResponse(html));
    });
};


internals.isFileHidden = function (path) {

    return /(^|[\\\/])\.([^.\\\/]|\.[^\\\/])/.test(path);           // Starts with a '.' or contains '/.' or '\.', which is not followed by a '/' or '\' or '.'
};


internals.pathEncode = function (path) {

    return encodeURIComponent(path).replace(/%2F/g, '/').replace(/%5C/g, '\\');
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = LRUCache

// This will be a proper iterable 'Map' in engines that support it,
// or a fakey-fake PseudoMap in older versions.
var Map = __webpack_require__(113)
var util = __webpack_require__(17)

// A linked list to keep track of recently-used-ness
var Yallist = __webpack_require__(115)

// use symbols if possible, otherwise just _props
var hasSymbol = typeof Symbol === 'function'
var makeSymbol
if (hasSymbol) {
  makeSymbol = function (key) {
    return Symbol.for(key)
  }
} else {
  makeSymbol = function (key) {
    return '_' + key
  }
}

var MAX = makeSymbol('max')
var LENGTH = makeSymbol('length')
var LENGTH_CALCULATOR = makeSymbol('lengthCalculator')
var ALLOW_STALE = makeSymbol('allowStale')
var MAX_AGE = makeSymbol('maxAge')
var DISPOSE = makeSymbol('dispose')
var NO_DISPOSE_ON_SET = makeSymbol('noDisposeOnSet')
var LRU_LIST = makeSymbol('lruList')
var CACHE = makeSymbol('cache')

function naiveLength () { return 1 }

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
function LRUCache (options) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options)
  }

  if (typeof options === 'number') {
    options = { max: options }
  }

  if (!options) {
    options = {}
  }

  var max = this[MAX] = options.max
  // Kind of weird to have a default max of Infinity, but oh well.
  if (!max ||
      !(typeof max === 'number') ||
      max <= 0) {
    this[MAX] = Infinity
  }

  var lc = options.length || naiveLength
  if (typeof lc !== 'function') {
    lc = naiveLength
  }
  this[LENGTH_CALCULATOR] = lc

  this[ALLOW_STALE] = options.stale || false
  this[MAX_AGE] = options.maxAge || 0
  this[DISPOSE] = options.dispose
  this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
  this.reset()
}

// resize the cache when the max changes.
Object.defineProperty(LRUCache.prototype, 'max', {
  set: function (mL) {
    if (!mL || !(typeof mL === 'number') || mL <= 0) {
      mL = Infinity
    }
    this[MAX] = mL
    trim(this)
  },
  get: function () {
    return this[MAX]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'allowStale', {
  set: function (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  },
  get: function () {
    return this[ALLOW_STALE]
  },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'maxAge', {
  set: function (mA) {
    if (!mA || !(typeof mA === 'number') || mA < 0) {
      mA = 0
    }
    this[MAX_AGE] = mA
    trim(this)
  },
  get: function () {
    return this[MAX_AGE]
  },
  enumerable: true
})

// resize the cache when the lengthCalculator changes.
Object.defineProperty(LRUCache.prototype, 'lengthCalculator', {
  set: function (lC) {
    if (typeof lC !== 'function') {
      lC = naiveLength
    }
    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(function (hit) {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      }, this)
    }
    trim(this)
  },
  get: function () { return this[LENGTH_CALCULATOR] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'length', {
  get: function () { return this[LENGTH] },
  enumerable: true
})

Object.defineProperty(LRUCache.prototype, 'itemCount', {
  get: function () { return this[LRU_LIST].length },
  enumerable: true
})

LRUCache.prototype.rforEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].tail; walker !== null;) {
    var prev = walker.prev
    forEachStep(this, fn, walker, thisp)
    walker = prev
  }
}

function forEachStep (self, fn, node, thisp) {
  var hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE]) {
      hit = undefined
    }
  }
  if (hit) {
    fn.call(thisp, hit.value, hit.key, self)
  }
}

LRUCache.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this[LRU_LIST].head; walker !== null;) {
    var next = walker.next
    forEachStep(this, fn, walker, thisp)
    walker = next
  }
}

LRUCache.prototype.keys = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.key
  }, this)
}

LRUCache.prototype.values = function () {
  return this[LRU_LIST].toArray().map(function (k) {
    return k.value
  }, this)
}

LRUCache.prototype.reset = function () {
  if (this[DISPOSE] &&
      this[LRU_LIST] &&
      this[LRU_LIST].length) {
    this[LRU_LIST].forEach(function (hit) {
      this[DISPOSE](hit.key, hit.value)
    }, this)
  }

  this[CACHE] = new Map() // hash of items by key
  this[LRU_LIST] = new Yallist() // list of items in order of use recency
  this[LENGTH] = 0 // length of items in the list
}

LRUCache.prototype.dump = function () {
  return this[LRU_LIST].map(function (hit) {
    if (!isStale(this, hit)) {
      return {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }
    }
  }, this).toArray().filter(function (h) {
    return h
  })
}

LRUCache.prototype.dumpLru = function () {
  return this[LRU_LIST]
}

LRUCache.prototype.inspect = function (n, opts) {
  var str = 'LRUCache {'
  var extras = false

  var as = this[ALLOW_STALE]
  if (as) {
    str += '\n  allowStale: true'
    extras = true
  }

  var max = this[MAX]
  if (max && max !== Infinity) {
    if (extras) {
      str += ','
    }
    str += '\n  max: ' + util.inspect(max, opts)
    extras = true
  }

  var maxAge = this[MAX_AGE]
  if (maxAge) {
    if (extras) {
      str += ','
    }
    str += '\n  maxAge: ' + util.inspect(maxAge, opts)
    extras = true
  }

  var lc = this[LENGTH_CALCULATOR]
  if (lc && lc !== naiveLength) {
    if (extras) {
      str += ','
    }
    str += '\n  length: ' + util.inspect(this[LENGTH], opts)
    extras = true
  }

  var didFirst = false
  this[LRU_LIST].forEach(function (item) {
    if (didFirst) {
      str += ',\n  '
    } else {
      if (extras) {
        str += ',\n'
      }
      didFirst = true
      str += '\n  '
    }
    var key = util.inspect(item.key).split('\n').join('\n  ')
    var val = { value: item.value }
    if (item.maxAge !== maxAge) {
      val.maxAge = item.maxAge
    }
    if (lc !== naiveLength) {
      val.length = item.length
    }
    if (isStale(this, item)) {
      val.stale = true
    }

    val = util.inspect(val, opts).split('\n').join('\n  ')
    str += key + ' => ' + val
  })

  if (didFirst || extras) {
    str += '\n'
  }
  str += '}'

  return str
}

LRUCache.prototype.set = function (key, value, maxAge) {
  maxAge = maxAge || this[MAX_AGE]

  var now = maxAge ? Date.now() : 0
  var len = this[LENGTH_CALCULATOR](value, key)

  if (this[CACHE].has(key)) {
    if (len > this[MAX]) {
      del(this, this[CACHE].get(key))
      return false
    }

    var node = this[CACHE].get(key)
    var item = node.value

    // dispose of the old one before overwriting
    // split out into 2 ifs for better coverage tracking
    if (this[DISPOSE]) {
      if (!this[NO_DISPOSE_ON_SET]) {
        this[DISPOSE](key, item.value)
      }
    }

    item.now = now
    item.maxAge = maxAge
    item.value = value
    this[LENGTH] += len - item.length
    item.length = len
    this.get(key)
    trim(this)
    return true
  }

  var hit = new Entry(key, value, len, now, maxAge)

  // oversized objects fall out of cache automatically.
  if (hit.length > this[MAX]) {
    if (this[DISPOSE]) {
      this[DISPOSE](key, value)
    }
    return false
  }

  this[LENGTH] += hit.length
  this[LRU_LIST].unshift(hit)
  this[CACHE].set(key, this[LRU_LIST].head)
  trim(this)
  return true
}

LRUCache.prototype.has = function (key) {
  if (!this[CACHE].has(key)) return false
  var hit = this[CACHE].get(key).value
  if (isStale(this, hit)) {
    return false
  }
  return true
}

LRUCache.prototype.get = function (key) {
  return get(this, key, true)
}

LRUCache.prototype.peek = function (key) {
  return get(this, key, false)
}

LRUCache.prototype.pop = function () {
  var node = this[LRU_LIST].tail
  if (!node) return null
  del(this, node)
  return node.value
}

LRUCache.prototype.del = function (key) {
  del(this, this[CACHE].get(key))
}

LRUCache.prototype.load = function (arr) {
  // reset the cache
  this.reset()

  var now = Date.now()
  // A previous serialized cache has the most recent items first
  for (var l = arr.length - 1; l >= 0; l--) {
    var hit = arr[l]
    var expiresAt = hit.e || 0
    if (expiresAt === 0) {
      // the item was created without expiration in a non aged cache
      this.set(hit.k, hit.v)
    } else {
      var maxAge = expiresAt - now
      // dont add already expired items
      if (maxAge > 0) {
        this.set(hit.k, hit.v, maxAge)
      }
    }
  }
}

LRUCache.prototype.prune = function () {
  var self = this
  this[CACHE].forEach(function (value, key) {
    get(self, key, false)
  })
}

function get (self, key, doUse) {
  var node = self[CACHE].get(key)
  if (node) {
    var hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE]) hit = undefined
    } else {
      if (doUse) {
        self[LRU_LIST].unshiftNode(node)
      }
    }
    if (hit) hit = hit.value
  }
  return hit
}

function isStale (self, hit) {
  if (!hit || (!hit.maxAge && !self[MAX_AGE])) {
    return false
  }
  var stale = false
  var diff = Date.now() - hit.now
  if (hit.maxAge) {
    stale = diff > hit.maxAge
  } else {
    stale = self[MAX_AGE] && (diff > self[MAX_AGE])
  }
  return stale
}

function trim (self) {
  if (self[LENGTH] > self[MAX]) {
    for (var walker = self[LRU_LIST].tail;
         self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      var prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

function del (self, node) {
  if (node) {
    var hit = node.value
    if (self[DISPOSE]) {
      self[DISPOSE](hit.key, hit.value)
    }
    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

// classy, since V8 prefers predictable objects.
function Entry (key, value, length, now, maxAge) {
  this.key = key
  this.value = value
  this.length = length
  this.now = now
  this.maxAge = maxAge || 0
}


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

if (process.env.npm_package_name === 'pseudomap' &&
    process.env.npm_lifecycle_script === 'test')
  process.env.TEST_PSEUDOMAP = 'true'

if (typeof Map === 'function' && !process.env.TEST_PSEUDOMAP) {
  module.exports = Map
} else {
  module.exports = __webpack_require__(114)
}


/***/ }),
/* 114 */
/***/ (function(module, exports) {

var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = PseudoMap

function PseudoMap (set) {
  if (!(this instanceof PseudoMap)) // whyyyyyyy
    throw new TypeError("Constructor PseudoMap requires 'new'")

  this.clear()

  if (set) {
    if ((set instanceof PseudoMap) ||
        (typeof Map === 'function' && set instanceof Map))
      set.forEach(function (value, key) {
        this.set(key, value)
      }, this)
    else if (Array.isArray(set))
      set.forEach(function (kv) {
        this.set(kv[0], kv[1])
      }, this)
    else
      throw new TypeError('invalid argument')
  }
}

PseudoMap.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  Object.keys(this._data).forEach(function (k) {
    if (k !== 'size')
      fn.call(thisp, this._data[k].value, this._data[k].key)
  }, this)
}

PseudoMap.prototype.has = function (k) {
  return !!find(this._data, k)
}

PseudoMap.prototype.get = function (k) {
  var res = find(this._data, k)
  return res && res.value
}

PseudoMap.prototype.set = function (k, v) {
  set(this._data, k, v)
}

PseudoMap.prototype.delete = function (k) {
  var res = find(this._data, k)
  if (res) {
    delete this._data[res._index]
    this._data.size--
  }
}

PseudoMap.prototype.clear = function () {
  var data = Object.create(null)
  data.size = 0

  Object.defineProperty(this, '_data', {
    value: data,
    enumerable: false,
    configurable: true,
    writable: false
  })
}

Object.defineProperty(PseudoMap.prototype, 'size', {
  get: function () {
    return this._data.size
  },
  set: function (n) {},
  enumerable: true,
  configurable: true
})

PseudoMap.prototype.values =
PseudoMap.prototype.keys =
PseudoMap.prototype.entries = function () {
  throw new Error('iterators are not implemented in this version')
}

// Either identical, or both NaN
function same (a, b) {
  return a === b || a !== a && b !== b
}

function Entry (k, v, i) {
  this.key = k
  this.value = v
  this._index = i
}

function find (data, k) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k))
      return data[key]
  }
}

function set (data, k, v) {
  for (var i = 0, s = '_' + k, key = s;
       hasOwnProperty.call(data, key);
       key = s + i++) {
    if (same(data[key].key, k)) {
      data[key].value = v
      return
    }
  }
  data.size++
  data[key] = new Entry(k, v, key)
}


/***/ }),
/* 115 */
/***/ (function(module, exports) {

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Load modules

const Fs = __webpack_require__(26);
const Boom = __webpack_require__(1);
const Hoek = __webpack_require__(0);


// Declare internals

const internals = {};


exports.File = function (path) {

    this.path = path;
    this.fd = null;
};


exports.File.prototype.open = function (mode, callback) {

    Hoek.assert(this.fd === null);

    Fs.open(this.path, mode, (err, fd) => {

        if (err) {
            if (this.path.indexOf('\u0000') !== -1 || err.code === 'ENOENT') {
                return callback(Boom.notFound());
            }

            if (err.code === 'EACCES' || err.code === 'EPERM') {
                return callback(Boom.forbidden(null, err.code));
            }

            return callback(Boom.boomify(err, { message: 'Failed to open file' }));
        }

        this.fd = fd;

        return callback();
    });
};


exports.File.prototype.close = function () {

    if (this.fd !== null) {
        Fs.close(this.fd, Hoek.ignore);
        this.fd = null;
    }
};


exports.File.prototype.stat = function (callback) {

    Hoek.assert(this.fd !== null);

    Fs.fstat(this.fd, (err, stat) => {

        if (err) {
            this.close(this.fd);
            return callback(Boom.boomify(err, { message: 'Failed to stat file' }));
        }

        if (stat.isDirectory()) {
            this.close(this.fd);
            return callback(Boom.forbidden(null, 'EISDIR'));
        }

        return callback(null, stat);
    });
};


exports.File.prototype.openStat = function (mode, callback) {

    this.open(mode, (err) => {

        if (err) {
            return callback(err);
        }

        this.stat(callback);
    });
};


exports.File.prototype.createReadStream = function (options) {

    Hoek.assert(this.fd !== null);

    options = Object.assign({ fd: this.fd, start: 0 }, options);

    const stream = Fs.createReadStream(this.path, options);

    if (options.autoClose !== false) {
        this.fd = null;           // The stream now owns the fd
    }

    return stream;
};


/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = {"_from":"inert@^4.2.0","_id":"inert@4.2.1","_inBundle":false,"_integrity":"sha512-qmbbZYPSzU/eOUOStPQvSjrU9IR1Q3uDtsEsVwnBQeZG43xu7Nrj6yuUrX3ice/03rv5dj/KiKB+NGCbiqH+aQ==","_location":"/inert","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"inert@^4.2.0","name":"inert","escapedName":"inert","rawSpec":"^4.2.0","saveSpec":null,"fetchSpec":"^4.2.0"},"_requiredBy":["/mk-server"],"_resolved":"https://registry.npmjs.org/inert/-/inert-4.2.1.tgz","_shasum":"da743c478a18a8378032f80ada128a28cd2bba93","_spec":"inert@^4.2.0","_where":"E:\\code\\mk\\mk-demo-helloworld\\release\\node_modules\\mk-server","bugs":{"url":"https://github.com/hapijs/inert/issues"},"bundleDependencies":false,"dependencies":{"ammo":"2.x.x","boom":"5.x.x","hoek":"4.x.x","items":"2.x.x","joi":"10.x.x","lru-cache":"4.1.x"},"deprecated":false,"description":"Static file and directory handlers plugin for hapi.js","devDependencies":{"code":"4.x.x","hapi":"16.x.x","lab":"14.x.x"},"engines":{"node":">=4.0.0"},"homepage":"https://github.com/hapijs/inert#readme","keywords":["file","directory","handler","hapi","plugin"],"license":"BSD-3-Clause","main":"lib/index.js","name":"inert","repository":{"type":"git","url":"git://github.com/hapijs/inert.git"},"scripts":{"test":"lab -f -a code -t 100 -L","test-cov-html":"lab -f -a code -r html -o coverage.html"},"version":"4.2.1"}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Load modules

const Http = __webpack_require__(10);
const Https = __webpack_require__(21);
const Hoek = __webpack_require__(0);
const Joi = __webpack_require__(3);
const Wreck = __webpack_require__(43);


// Declare internals

const internals = {
    agents: {}                                      // server.info.uri -> { http, https, insecure }
};


internals.defaults = {
    xforward: false,
    passThrough: false,
    redirects: false,
    timeout: 1000 * 60 * 3,                         // Timeout request after 3 minutes
    localStatePassThrough: false,                   // Pass cookies defined by the server upstream
    maxSockets: Infinity
};


internals.schema = Joi.object({
    host: Joi.string(),
    port: Joi.number().integer(),
    protocol: Joi.string().valid('http', 'https', 'http:', 'https:'),
    uri: Joi.string(),
    passThrough: Joi.boolean(),
    localStatePassThrough: Joi.boolean(),
    acceptEncoding: Joi.boolean().when('passThrough', { is: true, otherwise: Joi.forbidden() }),
    rejectUnauthorized: Joi.boolean(),
    xforward: Joi.boolean(),
    redirects: Joi.number().min(0).integer().allow(false),
    timeout: Joi.number().integer(),
    mapUri: Joi.func(),
    onResponse: Joi.func(),
    agent: Joi.object(),
    ttl: Joi.string().valid('upstream').allow(null),
    maxSockets: Joi.number().positive().allow(false)
})
    // .xor('host', 'mapUri', 'uri') // uri和host同时存在时，host表示反向代理请求的header.host
    .xor('mapUri', 'uri')
    .without('mapUri', 'port', 'protocol')
    .without('uri', 'port', 'protocol');


exports.register = function (server, pluginOptions, next) {

    server.handler('proxy', internals.handler);

    server.decorate('reply', 'proxy', function (options) {

        internals.handler(this.request.route, options)(this.request, this);
    });

    return next();
};

exports.register.attributes = {
    pkg: __webpack_require__(119)
};


internals.handler = function (route, handlerOptions) {

    Joi.assert(handlerOptions, internals.schema, 'Invalid proxy handler options (' + route.path + ')');
    Hoek.assert(!route.settings.payload || ((route.settings.payload.output === 'data' || route.settings.payload.output === 'stream') && !route.settings.payload.parse), 'Cannot proxy if payload is parsed or if output is not stream or data');
    const settings = Hoek.applyToDefaultsWithShallow(internals.defaults, handlerOptions, ['agent']);
    settings.mapUri = handlerOptions.mapUri || internals.mapUri(handlerOptions.protocol, handlerOptions.host, handlerOptions.port, handlerOptions.uri, route.path);

    if (settings.ttl === 'upstream') {
        settings._upstreamTtl = true;
    }

    return function (request, reply) {

        settings.mapUri(request, (err, uri, headers) => {

            if (err) {
                return reply(err);
            }

            const protocol = uri.split(':', 1)[0];

            const options = {
                headers: {},
                payload: request.payload,
                redirects: settings.redirects,
                timeout: settings.timeout,
                agent: internals.agent(protocol, settings, request.connection)
            };

            const bind = request.route.settings.bind;

            if (settings.passThrough) {
                options.headers = Hoek.clone(request.headers);
                delete options.headers.host;

                if (settings.acceptEncoding === false) {                    // Defaults to true
                    delete options.headers['accept-encoding'];
                }

                if (options.headers.cookie) {
                    delete options.headers.cookie;

                    const cookieHeader = request.connection.states.passThrough(request.headers.cookie, settings.localStatePassThrough);
                    if (cookieHeader) {
                        if (typeof cookieHeader !== 'string') {
                            return reply(cookieHeader);                     // Error
                        }

                        options.headers.cookie = cookieHeader;
                    }
                }
            }

            if (headers) {
                Hoek.merge(options.headers, headers);
            }

            if (settings.xforward &&
                request.info.remotePort &&
                request.info.remoteAddress) {
                options.headers['x-forwarded-for'] = (options.headers['x-forwarded-for'] ? options.headers['x-forwarded-for'] + ',' : '') + request.info.remoteAddress;
                options.headers['x-forwarded-port'] = (options.headers['x-forwarded-port'] ? options.headers['x-forwarded-port'] + ',' : '') + request.info.remotePort;
                options.headers['x-forwarded-proto'] = (options.headers['x-forwarded-proto'] ? options.headers['x-forwarded-proto'] + ',' : '') + request.connection.info.protocol;
                options.headers['x-forwarded-host'] = (options.headers['x-forwarded-host'] ? options.headers['x-forwarded-host'] + ',' : '') + request.info.host;
            }

            const contentType = request.headers['content-type'];
            if (contentType) {
                options.headers['content-type'] = contentType;
            }

            // Send request

            Wreck.request(request.method, uri, options, (err, res) => {

                let ttl = null;

                if (err) {
                    if (settings.onResponse) {
                        return settings.onResponse.call(bind, err, res, request, reply, settings, ttl);
                    }

                    return reply(err);
                }

                if (settings._upstreamTtl) {
                    const cacheControlHeader = res.headers['cache-control'];
                    if (cacheControlHeader) {
                        const cacheControl = Wreck.parseCacheControl(cacheControlHeader);
                        if (cacheControl) {
                            ttl = cacheControl['max-age'] * 1000;
                        }
                    }
                }

                if (settings.onResponse) {
                    return settings.onResponse.call(bind, null, res, request, reply, settings, ttl);
                }

                return reply(res)
                    .ttl(ttl)
                    .code(res.statusCode)
                    .passThrough(!!settings.passThrough);   // Default to false
            });
        });
    };
};


internals.handler.defaults = function (method) {

    const payload = method !== 'get' && method !== 'head';
    return payload ? {
        payload: {
            output: 'stream',
            parse: false
        }
    } : null;
};


internals.mapUri = function (protocol, host, port, uri, path) {

    if (uri) {
        return function (request, next) {

            if (uri.indexOf('{') === -1) {
                return next(null, uri);
            }

            let address = uri.replace(/{protocol}/g, request.connection.info.protocol)
                .replace(/{host}/g, request.connection.info.host)
                .replace(/{port}/g, request.connection.info.port)
                .replace(/{path\*}/g, request.url.path.substr(path.indexOf('{path*}'))) //Compatible with nginx R-Proxy
                .replace(/{path}/g, request.url.path);

            Object.keys(request.params).forEach((key) => {

                const re = new RegExp(`{${key}}`, 'g');
                address = address.replace(re, request.params[key]);
            });

            let headers = {}; //支持设置反向代理的header.host
            if (host) {
                host = host.replace(/{host}/g, request.connection.info.host)
                headers.host = host;
            }

            return next(null, address, headers);
        };
    }

    if (protocol &&
        protocol[protocol.length - 1] !== ':') {

        protocol += ':';
    }

    protocol = protocol || 'http:';
    port = port || (protocol === 'http:' ? 80 : 443);
    const baseUrl = protocol + '//' + host + ':' + port;

    return function (request, next) {

        return next(null, baseUrl + request.path + (request.url.search || ''));
    };
};


internals.agent = function (protocol, settings, connection) {

    if (settings.agent) {
        return settings.agent;
    }

    if (settings.maxSockets === false) {
        return undefined;
    }

    internals.agents[connection.info.uri] = internals.agents[connection.info.uri] || {};
    const agents = internals.agents[connection.info.uri];

    const type = (protocol === 'http' ? 'http' : (settings.rejectUnauthorized === false ? 'insecure' : 'https'));
    if (!agents[type]) {
        agents[type] = (type === 'http' ? new Http.Agent() : (type === 'https' ? new Https.Agent() : new Https.Agent({ rejectUnauthorized: false })));
        agents[type].maxSockets = settings.maxSockets;
    }

    return agents[type];
};


/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = {"name":"h2o2","description":"Proxy handler plugin for hapi.js","version":"5.4.0","repository":"git://github.com/hapijs/h2o2","main":"lib/index.js","keywords":["HTTP","proxy","handler","hapi","plugin"],"engines":{"node":">=4.0.0"},"dependencies":{"boom":"3.x.x","hoek":"4.x.x","joi":"9.x.x","wreck":"9.x.x"},"devDependencies":{"code":"3.x.x","hapi":"14.x.x","inert":"4.x.x","lab":"11.x.x"},"scripts":{"test":"lab -a code -t 100 -L","test-cov-html":"lab -a code -r html -o coverage.html"},"license":"BSD-3-Clause"}

/***/ }),
/* 120 */
/***/ (function(module, exports) {

/**
 * server配置
 * 
 */

const config = ({ services }) => {
    Object.assign(server.services, services)
    configServices(server)
    return server
}

const server = {
    host: "0.0.0.0",
    port: 8000,
    apiRootUrl: "/v1",
    website: "www",
    interceptors: [],
    services: {
        // referrenced service
    },
    configs: {
        // serviceName: {}
    },
}

function configServices(server) {
    var { services, configs } = server;
    Object.keys(services).filter(k => !!services[k].config).forEach(k => {
        let curCfg = Object.assign({ server, services }, configs["*"], configs[k]);
        services[k].config(curCfg);
    })
}

module.exports = config


/***/ })
/******/ ]);