module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(12)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var fullScreen = exports.fullScreen = function fullScreen(p) {
  return p.SetPlayFullScreen();
};
var normalScreen = exports.normalScreen = function normalScreen(p) {
  return p.SetPlayNormalScreen();
};
var boost = exports.boost = function boost(p) {
  return p.SetPlayLocalBoost();
};
var openSound = exports.openSound = function openSound(p) {
  return p.OpenPlayerSound();
};
var closeSound = exports.closeSound = function closeSound(p) {
  return p.StopPlayerSound();
};
var setVolume = exports.setVolume = function setVolume(p, volume) {
  return p.SetPlayerVolume(volume);
};
var getVolume = exports.getVolume = function getVolume(p) {
  var r = p.GetPlayerVolume();
  return JSON.parse(r).Volume || -1;
};
var getFile = exports.getFile = function getFile(p) {
  var fileExt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var fileFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var r = JSON.parse(p.GetFileBrowser(1, fileExt, fileFilter));
  return r.success ? r.fileName : r.errno;
};
var saveFile = exports.saveFile = function saveFile(p) {
  var fileExt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var fileFilter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  var r = JSON.parse(p.GetFileBrowser(0, fileExt, fileFilter));
  return r.success ? r.fileName : r.errno;
};
var getPath = exports.getPath = function getPath(p) {
  var r = JSON.parse(p.GetFileDirectory());
  return r.success ? r.DirName : r.errno;
};
var getCapture = exports.getCapture = function getCapture(p) {
  var quality = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

  return p.GetRealPicturebyBase64(1, quality);
};
var saveCapture = exports.saveCapture = function saveCapture(p, path) {
  return p.GetPlayerPicture(path, 1);
};
var setScale = exports.setScale = function setScale(p, w, h, auto) {
  return p.SetPlayStretchBlt(w, h, auto);
};
var setScaleMode = exports.setScaleMode = function setScaleMode(plg, mode) {
  var p = [[1, 1, true], [0, 0, false], [4, 3, true], [16, 9, true]];
  var args = p[mode - 1] || p[0];
  return setScale.apply(null, [plg].concat(args));
};
var setClickEvent = exports.setClickEvent = function setClickEvent(p, event) {
  return p.SetMouseStatusCallback(event);
};
var setKeyEvent = exports.setKeyEvent = function setKeyEvent(p, event) {
  return p.SetKeyboardCallback(event);
};
exports.default = {
  fullScreen: fullScreen,
  boost: boost,
  openSound: openSound,
  closeSound: closeSound,
  setVolume: setVolume,
  getVolume: getVolume,
  getFile: getFile,
  saveFile: saveFile,
  getPath: getPath,
  getCapture: getCapture,
  saveCapture: saveCapture,
  setScale: setScale,
  setScaleMode: setScaleMode,
  setClickEvent: setClickEvent,
  setKeyEvent: setKeyEvent,
  normalScreen: normalScreen
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("vue");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollBar_vue__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cbe4227_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scrollBar_vue__ = __webpack_require__(28);
var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollBar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5cbe4227_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scrollBar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\scroll\\scrollBar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5cbe4227", Component.options)
  } else {
    hotAPI.reload("data-v-5cbe4227", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(27);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.local = exports.preview = exports.playback = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import bsVideoProgress from './components/videoProgress.vue'


var _cover = __webpack_require__(9);

var _cover2 = _interopRequireDefault(_cover);

var _videoFrame = __webpack_require__(15);

var _videoFrame2 = _interopRequireDefault(_videoFrame);

var _scroll = __webpack_require__(20);

var _scroll2 = _interopRequireDefault(_scroll);

var _crumb = __webpack_require__(30);

var _crumb2 = _interopRequireDefault(_crumb);

var _timeline = __webpack_require__(35);

var _timeline2 = _interopRequireDefault(_timeline);

var _progressBar = __webpack_require__(40);

var _progressBar2 = _interopRequireDefault(_progressBar);

var _calendar = __webpack_require__(45);

var _calendar2 = _interopRequireDefault(_calendar);

var _Tree = __webpack_require__(51);

var _Tree2 = _interopRequireDefault(_Tree);

var _select = __webpack_require__(57);

var _select2 = _interopRequireDefault(_select);

var _playback = __webpack_require__(67);

var _playback2 = _interopRequireDefault(_playback);

var _preview = __webpack_require__(68);

var _preview2 = _interopRequireDefault(_preview);

var _local = __webpack_require__(69);

var _local2 = _interopRequireDefault(_local);

var _disable = __webpack_require__(70);

var _disable2 = _interopRequireDefault(_disable);

__webpack_require__(73);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var components = {
  bsScroll: _scroll2.default,
  bsCover: _cover2.default,
  bsVideo: _videoFrame2.default,
  bsCrumb: _crumb2.default,
  bsTimeline: _timeline2.default,
  bsProgressBar: _progressBar2.default,
  // bsVideoProgress,
  bsCalendar: _calendar2.default,
  bsTree: _Tree2.default,
  bsSelect: _select2.default
};

var directives = {
  disable: _disable2.default
};

var bsvue = _extends({
  install: function install(Vue) {
    Object.keys(components).forEach(function (item) {
      return Vue.component(components[item].name, components[item]);
    });
    Object.keys(directives).forEach(function (item) {
      return Vue.directive(directives[item].name, directives[item]);
    });
  }
}, components, directives);

exports.default = bsvue;
exports.playback = _playback2.default;
exports.preview = _preview2.default;
exports.local = _local2.default;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_cover_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_cover_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_cover_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_15207677_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_cover_vue__ = __webpack_require__(14);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(10)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_cover_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_15207677_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_cover_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\cover.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-15207677", Component.options)
  } else {
    hotAPI.reload("data-v-15207677", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("3c8fbf77", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-15207677\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./cover.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-15207677\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./cover.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.bs-cover-container{\r\n  position: relative;\r\n  z-index: 100;\r\n  width: 100%;\r\n  height: 100%;\n}\n.bs-cover-frame {\r\n  position: absolute;\r\n  width: 100%;\r\n  height: 100%;\r\n  z-index: 99;\r\n  left: 0;\r\n  top: 0;\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0 none;\n}\r\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//

exports.default = {
  name: 'bs-cover',
  props: {
    value: {
      required: true,
      type: Boolean
    }
  }
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "bs-cover-container" }, [_vm._t("default")], 2),
    _vm._v(" "),
    _vm.value ? _c("iframe", { staticClass: "bs-cover-frame" }) : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-15207677", esExports)
  }
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_videoFrame_vue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_videoFrame_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_videoFrame_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4309a8a2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_videoFrame_vue__ = __webpack_require__(19);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(16)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_videoFrame_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4309a8a2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_videoFrame_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\videoFrame.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4309a8a2", Component.options)
  } else {
    hotAPI.reload("data-v-4309a8a2", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("62c08063", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4309a8a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./videoFrame.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4309a8a2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./videoFrame.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.bs-video-single {\r\n  display: inline-block;\r\n  vertical-align: middle;\n}\n.bs-out {\r\n  position: absolute;\r\n  top: -99999px;\r\n  width: 10px !important;\r\n  height: 10px !important;\n}\r\n", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
//
//
//
//
//
//
//

var _vue = __webpack_require__(4);

var _vue2 = _interopRequireDefault(_vue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'bs-video',
  props: {
    count: {
      default: 1,
      type: Number
    },
    showNum: {
      default: 1,
      type: Number
    },
    styles: {
      default: null
    },
    COMprops: {
      default: function _default() {
        return [];
      }
    },
    pluginCOM: {
      required: true
    },
    curPage: {
      default: 0,
      type: Number
    }
  },
  data: function data() {
    return {
      _styles: [],
      activedIndex: -1,
      COMVM: []
    };
  },

  watch: {
    showNum: function showNum() {
      this.computeStyles();
      if (this.activedIndex > this.showNum - 1) {
        this.activedIndex = 0;
      }
    },
    styles: function styles(s) {
      this._styles = s;
    }
  },
  methods: {
    mountCOM: function mountCOM() {
      var divs = this.$el.querySelectorAll('.bs-video-single-container');
      var v = _vue2.default.component(this.pluginCOM.name);
      for (var index = 0; index < this.count; index++) {
        var propsData = _extends({
          index: index
        }, this.COMprops[index]);
        var vm = new v({ propsData: propsData, parent: this });
        vm.$mount(divs[index]);
        this.COMVM.push(vm);
      }
      this.activedIndex = 0;
      this.$emit('update:activedVM', this.COMVM[0]);
    },
    computeStyles: function computeStyles() {
      if (this.styles) {
        this._styles = this.styles;
      } else {
        this._styles = [];
        var styles = [];
        var sqrtNum = Math.sqrt(this.showNum);
        var per = (100 / sqrtNum).toFixed(2) + '%';
        var style = {
          width: per,
          height: per
        };
        var i = this.count;
        while (i--) {
          styles.push(_extends({}, style));
        }
        this._styles = styles;
      }
    },
    isOut: function isOut(index) {
      if (this.styles) {
        return false;
      }
      var min = this.curPage * this.showNum;
      var max = (this.curPage + 1) * this.showNum;
      if (max > this.count) {
        max = this.count;
      }
      return !(index >= min && index < max);
    },
    getCOM: function getCOM(index) {
      return this.COMVM[index];
    },
    activeFrame: function activeFrame(index) {
      this.activedIndex = index;
    },
    clickVideo: function clickVideo(index) {
      this.activedIndex = index - 1;
      this.$emit('update:activedVM', this.COMVM[index]);
    }
  },
  created: function created() {
    this.computeStyles();
    if (!this.pluginCOM.name) {
      throw new Error('pluginCOM组件对象必须有name属性');
    }
    _vue2.default.component(this.pluginCOM.name, this.pluginCOM);
  },
  mounted: function mounted() {
    this.mountCOM();
  },
  beforeDestroy: function beforeDestroy() {
    this.COMVM.forEach(function (vm) {
      return vm.$destroy();
    });
  }
};

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "bs-video" },
    [
      _vm._l(_vm.count, function(index) {
        return _c(
          "div",
          {
            key: index - 1,
            staticClass: "bs-video-single",
            class: {
              "bs-out": _vm.isOut(index - 1),
              "bs-actived": index - 1 === _vm.activedIndex
            },
            style: _vm._styles[index - 1],
            on: {
              click: function($event) {
                _vm.clickVideo(index)
              }
            }
          },
          [_c("div", { staticClass: "bs-video-single-container" })]
        )
      }),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4309a8a2", esExports)
  }
}

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scroll_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scroll_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scroll_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_55296afc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scroll_vue__ = __webpack_require__(29);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(21)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scroll_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_55296afc_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scroll_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\scroll\\scroll.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55296afc", Component.options)
  } else {
    hotAPI.reload("data-v-55296afc", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("00624db6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-55296afc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./scroll.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-55296afc\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./scroll.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.scrollbar {\r\n  user-select: none;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\n}\r\n", ""]);

// exports


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scrollBar = __webpack_require__(5);

var _scrollBar2 = _interopRequireDefault(_scrollBar);

var _lodash = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//

// 多写一层是由于updated触发问题
exports.default = {
  name: 'bs-scroll',
  components: { scrollBar: _scrollBar2.default },
  props: {
    height: {
      default: '100%',
      type: String
    },
    option: {
      type: Object
    },
    wheelSpeed: {
      type: Number,
      default: 40
    }
  },
  methods: {
    updateScroll: function updateScroll(t) {
      this.$refs.sb.updateScroll(t);
    },
    update: function update() {
      var _this = this;

      this.$nextTick(function () {
        var t = _this.getScrollTop();
        _this.updateScroll();
        var conHeight = _this.$el.offsetHeight;
        if (_this.$overview) {
          var viewHeight = _this.$overview.offsetHeight;
          if (viewHeight > conHeight) {
            _this.setScrollTop(t);
          }
        }
      });
    },
    setScrollTop: function setScrollTop(t) {
      if (t < 0) {
        t = 0;
      } else if (this.$overview) {
        var conHeight = this.$el.offsetHeight;
        var viewHeight = this.$overview.offsetHeight;
        if (t > viewHeight - conHeight) {
          t = viewHeight - conHeight;
        }
      }
      this.updateScroll(t);
    },
    getScrollTop: function getScrollTop() {
      if (this.$overview) {
        var top = this.$overview.style.top || '0';
        return Math.abs(parseInt(top));
      } else {
        return 0;
      }
    },
    emitMove: function emitMove() {
      if (this.emove) {
        this.emove();
      }
    },
    _emove: function _emove() {
      this.$emit('on-scroll');
      var top = this.getScrollTop();
      if (top === 0) {
        this.$emit('scroll-top');
      } else if (this.$overview) {
        var conHeight = this.$el.offsetHeight;
        var viewHeight = this.$overview.offsetHeight;
        if (top + conHeight === viewHeight) {
          this.$emit('scroll-bottom');
        }
      }
    }
  },
  created: function created() {
    this.emove = (0, _lodash.debounce)(this._emove.bind(this), 200);
  },
  mounted: function mounted() {
    this.$overview = this.$el.querySelector(".overview");
  },
  updated: function updated() {
    var _this2 = this;

    this.$nextTick(function () {
      _this2.update();
    });
  },
  beforeDestroy: function beforeDestroy() {
    delete this.emove;
    delete this.$overview;
  }
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = __webpack_require__(4);

var _vue2 = _interopRequireDefault(_vue);

__webpack_require__(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  props: {
    option: {
      type: Object
    },
    wheelSpeed: {
      type: Number,
      default: 40
    }
  },
  data: function data() {
    return {
      contentPosition: 0,
      thumbPosition: 0,
      contentSize: 0,
      viewportSize: 0,
      trackRatio: 0,
      trackSize: 0,
      thumbSize: 0,
      contentRatio: 0,
      hasContentToSroll: false,
      tempStop: false,
      mousePosition: 0,
      thumbPositionCalc: null,
      thumbSizeMin: 20,
      doption: {
        color: '#909090',
        background: '#e3e3e3',
        width: '10px',
        margin: '0'
      }
    };
  },

  computed: {
    thumbPositionValue: function thumbPositionValue() {
      return this.thumbPositionCalc === null ? this.thumbPosition : this.thumbPositionCalc;
    }
  },
  methods: {
    wheel: function wheel(e) {
      if (this.hasContentToSroll) {
        var wheelSpeedDelta = -(e.deltaY || e.detail || -1 / 3 * e.wheelDelta) / 40;
        this.contentPosition -= wheelSpeedDelta * this.wheelSpeed;
        this.contentPosition = Math.min(this.contentSize - this.viewportSize, Math.max(0, this.contentPosition));
        this.thumbPosition = this.contentPosition / this.trackRatio;
        if (this.isAtBegin() || this.isAtEnd()) {
          e.preventDefault();
        }
      }
    },
    isAtBegin: function isAtBegin() {
      return this.contentPosition > 0;
    },
    isAtEnd: function isAtEnd() {
      return this.contentPosition <= this.contentSize - this.viewportSize - 5;
    },
    updateScroll: function updateScroll(scrollTo) {
      this.viewportSize = this.$viewport.offsetHeight;
      this.contentSize = this.$overview.scrollHeight;
      this.contentRatio = this.viewportSize / this.contentSize;
      this.trackSize = this.viewportSize;
      this.thumbSize = Math.min(this.trackSize, Math.max(this.thumbSizeMin, this.trackSize * this.contentRatio));
      this.trackRatio = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize);
      this.hasContentToSroll = this.contentRatio < 1;

      switch (scrollTo) {
        case "bottom":
          this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0);
          break;

        case "relative":
          this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition));
          break;

        default:
          this.contentPosition = parseInt(scrollTo, 10) || 0;
      }
      this.thumbPosition = this.contentPosition / this.trackRatio;
    },
    start: function start(e, gotoMouse) {
      if (this.hasContentToSroll) {
        this.mousePosition = gotoMouse ? this.$thumb.getBoundingClientRect().top : e.clientY;
        document.body.classList.add('noSelect');
        document.addEventListener('mousemove', this.drag);
        document.addEventListener('mouseup', this._end);
        this.drag(e);
      }
    },
    end: function end() {
      this.thumbPosition = parseInt(this.thumbPositionCalc, 10);
      this.thumbPositionCalc = null;
      document.removeEventListener('mousemove', this.drag);
      document.removeEventListener('mouseup', this._end);
      document.body.classList.remove('noSelect');
    },
    _drag: function _drag(e) {
      if (this.hasContentToSroll) {
        var mousePositionNew = e.clientY;
        var thumbPositionDelta = mousePositionNew - this.mousePosition;
        var thumbPositionNew = Math.min(this.trackSize - this.thumbSize, Math.max(0, this.thumbPosition + thumbPositionDelta));
        this.contentPosition = thumbPositionNew * this.trackRatio;
        this.thumbPositionCalc = thumbPositionNew;
        if (isNaN(thumbPositionNew)) {
          this.thumbPositionCalc = 0;
        }
      }
    }
  },
  created: function created() {
    Object.assign(this.doption, _vue2.default.ScrollOption);
    Object.assign(this.doption, this.option);
  },
  mounted: function mounted() {
    this.$viewport = this.$el.querySelector('.viewport');
    this.$overview = this.$el.querySelector('.overview');
    this.$thumb = this.$el.querySelector('.thumb');
    this.drag = this._drag.bind(this);
    this._end = this.end.bind(this);
    this.updateScroll();
  },
  beforeDestroy: function beforeDestroy() {
    document.removeEventListener('mousemove', this.drag);
    document.removeEventListener('mouseup', this._end);
    delete this.$viewport;
    delete this.$overview;
    delete this.$thumb;
    delete this.drag;
    delete this._end;
  }
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!./tinyscrollbar.css", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!./tinyscrollbar.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/* Tiny Scrollbar */\r\n.bs-scroll .viewport { height: 100%; overflow: hidden; position: relative; }\r\n.bs-scroll .overview { list-style: none; position: absolute; left: 0; right: 0; top: 0; padding: 0; margin: 0; }\r\n.bs-scroll .scrollbar{ position: relative; background-position: 0 0; float: right; height:100%; border-radius: 16px;}\r\n.bs-scroll .track { height: 100%; position: relative; padding: 0; }\r\n.bs-scroll .thumb { height: 20px; width: 100%; cursor: pointer; overflow: hidden; position: absolute; top: 0; border-radius: 16px;}\r\n.bs-scroll .disable { display: none; }\r\n.noSelect { user-select: none; -o-user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; }\r\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "div",
      {
        staticClass: "scrollbar",
        class: { disable: !_vm.hasContentToSroll },
        style: {
          margin: "0 " + _vm.doption.margin,
          background: _vm.doption.background,
          width: _vm.doption.width,
          height: _vm.trackSize + "px"
        },
        attrs: { onselectstart: "return false" }
      },
      [
        _c(
          "div",
          {
            staticClass: "track",
            style: { height: _vm.trackSize + "px" },
            on: {
              mousedown: function($event) {
                if ($event.target !== $event.currentTarget) {
                  return null
                }
                _vm.start($event, true)
              },
              mouseup: _vm.end
            }
          },
          [
            _c(
              "div",
              {
                staticClass: "thumb",
                style: {
                  background: _vm.doption.color,
                  top: _vm.thumbPositionValue + "px",
                  height: _vm.thumbSize + "px"
                },
                on: { mousedown: _vm.start }
              },
              [_c("div", { staticClass: "end" })]
            )
          ]
        )
      ]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "viewport" }, [
      _c(
        "div",
        {
          staticClass: "overview",
          style: { top: -_vm.contentPosition + "px" },
          on: {
            mousewheel: function($event) {
              $event.stopPropagation()
              _vm.wheel($event)
            }
          }
        },
        [_vm._t("default")],
        2
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5cbe4227", esExports)
  }
}

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "scrollBar",
    {
      ref: "sb",
      staticClass: "bs-scroll",
      style: { height: _vm.height },
      attrs: { option: _vm.option, wheelSpeed: _vm.wheelSpeed },
      on: {
        move: function($event) {
          $event.stopPropagation()
          _vm.emitMove($event)
        }
      }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-55296afc", esExports)
  }
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_crumb_vue__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_crumb_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_crumb_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_24a30ebb_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_crumb_vue__ = __webpack_require__(34);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(31)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_crumb_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_24a30ebb_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_crumb_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\crumb.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-24a30ebb", Component.options)
  } else {
    hotAPI.reload("data-v-24a30ebb", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("3a6d822b", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-24a30ebb\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./crumb.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-24a30ebb\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./crumb.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.bs-crumb,\r\n.bs-crumb-item,\r\n.bs-crumb-sep {\r\n  display: inline-block;\r\n  cursor: pointer;\n}\n#hiddenInput {\r\n  position: absolute;\r\n  top: -9999px;\n}\n.bs-crumb-select {\r\n  position: absolute;\r\n  overflow-y: auto;\n}\n.bs-crumb-select-item {\r\n  cursor: pointer;\n}\r\n", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {
  name: 'bs-crumb',
  props: {
    data: {
      required: true
    },
    value: {
      required: true
    },
    childName: {
      default: 'child'
    },
    textName: {
      default: 'text'
    }
  },
  data: function data() {
    return {
      isShowSelect: false,
      showIndex: -1,
      selectLeft: 0,
      list: [],
      timer: -1
    };
  },

  computed: {
    crumbs: function crumbs() {
      var crumbs = [];
      filterCrumbs(this.data[0], crumbs, this.value, this.childName);
      return crumbs;
    }
  },
  methods: {
    emitValue: function emitValue(v) {
      this.$emit('input', v.id);
      this.$emit('update:node', v);
      this.hideSelect();
    },
    selectOther: function selectOther(index, event) {
      this.selectLeft = event.target.offsetLeft;
      if (index === this.showIndex) {
        this.hideSelect();
      } else {
        this.showSelect(index);
      }
    },
    showSelect: function showSelect(index) {
      var _this = this;

      this.showIndex = index;
      this.list = this.crumbs[index][this.childName] || [];
      this.stopBlurEvent();
      this.$nextTick(function () {
        _this.isShowSelect = true;
        _this.focus();
      });
    },
    hideSelect: function hideSelect() {
      this.showIndex = -1;
      this.isShowSelect = false;
    },
    focus: function focus() {
      var _this2 = this;

      this.$nextTick(function () {
        var input = _this2.$el.querySelector('#hiddenInput');
        if (input !== null) {
          input.focus();
        }
      });
    },
    blurEvent: function blurEvent() {
      var _this3 = this;

      this.timer = setTimeout(function () {
        _this3.hideSelect();
      }, 200);
    },
    stopBlurEvent: function stopBlurEvent() {
      clearTimeout(this.timer);
    }
  }
};


function filterCrumbs(data, resultList, id, childName) {
  if (!data) {
    return false;
  }
  var isMatch = false;
  resultList.push(data);
  if (data.id === id) {
    isMatch = true;
  } else if (data[childName]) {
    try {
      data[childName].forEach(function (ch) {
        isMatch = filterCrumbs(ch, resultList, id, childName);
        if (isMatch) {
          throw new Error('break forEach');
        }
      });
    } catch (e) {}
  }
  if (!isMatch) {
    // 没有匹配上 这次弹出
    resultList.pop();
  }
  return isMatch;
}

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticStyle: { position: "relative" } },
    [
      _vm._l(_vm.crumbs, function(crumb, index) {
        return _c("div", { key: crumb.id, staticClass: "bs-crumb" }, [
          _c(
            "div",
            {
              staticClass: "bs-crumb-item",
              on: {
                click: function($event) {
                  _vm.emitValue(crumb)
                }
              }
            },
            [_vm._v(_vm._s(crumb[_vm.textName]))]
          ),
          _vm._v(" "),
          _vm.crumbs[index][_vm.childName]
            ? _c(
                "div",
                {
                  staticClass: "bs-crumb-sep",
                  class: [
                    _vm.isShowSelect && _vm.showIndex === index ? "actived" : ""
                  ],
                  on: {
                    click: function(e) {
                      return _vm.selectOther(index, e)
                    }
                  }
                },
                [
                  _c("i", {
                    staticClass: "fa",
                    class: [
                      _vm.isShowSelect && _vm.showIndex === index
                        ? "fa-angle-down"
                        : "fa-angle-right"
                    ]
                  })
                ]
              )
            : _vm._e()
        ])
      }),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.isShowSelect,
              expression: "isShowSelect"
            }
          ],
          staticClass: "bs-crumb-select",
          style: { left: _vm.selectLeft - 10 + "px" }
        },
        [
          _c("input", {
            attrs: { id: "hiddenInput", type: "text" },
            on: { blur: _vm.blurEvent }
          }),
          _vm._v(" "),
          _c(
            "ul",
            {
              staticStyle: { "list-style": "none", margin: "0", padding: "0" }
            },
            _vm._l(_vm.list, function(item) {
              return _c(
                "li",
                {
                  key: item.id,
                  staticClass: "bs-crumb-select-item",
                  on: {
                    click: function($event) {
                      _vm.emitValue(item)
                    }
                  }
                },
                [_vm._v(_vm._s(item[_vm.textName]))]
              )
            })
          )
        ]
      )
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-24a30ebb", esExports)
  }
}

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_timeline_vue__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_timeline_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_timeline_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a2844c9e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_timeline_vue__ = __webpack_require__(39);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(36)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-a2844c9e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_timeline_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_a2844c9e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_timeline_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\timeline.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a2844c9e", Component.options)
  } else {
    hotAPI.reload("data-v-a2844c9e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("51744c62", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a2844c9e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./timeline.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-a2844c9e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./timeline.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n#timeline[data-v-a2844c9e] {\n  position: relative;\n}\n#timeline .line[data-v-a2844c9e] {\n  width: 100%;\n  height: 110px;\n  cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//
//
//
//
//

// 使用今天零点的时间作为基准时间，绘制时间轴由当前选择时间与基准时间计算
exports.default = {
  name: 'bs-timeline',
  props: {
    value: { // 时间
      type: Number,
      default: function _default() {
        var date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        date.setSeconds(0);
        return date.getTime();
      }
    },
    recordInfo: { // 录像信息
      type: Array,
      default: function _default() {
        return [];
      }
    },
    level: {
      type: Number,
      default: 24
    },
    timeLineColor: {
      type: String,
      default: '#1fa0fe'
    },
    eventLineColor: {
      type: String,
      default: '#fc6e30'
    },
    lineColor: {
      type: String,
      default: '#ccc'
    }
  },
  data: function data() {
    var date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var today0 = date.getTime();
    return {
      today0: today0,
      time: this.value,
      canvas: null,
      ctx: null,
      startPosition: 0,
      canMove: false,
      canvasWidth: 0,
      wheelIndex: 0,
      activeIndex: 0
    };
  },

  computed: {
    scale: function scale() {
      // 1px代表的时间（毫秒）
      return this.level * 60 * 60 * 1000 / this.canvasWidth;
    },
    timeList: function timeList() {
      var arr = [];
      var allTime = 24 * 60 * 60; // 24小时的秒数
      var range = this.level * 60 * 60 / 12; // 两大格之间的间距
      for (var s = 0; s <= allTime; s += range) {
        var second = s;
        var hour = parseInt(second / 3600);
        second = second % 3600;
        var minute = parseInt(second / 60);
        second = second % 60;
        arr.push([hour, minute, second].map(this.addZero).join(':'));
      }
      return [].concat(arr, _toConsumableArray(arr.slice(1)));
    },

    /*
    * 计算绘制时间轴时的位移,需要注意当前时间应该是轴的中间位置，指针所指的位置，而不是轴开始的位置,还有时间差为正，则位置为负
    * this.level * 60 * 60 * 1000 / 2   可视轴一半所代表的的时间
    * rangeTime 当前时间距中心位置偏移的时间
    */
    beforeSpace: function beforeSpace() {
      var rangeTime = -(this.time - this.today0 - this.level * 60 * 60 * 1000 / 2) % (24 * 60 * 60 * 1000);
      return (rangeTime > 0 ? rangeTime - 24 * 60 * 60 * 1000 : rangeTime) / this.scale;
    }
  },
  watch: {
    value: function value(newValue) {
      this.time = newValue;
    },
    time: function time(newTime) {
      this.draw();
      this.$emit('input', newTime);
    },
    level: function level() {
      this.draw();
    }
  },
  methods: {
    init: function init() {
      var _this = this;

      this.canvas = this.$refs.line;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.height = 110;
      this.resizeFn = function () {
        _this.canvasWidth = _this.$refs.line.offsetWidth;
        _this.canvas.width = _this.canvasWidth;
        _this.draw();
      };
      this.resizeFn();
    },
    scroll: function scroll(evt) {
      if (this.recordInfo.length <= 2) {
        return;
      }
      var evt = evt || window.event;
      if (evt.preventDefault) {
        // 阻止默认事件流
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        evt.returnValue = false;
        evt.cancelBubble = true;
      }

      var len = this.recordInfo.length;
      var deltaY = evt.deltaY;

      if (deltaY > 0) {
        this.wheelIndex++;
      }
      if (deltaY < 0) {
        this.wheelIndex--;
      }

      if (this.wheelIndex < 0) {
        this.wheelIndex = 0;
      }
      if (this.wheelIndex > len - 2) {
        this.wheelIndex = len - 2;
      }
      this.draw();
    },
    initStyle: function initStyle() {
      // 初始化背景色
      this.ctx.fillStyle = '#393E46';
      this.ctx.fillRect(0, 0, this.canvasWidth, 50);
      this.ctx.fillStyle = '#222831';
      this.ctx.fillRect(0, 50, this.canvasWidth, 60);
      this.ctx.fillStyle = this.lineColor;
      this.ctx.fillRect(0, 50, this.canvasWidth, 10);
      if (this.recordInfo.length > 1) {
        this.ctx.fillRect(0, 80, this.canvasWidth, 10);
      }
    },
    addZero: function addZero(n) {
      return +n < 10 ? '0' + n : '' + n;
    },
    draw: function draw() {
      // this.ctx.clearRect(0, 0, this.canvasWidth, this.canvas.height)
      this.initStyle();
      this.drawTimes();
      this.drawColorLine();
      this.drawScroll();
      this.drawPointer();
    },
    drawPointer: function drawPointer() {
      // 画中间的指针
      this.ctx.strokeStyle = '#1fa0fe';
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvasWidth / 2, 20);
      this.ctx.lineTo(this.canvasWidth / 2, 110);
      this.ctx.stroke();
    },
    drawTimes: function drawTimes() {
      var _this2 = this;

      // 画时间
      this.ctx.strokeStyle = '#EEE';
      this.ctx.fillStyle = '#EEE';
      var space = this.canvasWidth / 12; // 每一大格代表的宽度(px)
      this.ctx.textAlign = 'center';
      var y = 20;
      this.timeList.forEach(function (text, index) {
        var x = _this2.beforeSpace + index * space;
        if (x < -_this2.canvasWidth / 12 || x > _this2.canvasWidth * 13 / 12) return;
        _this2.ctx.fillText(text, x, y);
        _this2.drawLine(x, y + 5, space / 5);
      });
    },
    drawLine: function drawLine(x, y, space) {
      var _this3 = this;

      // 画刻度
      [].concat(_toConsumableArray(Array(5))).forEach(function (_, index) {
        var X = x + index * space;
        _this3.ctx.beginPath();
        _this3.ctx.moveTo(X, y);
        _this3.ctx.lineTo(X, index ? y + 8 : y + 15);
        _this3.ctx.stroke();
      });
    },
    drawColorLine: function drawColorLine() {
      var _this4 = this;

      // 10px一条，中间隔20px,从50px位置开始, 画事件轴
      this.recordInfo.forEach(function (_ref, index) {
        var eventVideo = _ref.eventVideo,
            timedVideo = _ref.timedVideo,
            title = _ref.title;

        var y = 50 + (index - _this4.wheelIndex) * 30;
        if (index < _this4.wheelIndex) return;
        if (index > _this4.wheelIndex + 1) return;
        _this4.ctx.fillStyle = '#EEE';
        _this4.ctx.fillText(title, _this4.canvasWidth / 2, y + 23);

        timedVideo.forEach(function (_ref2) {
          var start = _ref2.start,
              end = _ref2.end;
          return _this4.time2Rect(start, end, y, _this4.timeLineColor, index);
        });
        eventVideo.forEach(function (_ref3) {
          var start = _ref3.start,
              end = _ref3.end;
          return _this4.time2Rect(start, end, y, _this4.eventLineColor, index);
        });
      });
    },
    position2time: function position2time(position) {
      return -position * this.scale;
    },
    time2Rect: function time2Rect(start, end, y, color, index) {
      // 画时间轴具体的画法
      var x = (start - this.time) / this.scale + this.canvasWidth / 2;
      var width = (end - start) / this.scale;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, width, 10);

      if (index === this.activeIndex) {
        this.ctx.strokeStyle = '#1fa0fe';
        this.ctx.rect(0, y - 2, this.canvasWidth, 14);
        this.ctx.stroke();
      }
    },
    drawScroll: function drawScroll() {
      var len = this.recordInfo.length;
      if (len < 3) return;
      var height = 2 / len * 60;
      var y = 50 + (60 - height) / (len - 2) * this.wheelIndex;
      this.ctx.fillStyle = '#EEE';
      this.ctx.fillRect(this.canvasWidth - 5, y, 3, height);
    },
    md: function md(e) {
      this.startPosition = e.clientX;
      this.canMove = true;
    },
    mm: function mm(e) {
      if (!this.canMove) return;
      var endPosition = e.clientX;
      var rangePosition = endPosition - this.startPosition;
      this.startPosition = endPosition;
      this.time += this.position2time(rangePosition); // 把位移转为时间
    },
    mu: function mu() {
      this.canMove = false;
    },
    ml: function ml() {
      this.canMove = false;
    },
    lineClick: function lineClick(e) {
      var y = e.offsetY;
      var oldIndex = this.activeIndex;
      if (y > 50 && y < 60) {
        this.activeIndex = this.wheelIndex;
      }
      if (y > 80 && y < 90) {
        this.activeIndex = this.wheelIndex + 1;
      }
      if (oldIndex !== this.activeIndex) {
        this.draw();
        this.$emit('activeLine', this.activeIndex);
      }
    }
  },
  mounted: function mounted() {
    this.init();
    document.querySelector('body').addEventListener('resize', this.resizeFn, false);
  },
  beforeDestory: function beforeDestory() {
    document.querySelector('body').removeEventListener('resize', this.resizeFn, false);
    this.resizeFn = null;
  }
};

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "timeline" } }, [
    _c("canvas", {
      ref: "line",
      staticClass: "line",
      on: {
        mouseleave: _vm.ml,
        mousedown: _vm.md,
        mouseup: _vm.mu,
        mousemove: _vm.mm,
        wheel: function($event) {
          $event.stopPropagation()
          _vm.scroll($event)
        },
        click: _vm.lineClick
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-a2844c9e", esExports)
  }
}

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_progressBar_vue__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_progressBar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_progressBar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dabba834_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_progressBar_vue__ = __webpack_require__(44);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(41)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-dabba834"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_progressBar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_dabba834_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_progressBar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\progressBar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dabba834", Component.options)
  } else {
    hotAPI.reload("data-v-dabba834", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("5877a731", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dabba834\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./progressBar.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-dabba834\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./progressBar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.bs-progress-bar[data-v-dabba834] {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  border-radius: 10px;\n}\n.bs-progress-bar .bs-bar[data-v-dabba834] {\n  height: 100%;\n  border-radius: 10px;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//

exports.default = {
  name: 'bs-progressbar',
  props: {
    value: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      time: this.value,
      outWidth: 0,
      canMove: false,
      changed: false,
      start: 0
    };
  },

  computed: {
    scale: function scale() {
      return this.max / this.outWidth;
    },
    innerWidth: function innerWidth() {
      return this.time / this.scale + 'px';
    }
  },
  watch: {
    value: function value(newValue) {
      this.time = newValue;
      this.$emit('on-input', newValue);
      this.changed = true;
    }
  },
  methods: {
    setTime: function setTime(clientX) {
      var x = clientX - this.start;
      x = x < 0 ? 0 : x > this.outWidth ? this.outWidth : x;
      this.time = x * this.scale;
      this.$emit('input', this.time);
      this.$emit('on-input', this.time);
    },
    md: function md(_ref) {
      var clientX = _ref.clientX;

      if (!this.disabled) {
        this.setTime(clientX);
        this.canMove = true;
      }
    },
    mm: function mm(_ref2) {
      var clientX = _ref2.clientX;

      if (!this.canMove) return;
      this.setTime(clientX);
    },
    mu: function mu() {
      this.canMove = false;
      this.$emit('mouseup', this.time);
      if (this.changed) {
        this.$emit('on-change', this.time);
        this.changed = false;
      }
    }
  },
  mounted: function mounted() {
    var _this = this;

    window.onresize = function () {
      _this.outWidth = _this.$el.offsetWidth;
      _this.start = _this.$el.getBoundingClientRect().left;
    };
    window.onresize();
    document.onmousemove = this.mm;
    document.onmouseup = this.mu;
  },
  beforeDestroy: function beforeDestroy() {
    window.onresize = null, document.onmousemove = null;
    document.onmouseup = null;
  }
};

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "bs-progress-bar", on: { mousedown: _vm.md } },
    [_c("div", { staticClass: "bs-bar", style: { width: _vm.innerWidth } })]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dabba834", esExports)
  }
}

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_calendar_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_calendar_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_calendar_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_424e3a2e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_calendar_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-424e3a2e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_calendar_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_424e3a2e_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_calendar_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\calendar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-424e3a2e", Component.options)
  } else {
    hotAPI.reload("data-v-424e3a2e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("67879b8c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-424e3a2e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./calendar.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-424e3a2e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./calendar.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.calendar[data-v-424e3a2e] {\n  color: #fff;\n  background-color: #0b90aa;\n  text-align: center;\n  user-select: none;\n  padding: 0 6px;\n}\n.calendar .highlight[data-v-424e3a2e] {\n  background-color: #fd367e;\n}\n.calendar .month-box[data-v-424e3a2e] {\n  height: 210px;\n  flex-wrap: wrap;\n  display: flex;\n  align-items: center;\n}\n.calendar .month-box .month-item[data-v-424e3a2e] {\n  width: 33%;\n  height: 25%;\n  line-height: 50px;\n  cursor: pointer;\n}\n.calendar .year-box[data-v-424e3a2e] {\n  height: 210px;\n  flex-wrap: wrap;\n  display: flex;\n  align-items: center;\n}\n.calendar .year-box .year-item[data-v-424e3a2e] {\n  width: 20%;\n  height: 20%;\n  line-height: 40px;\n  cursor: pointer;\n}\n.calendar .year-month-content[data-v-424e3a2e] {\n  height: 50px;\n  display: flex;\n  align-items: center;\n  line-height: 50px;\n}\n.calendar .year-month-content .arrow[data-v-424e3a2e] {\n  height: 100%;\n  width: 25%;\n  line-height: 44px;\n  font-size: 32px;\n  cursor: pointer;\n}\n.calendar .year-month-content .middle-content[data-v-424e3a2e] {\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  height: 100%;\n  width: 50%;\n}\n.calendar .year-month-content .middle-content .year[data-v-424e3a2e] {\n  width: 50%;\n  height: 100%;\n}\n.calendar .year-month-content .middle-content .month[data-v-424e3a2e] {\n  height: 100%;\n  width: 50%;\n}\n.calendar .week-day-content[data-v-424e3a2e] {\n  height: 210px;\n}\n.calendar .week-day-content .weeks[data-v-424e3a2e] {\n  height: 15%;\n  display: flex;\n  justify-content: space-between;\n}\n.calendar .week-day-content .weeks .week[data-v-424e3a2e] {\n  flex-grow: 1;\n  width: 14%;\n}\n.calendar .week-day-content .days[data-v-424e3a2e] {\n  height: 85%;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: center;\n}\n.calendar .week-day-content .days .day[data-v-424e3a2e] {\n  height: 16%;\n  flex-grow: 1;\n  width: 14%;\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n  line-height: 28px;\n}\n.calendar .week-day-content .days .day .text[data-v-424e3a2e] {\n  height: 100%;\n}\n.calendar .week-day-content .days .day .marke[data-v-424e3a2e] {\n  height: 4px;\n  width: 4px;\n  position: absolute;\n  bottom: 2px;\n  left: calc(47%);\n  border-radius: 50%;\n}\n.calendar .week-day-content .days .gray[data-v-424e3a2e] {\n  color: #999;\n}\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = __webpack_require__(49);

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

exports.default = {
  name: 'bs-calendar',
  props: {
    local: {
      type: String,
      default: 'zh-cn'
    },
    value: {
      type: Number,
      default: new Date().getTime()
    },
    theme: {
      type: Object,
      default: function _default() {
        return {
          mainColor: '#efefef',
          textColor: '#444',
          darkTextColor: '#999',
          highlightColor: '#4499f7',
          eventColor: '#da8204',
          timeColor: '#32e184'
        };
      }
    },
    marks: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      showWhat: 0,
      timestamp: this.value,
      oneDayLength: 24 * 60 * 60 * 1000
    };
  },
  created: function created() {
    _moment2.default.locale(this.local);
  },

  computed: {
    weeks: function weeks() {
      return _moment2.default.weekdaysShort();
    },
    months: function months() {
      return _moment2.default.monthsShort();
    },
    years: function years() {
      var _this = this;

      var last12 = [].concat(_toConsumableArray(new Array(12))).map(function (_, index) {
        return _this.year - index - 1;
      }).reverse();
      var next12 = [].concat(_toConsumableArray(new Array(12))).map(function (_, index) {
        return _this.year + index + 1;
      });
      return last12.concat([this.year]).concat(next12);
    },

    time: {
      get: function get() {
        return (0, _moment2.default)(this.timestamp);
      },
      set: function set(mn) {
        this.timestamp = parseInt(mn.format('x'));
      }
    },
    year: function year() {
      return this.time.get('year');
    },
    month: function month() {
      return this.months[this.time.get('month')];
    },
    day: function day() {
      return this.time.get('date');
    },
    days: function days() {
      // 最多6行 42天
      var toMonthDays = this.time.daysInMonth();
      var lastMonthDays = (0, _moment2.default)(this.time).subtract(1, 'M').daysInMonth();
      var nextMonthDays = (0, _moment2.default)(this.time).add(1, 'M').daysInMonth();
      var startWeek = (0, _moment2.default)(this.time).startOf('month').day();
      var endWeek = (0, _moment2.default)(this.time).endOf('month').day();
      return {
        last: [].concat(_toConsumableArray(new Array(startWeek))).map(function () {
          return lastMonthDays--;
        }).reverse(),
        now: [].concat(_toConsumableArray(new Array(toMonthDays))).map(function (_, index) {
          return ++index;
        }),
        next: [].concat(_toConsumableArray(new Array(42 - startWeek - toMonthDays))).map(function (_, index) {
          return ++index;
        })
      };
    }
  },
  watch: {
    value: function value(newTime) {
      this.timestamp = newTime;
    },
    timestamp: function timestamp(newTime) {
      this.$emit('input', newTime);
    }
  },
  methods: {
    checkMarked: function checkMarked(day) {
      var _this2 = this;

      var start = parseInt((0, _moment2.default)(this.year + '-' + (this.months.findIndex(function (item) {
        return item === _this2.month;
      }) + 1) + '-' + day).format('x'));
      var end = start + this.oneDayLength;
      var list = this.marks.filter(function (_ref) {
        var timestamp = _ref.timestamp;
        return timestamp >= start && timestamp <= end;
      });
      var evtList = list.filter(function (_ref2) {
        var type = _ref2.type;
        return type === 'event';
      });
      return list.length > 0 ? evtList.length > 0 ? [evtList[0]] : [list[0]] : [];
    },
    subtractMonth: function subtractMonth() {
      this.time = this.time.subtract(1, 'M');
    },
    addMonth: function addMonth() {
      this.time = this.time.add(1, 'M');
    },
    addYear: function addYear() {
      this.time = this.time.add(1, 'Y');
    },
    subtractYear: function subtractYear() {
      this.time = this.time.subtract(1, 'Y');
    },
    selectToMonthDay: function selectToMonthDay(date) {
      this.time = this.time.set('date', date);
    },
    selectLastMonthDay: function selectLastMonthDay(date) {
      this.time = this.time.subtract(1, 'M').set('date', date);
    },
    selectNextMonthDay: function selectNextMonthDay(date) {
      this.time = this.time.add(1, 'M').set('date', date);
    },
    selectMonth: function selectMonth(mString) {
      var m = this.months.findIndex(function (item) {
        return item === mString;
      });
      this.time = this.time.set('month', m);
      this.showWhat = 0;
    },
    selectYear: function selectYear(y) {
      this.time = this.time.set('year', y);
      this.showWhat = 0;
    }
  }

};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "calendar",
      style: {
        backgroundColor: _vm.theme.mainColor,
        color: _vm.theme.textColor
      }
    },
    [
      _c("div", { staticClass: "year-month-content" }, [
        _c(
          "div",
          { staticClass: "left-arrow arrow", on: { click: _vm.subtractYear } },
          [_vm._v("«")]
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "left-arrow arrow", on: { click: _vm.subtractMonth } },
          [_vm._v("‹")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "middle-content" }, [
          _c(
            "div",
            {
              staticClass: "year",
              on: {
                click: function($event) {
                  _vm.showWhat === 2 ? (_vm.showWhat = 0) : (_vm.showWhat = 2)
                }
              }
            },
            [_vm._v(_vm._s(_vm.year))]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "month",
              on: {
                click: function($event) {
                  _vm.showWhat === 1 ? (_vm.showWhat = 0) : (_vm.showWhat = 1)
                }
              }
            },
            [_vm._v(_vm._s(_vm.month))]
          )
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "right-arrow arrow", on: { click: _vm.addMonth } },
          [_vm._v("›")]
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "right-arrow arrow", on: { click: _vm.addYear } },
          [_vm._v("»")]
        )
      ]),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showWhat === 0,
              expression: "showWhat === 0"
            }
          ],
          staticClass: "week-day-content"
        },
        [
          _c(
            "div",
            { staticClass: "weeks" },
            _vm._l(_vm.weeks, function(week) {
              return _c("div", { key: week, staticClass: "week" }, [
                _vm._v(_vm._s(week))
              ])
            })
          ),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "days" },
            [
              _vm._l(_vm.days.last, function(date) {
                return _c(
                  "div",
                  {
                    key: "last" + date,
                    staticClass: "day gray",
                    style: { color: _vm.theme.darkeTextColor },
                    on: {
                      click: function($event) {
                        _vm.selectLastMonthDay(date)
                      }
                    }
                  },
                  [_vm._v(_vm._s(date))]
                )
              }),
              _vm._v(" "),
              _vm._l(_vm.days.now, function(date) {
                return _c(
                  "div",
                  {
                    key: "now" + date,
                    staticClass: "day",
                    class: { highlight: date == _vm.day },
                    style:
                      date == _vm.day
                        ? { backgroundColor: _vm.theme.highlightColor }
                        : {},
                    on: {
                      click: function($event) {
                        _vm.selectToMonthDay(date)
                      }
                    }
                  },
                  [
                    _c("div", { staticClass: "text" }, [_vm._v(_vm._s(date))]),
                    _vm._v(" "),
                    _vm._l(_vm.checkMarked(date), function(mark) {
                      return _c("div", {
                        key: mark.timestamp,
                        staticClass: "marke",
                        class: [mark.type],
                        style: { background: _vm.theme[mark.type + "Color"] },
                        attrs: { title: mark.title }
                      })
                    })
                  ],
                  2
                )
              }),
              _vm._v(" "),
              _vm._l(_vm.days.next, function(date) {
                return _c(
                  "div",
                  {
                    key: "next" + date,
                    staticClass: "day gray",
                    style: { color: _vm.theme.darkeTextColor },
                    on: {
                      click: function($event) {
                        _vm.selectNextMonthDay(date)
                      }
                    }
                  },
                  [_vm._v(_vm._s(date))]
                )
              })
            ],
            2
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showWhat === 1,
              expression: "showWhat === 1"
            }
          ],
          staticClass: "month-box"
        },
        _vm._l(_vm.months, function(m) {
          return _c(
            "div",
            {
              key: m,
              staticClass: "month-item",
              class: { highlight: _vm.month === m },
              style:
                _vm.month === m
                  ? { backgroundColor: _vm.theme.highlightColor }
                  : {},
              on: {
                click: function($event) {
                  _vm.selectMonth(m)
                }
              }
            },
            [_vm._v(_vm._s(m))]
          )
        })
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.showWhat === 2,
              expression: "showWhat === 2"
            }
          ],
          staticClass: "year-box"
        },
        _vm._l(_vm.years, function(y) {
          return _c(
            "div",
            {
              key: y,
              staticClass: "year-item",
              class: { highlight: _vm.year === y },
              style:
                _vm.year === y
                  ? { backgroundColor: _vm.theme.highlightColor }
                  : {},
              on: {
                click: function($event) {
                  _vm.selectYear(y)
                }
              }
            },
            [_vm._v(_vm._s(y))]
          )
        })
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-424e3a2e", esExports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_Tree_vue__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_Tree_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_Tree_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e8afe76_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_Tree_vue__ = __webpack_require__(56);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(52)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5e8afe76"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_Tree_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5e8afe76_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_Tree_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\VTree\\Tree.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5e8afe76", Component.options)
  } else {
    hotAPI.reload("data-v-5e8afe76", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("2ab7578c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5e8afe76\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Tree.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5e8afe76\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./Tree.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n*[data-v-5e8afe76] {\n  padding: 0;\n  margin: 0;\n  user-select: none;\n}\nul[data-v-5e8afe76],\nli[data-v-5e8afe76] {\n  list-style: none;\n}\n.tree[data-v-5e8afe76] {\n  width: 100%;\n  padding-left: 10px;\n  font-size: 14px;\n  line-height: 32px;\n}\n.tree .item[data-v-5e8afe76] {\n  cursor: pointer;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n/* .tree .trangle {\n  width: 0;\n  height: 0;\n  border: 8px solid transparent;\n  border-left-color: black;\n}\n\n.tree .trangle-up {\n  border-left-color: transparent;\n  border-top-color: black;\n  transform: translateY(25%);\n} */\n\n/* .tree .checked {\n  color: blue;\n} */\n.tree .searched[data-v-5e8afe76] {\n  color: blue;\n}\n.tree .item .item-left[data-v-5e8afe76] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n}\n.tree .item .item-right > *[data-v-5e8afe76] {\n  display: inline-block;\n}\n.check-box[data-v-5e8afe76] {\n  margin: 0 5px;\n}\n/* \n.check-yes .part {\n  width: 100%;\n  height: 50%;\n  background-color: #000;\n}\n\n.check-no .part {\n  width: 100%;\n  height: 0%;\n  background-color: #000;\n}\n\n.check-yes-no .part {\n  width: 100%;\n  height: 40%;\n  background-color: #000;\n} */\n\n/*以下是icon样式*/\n.triangle-bottom[data-v-5e8afe76] {\n  border-style: dashed;\n  border-color: transparent;\n  border-width: 8px;\n  width: 0;\n  height: 0;\n  overflow: hidden;\n  display: inline-block;\n  vertical-align: middle;\n  border-top: 8px solid #444;\n  border-bottom-width: 0;\n}\n.triangle-right[data-v-5e8afe76] {\n  border-style: dashed;\n  border-color: transparent;\n  border-width: 8px;\n  width: 0;\n  height: 0;\n  overflow: hidden;\n  display: inline-block;\n  vertical-align: middle;\n  border-left: 8px solid #444;\n  border-right-width: 0;\n}\n.checkbox[data-v-5e8afe76] {\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid #999;\n  border-radius: 2px;\n  background-color: #fff;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;\n}\n.checkbox[data-v-5e8afe76]:after {\n  content: \"\";\n  display: table;\n  width: 4px;\n  height: 8px;\n  position: absolute;\n  top: 1px;\n  left: 4px;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  transform: rotate(45deg) scale(0);\n  -webkit-transition: all 0.2s ease-in-out;\n  /* Safari 和 Chrome */\n  -moz-transition: all 0.2s ease-in-out;\n  /* Firefox 4 */\n  -o-transition: all 0.2s ease-in-out;\n  /* Opera */\n  transition: all 0.2s ease-in-out;\n}\n.checkbox[data-v-5e8afe76]:hover {\n  border-color: #2d8cf0;\n}\n.checkbox-active[data-v-5e8afe76] {\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid #dddee1;\n  border-radius: 2px;\n  background-color: #fff;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;\n  border-color: #2d8cf0;\n  background-color: #2d8cf0;\n}\n.checkbox-active[data-v-5e8afe76]:after {\n  content: \"\";\n  display: table;\n  width: 4px;\n  height: 8px;\n  position: absolute;\n  top: 1px;\n  left: 4px;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  transform: rotate(45deg) scale(0);\n  -webkit-transition: all 0.2s ease-in-out;\n  /* Safari 和 Chrome */\n  -moz-transition: all 0.2s ease-in-out;\n  /* Firefox 4 */\n  -o-transition: all 0.2s ease-in-out;\n  /* Opera */\n  transition: all 0.2s ease-in-out;\n}\n.checkbox-active[data-v-5e8afe76]:hover {\n  border-color: #2d8cf0;\n}\n.checkbox-active[data-v-5e8afe76]:after {\n  transform: rotate(45deg) scale(1);\n  -webkit-transition: all 0.2s ease-in-out;\n  /* Safari 和 Chrome */\n  -moz-transition: all 0.2s ease-in-out;\n  /* Firefox 4 */\n  -o-transition: all 0.2s ease-in-out;\n  /* Opera */\n  transition: all 0.2s ease-in-out;\n}\n.checkbox-half[data-v-5e8afe76] {\n  display: inline-block;\n  width: 14px;\n  height: 14px;\n  position: relative;\n  top: 0;\n  left: 0;\n  border: 1px solid #dddee1;\n  border-radius: 2px;\n  background-color: #fff;\n  cursor: pointer;\n  transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;\n  border-color: #2d8cf0;\n  background-color: #2d8cf0;\n}\n.checkbox-half[data-v-5e8afe76]:after {\n  content: \"\";\n  display: table;\n  width: 4px;\n  height: 8px;\n  position: absolute;\n  top: 1px;\n  left: 4px;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  transform: rotate(45deg) scale(0);\n  -webkit-transition: all 0.2s ease-in-out;\n  /* Safari 和 Chrome */\n  -moz-transition: all 0.2s ease-in-out;\n  /* Firefox 4 */\n  -o-transition: all 0.2s ease-in-out;\n  /* Opera */\n  transition: all 0.2s ease-in-out;\n}\n.checkbox-half[data-v-5e8afe76]:hover {\n  border-color: #2d8cf0;\n}\n.checkbox-half[data-v-5e8afe76]:after {\n  width: 8px;\n  height: 1px;\n  transform: scale(1);\n  left: 2px;\n  top: 5px;\n}\n", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var _renderFn = __webpack_require__(55);

var _renderFn2 = _interopRequireDefault(_renderFn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'bs-tree',
  components: { renderFn: _renderFn2.default },
  props: {
    treeData: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    renderTitle: {
      type: Function,
      default: function _default(h, ctx) {
        return h('div', {
          class: { 'searched': ctx.item.searched }
        }, ctx.item.title);
      }
    },
    renderBtn: {
      type: Function
    },
    isDrag: {
      type: Function,
      default: function _default() {
        return false;
      }
    }
  },
  data: function data() {
    return {
      checkedItem: this.value,
      mapNode: null
    };
  },

  watch: {
    value: function value(item) {
      this.checkedItem = item;
    },
    checkedItem: function checkedItem(newItem) {
      this.treeData.forEach(function (item) {
        if (item.id === newItem.id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      this.$emit('input', newItem);
    }
  },

  methods: {
    getChecked: function getChecked(_ref) {
      var hasHalf = _ref.hasHalf;

      return this.getCheckedArr(this.treeData, hasHalf);
    },
    getCheckedArr: function getCheckedArr(treeData, hasHalf) {
      var _this = this;

      var box = [];
      treeData.forEach(function (item) {
        if (item.checked === true || hasHalf && item.checked) box.push(item);
        box = box.concat(_this.getCheckedArr(item.children, hasHalf));
      });
      return box;
    },
    handlerClick: function handlerClick(item) {
      // if (this.multiple) { this.multipleClick(item) }
      return this.singleClick(item);
    },
    multipleClick: function multipleClick(item) {
      // 通知下一级，通知上一级
      this.loopSetChecke(item, !item.checked);
      this.$emit('handle-click');
    },
    loopSetChecke: function loopSetChecke(item, checke) {
      var _this2 = this;

      item.checked = checke;
      item.children ? item.children.forEach(function (item) {
        return _this2.loopSetChecke(item, checke);
      }) : '';
    },
    singleClick: function singleClick(item) {
      this.checkedItem = item;
      this.$emit('input', item);
    },
    revewState: function revewState(item) {
      if (!this.multiple) return this.$emit('handle-click');
      if (item.children) {
        var childLength = item.children.length;
        var checkedLength = item.children.filter(function (_ref2) {
          var checked = _ref2.checked;
          return checked === true;
        }).length;

        if (checkedLength === childLength) {
          item.checked = true;
          return this.$emit('handle-click');
        }

        var noCheckedLength = item.children.filter(function (_ref3) {
          var checked = _ref3.checked;
          return checked === false;
        }).length;

        if (noCheckedLength === childLength) {
          item.checked = false;
          return this.$emit('handle-click');
        }
        item.checked = 1;

        return this.$emit('handle-click');
      }
    },
    dblclickNode: function dblclickNode(node) {
      this.$emit('node-dblclick', node);
    },
    handleDragStart: function handleDragStart(item, e) {
      e.dataTransfer.setData('Text', JSON.stringify(item));
    },


    /*
     *@method get Nodes by options method
     *@param data nodes
     *@param opt the options that filter the node
     */
    getNodes: function getNodes(opt, data) {
      data = data || this.treeData;
      var res = [];
      for (var i in data) {
        var tmp = true;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.entries(opt)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _step$value = _slicedToArray(_step.value, 2),
                key = _step$value[0],
                value = _step$value[1];

            if (data[i][key] !== value) {
              tmp = false;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (tmp) res.push(data[i]);
        if (data[i].children && data[i].children.length) {
          res = res.concat(this.getNodes(opt, data[i].children));
        }
      }
      return res;
    },

    /*
     *@method get Node by id
     *@param id
     */
    getNode: function getNode(id) {
      var _this3 = this;

      if (!this.mapNode) {
        this.mapNode = new Map();
        var _traverseNodes = function _traverseNodes(root) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = root[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;

              _this3.mapNode.set(node._id, node);
              if (node.children && node.children.length > 0) _traverseNodes(node.children);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        };
        _traverseNodes(this.treeData);
      }
      return this.mapNode.get(id);
    },


    /*
     *@method filter nessary nodes methods
     *@param filter string or predicate expression
     *@param data current nodes
     */
    searchNodes: function searchNodes(filter, data) {
      data = data || this.treeData;
      for (var i in data) {
        var searched = filter ? data[i].title.indexOf(filter) > -1 : false;
        this.$set(data[i], 'searched', searched);
        this.$set(data[i], 'visible', false);
        this.$emit('toggleshow', data[i], filter ? searched : true);
        if (data[i].children && data[i].children.length) {
          this.searchNodes(filter, data[i].children);
        }
      }
    },
    addAttr: function addAttr(data, attr) {
      for (var i in data) {
        for (var j in attr) {
          this.$set(data[i], j, attr[j]);
        }
        if (data[i].children && data[i].children.length) {
          this.addAttr(data[i].children, attr);
        }
      }
    },
    addPid: function addPid(data) {
      var pid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      for (var i in data) {
        this.$set(data[i], 'pid', pid);
        if (data[i].children && data[i].children.length) {
          this.addPid(data[i].children, data[i].id);
        }
      }
    }
  },
  mounted: function mounted() {
    var _this4 = this;

    /*
     * @event monitor the node visible event
     */
    this.$on('toggleshow', function (node, isShow) {
      _this4.$set(node, 'visible', isShow);
      _this4.$set(node, 'open', isShow);
      var parent = _this4.getNodes({ id: node.pid }, _this4.treeData);
      if (isShow && parent.length) {
        _this4.$emit('toggleshow', parent[0], isShow);
      }
    });
  }
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'renderFn',
  functional: true,
  props: {
    render: Function,
    item: Object,
    index: Number
  },
  render: function render(h, ctx) {
    var params = {
      item: ctx.props.item,
      index: ctx.props.index
    };
    return ctx.props.render(h, params);
  }
};

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "tree" },
    _vm._l(_vm.treeData, function(item, index) {
      return _c(
        "div",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: item.visible,
              expression: "item.visible"
            }
          ],
          key: item.id
        },
        [
          _c(
            "div",
            {
              staticClass: "item",
              attrs: { draggable: _vm.isDrag(item) },
              on: {
                dblclick: function($event) {
                  _vm.dblclickNode(item)
                },
                dragstart: function($event) {
                  $event.stopPropagation()
                  _vm.handleDragStart(item, $event)
                }
              }
            },
            [
              _c(
                "div",
                {
                  staticClass: "item-left",
                  on: {
                    click: function($event) {
                      _vm.handlerClick(item)
                    }
                  }
                },
                [
                  item.children && item.children.length
                    ? _c("div", {
                        class: {
                          "triangle-bottom": item.open,
                          "triangle-right": !item.open
                        },
                        staticStyle: { "margin-right": "5px" },
                        on: {
                          click: function($event) {
                            $event.stopPropagation()
                            item.open = !item.open
                          }
                        }
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  !(item.children && item.children.length)
                    ? _c("div", {
                        staticStyle: { height: "100%", width: "15px" }
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.multiple
                    ? _c("div", {
                        class: {
                          "checkbox-active": item.checked === true,
                          "checkbox-half": item.checked === 1,
                          checkbox: item.checked === false,
                          "check-box ": true
                        },
                        on: {
                          click: function($event) {
                            $event.stopPropagation()
                            _vm.multipleClick(item)
                          }
                        }
                      })
                    : _vm._e(),
                  _vm._v(" "),
                  _c("renderFn", {
                    attrs: { item: item, index: index, render: _vm.renderTitle }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.renderBtn
                ? _c("renderFn", {
                    attrs: { item: item, index: index, render: _vm.renderBtn }
                  })
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          item.children && item.children.length
            ? _c("bs-tree", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: item.open,
                    expression: "item.open"
                  }
                ],
                attrs: {
                  treeData: item.children,
                  multiple: _vm.multiple,
                  renderTitle: _vm.renderTitle,
                  renderBtn: _vm.renderBtn,
                  isDrag: _vm.isDrag
                },
                on: {
                  "handle-click": function($event) {
                    _vm.revewState(item)
                  },
                  "node-dblclick": _vm.dblclickNode
                },
                model: {
                  value: _vm.checkedItem,
                  callback: function($$v) {
                    _vm.checkedItem = $$v
                  },
                  expression: "checkedItem"
                }
              })
            : _vm._e()
        ],
        1
      )
    })
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5e8afe76", esExports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_select_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_select_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_select_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37a34a28_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_select_vue__ = __webpack_require__(66);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(58)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_select_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_37a34a28_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_select_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\select.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-37a34a28", Component.options)
  } else {
    hotAPI.reload("data-v-37a34a28", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("fa9cb97c", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-37a34a28\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./select.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-37a34a28\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/less-loader/dist/cjs.js!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./select.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.bs-select {\n  position: relative;\n}\n.bs-select .hidden {\n  display: none;\n}\n.bs-select ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.bs-select li {\n  padding: 5px 12px;\n  height: 30px;\n  font-size: 12px;\n  line-height: 20px;\n  user-select: none;\n  box-sizing: border-box;\n  cursor: pointer;\n  color: #fff;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.bs-select li.selected {\n  background: rgba(70, 153, 249, 0.9);\n}\n.bs-select li:hover {\n  background: #657ca8;\n}\n.bs-select .fa {\n  position: absolute;\n  right: 10px;\n  font-size: 14px;\n  color: #fff;\n  top: 8px;\n}\n.bs-select input {\n  position: absolute;\n  top: -9999px;\n}\n.bs-slt-tog {\n  border: 1px solid #5676a9;\n  border-radius: 3px;\n  font-size: 12px;\n  padding: 5px 12px;\n  color: #fff;\n  cursor: pointer;\n  user-select: none;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.bs-slt-tog.open,\n.bs-slt-tog:hover {\n  border-color: #6badfa;\n}\n.bs-slt-drp {\n  border: 1px solid #6badfa;\n  position: absolute;\n  z-index: 9;\n  border-radius: 3px;\n  background: #1c3053;\n  margin: 5px 0;\n  width: 100%;\n}\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scrollForSelect = __webpack_require__(61);

var _scrollForSelect2 = _interopRequireDefault(_scrollForSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'bs-select',
  components: { bsscroll: _scrollForSelect2.default },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      required: true
    },
    scrollNum: {
      type: Number,
      default: 4
    },
    scrollOptions: {
      default: null
    }
  },
  data: function data() {
    return {
      isOpen: false,
      isFirst: true
    };
  },

  computed: {
    hasScroll: function hasScroll() {
      return this.options.length > this.scrollNum;
    }
  },
  watch: {
    isOpen: function isOpen(o) {
      if (o) {
        this.initScoll();
      }
    },
    options: function options() {
      this.isFirst = true;
    }
  },
  methods: {
    clickItem: function clickItem(item) {
      this.$emit('input', item.value);
      this.isOpen = false;
    },
    getSelectedItem: function getSelectedItem() {
      var _this = this;

      var res = this.options.filter(function (item) {
        return item.value === _this.value;
      });
      return res.length ? res[0] : {};
    },
    getSelectedIndex: function getSelectedIndex() {
      var _this2 = this;

      var index = -1;
      this.options.forEach(function (item, i) {
        if (item.value === _this2.value) {
          index = i;
        }
      });
      return index;
    },
    getLabel: function getLabel(value) {
      var i = this.getSelectedItem();
      return i.label === undefined ? '请选择' : i.label;
    },
    open: function open() {
      this.isOpen = true;
    },
    close: function close() {
      var _this3 = this;

      setTimeout(function () {
        if (_this3.prevent) {
          _this3.prevent = false;
          _this3.focus();
        } else {
          _this3.isOpen = false;
        }
      }, 100);
    },
    cancelClose: function cancelClose() {
      this.prevent = true;
    },
    focus: function focus() {
      this.$refs.input.focus();
    },
    f: function f() {
      this.isOpen ? '' : this.focus();
    },
    initScoll: function initScoll() {
      var _this4 = this;

      var i = this.getSelectedIndex();
      if (this.hasScroll) {
        this.$nextTick(function () {
          if (_this4.isFirst) {
            _this4.isFirst = false;
            _this4.$refs.scroller.update();
          }
          if (i !== -1) {
            _this4.$refs.scroller.setScrollTop(i * 30);
          }
        });
      }
    }
  },
  mounted: function mounted() {
    this.ff = this.focus.bind(this);
  },
  beforeDestroy: function beforeDestroy() {
    document.removeEventListener('mouseup', this.ff);
    delete this.ff;
  }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollForSelect_vue__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollForSelect_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollForSelect_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_64eb7339_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scrollForSelect_vue__ = __webpack_require__(65);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(62)
}
var normalizeComponent = __webpack_require__(1)
/* script */

/* template */

/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_bustCache_scrollForSelect_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_64eb7339_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_bustCache_scrollForSelect_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\components\\scroll\\scrollForSelect.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-64eb7339", Component.options)
  } else {
    hotAPI.reload("data-v-64eb7339", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("279f4f72", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-64eb7339\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./scrollForSelect.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-64eb7339\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./scrollForSelect.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.scrollbar {\r\n  user-select: none;\r\n  -moz-user-select: none;\r\n  -webkit-user-select: none;\r\n  -ms-user-select: none;\n}\r\n", ""]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _scrollBar = __webpack_require__(5);

var _scrollBar2 = _interopRequireDefault(_scrollBar);

var _lodash = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//

// 多写一层是由于updated触发问题
exports.default = {
  name: 'bs-scroll',
  components: { scrollBar: _scrollBar2.default },
  props: {
    height: {
      default: '100%',
      type: String
    },
    option: {
      type: Object
    },
    wheelSpeed: {
      type: Number,
      default: 40
    }
  },
  methods: {
    updateScroll: function updateScroll(t) {
      this.$refs.sb.updateScroll(t);
    },
    update: function update() {
      var _this = this;

      this.$nextTick(function () {
        var t = _this.getScrollTop();
        _this.updateScroll();
        var conHeight = _this.$el.offsetHeight;
        if (_this.$overview) {
          var viewHeight = _this.$overview.offsetHeight;
          if (viewHeight > conHeight) {
            _this.setScrollTop(t);
          }
        }
      });
    },
    setScrollTop: function setScrollTop(t) {
      if (t < 0) {
        t = 0;
      } else if (this.$overview) {
        var conHeight = this.$el.offsetHeight;
        var viewHeight = this.$overview.offsetHeight;
        if (t > viewHeight - conHeight) {
          t = viewHeight - conHeight;
        }
      }
      this.updateScroll(t);
    },
    getScrollTop: function getScrollTop() {
      if (this.$overview) {
        var top = this.$overview.style.top || '0';
        return Math.abs(parseInt(top));
      } else {
        return 0;
      }
    },
    emitMove: function emitMove() {
      if (this.emove) {
        this.emove();
      }
    },
    _emove: function _emove() {
      this.$emit('on-scroll');
      var top = this.getScrollTop();
      if (top === 0) {
        this.$emit('scroll-top');
      } else if (this.$overview) {
        var conHeight = this.$el.offsetHeight;
        var viewHeight = this.$overview.offsetHeight;
        if (top + conHeight === viewHeight) {
          this.$emit('scroll-bottom');
        }
      }
    }
  },
  created: function created() {
    this.emove = (0, _lodash.debounce)(this._emove.bind(this), 200);
  },
  mounted: function mounted() {
    this.update();
    this.$overview = this.$el.querySelector(".overview");
  },
  beforeDestroy: function beforeDestroy() {
    delete this.emove;
    delete this.$overview;
  }
};

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "scrollBar",
    {
      ref: "sb",
      staticClass: "bs-scroll",
      style: { height: _vm.height },
      attrs: { option: _vm.option, wheelSpeed: _vm.wheelSpeed },
      on: {
        move: function($event) {
          $event.stopPropagation()
          _vm.emitMove($event)
        }
      }
    },
    [_vm._t("default")],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-64eb7339", esExports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "bs-select" },
    [
      _c(
        "div",
        {
          staticClass: "bs-slt-tog",
          class: { open: _vm.isOpen },
          on: { click: _vm.f }
        },
        [
          _c("input", {
            ref: "input",
            attrs: { type: "text" },
            on: { blur: _vm.close, focus: _vm.open }
          }),
          _vm._v(" " + _vm._s(_vm.getLabel(_vm.value)) + "\n    "),
          _c("i", {
            staticClass: "fa",
            class: [_vm.isOpen ? "fa-caret-up" : "fa-caret-down"]
          })
        ]
      ),
      _vm._v(" "),
      _c(
        "bs-cover",
        {
          staticClass: "bs-slt-drp",
          class: { hidden: !_vm.isOpen },
          model: {
            value: _vm.isOpen,
            callback: function($$v) {
              _vm.isOpen = $$v
            },
            expression: "isOpen"
          }
        },
        [
          _vm.hasScroll
            ? _c(
                "bsscroll",
                {
                  ref: "scroller",
                  attrs: {
                    height: _vm.scrollNum * 30 + "px",
                    option: _vm.scrollOptions
                  },
                  nativeOn: {
                    mousedown: function($event) {
                      _vm.cancelClose($event)
                    }
                  }
                },
                [
                  _c(
                    "ul",
                    _vm._l(_vm.options, function(item, i) {
                      return _c(
                        "li",
                        {
                          key: i,
                          staticClass: "bs-slt-item",
                          class: { selected: item.value === _vm.value },
                          on: {
                            mousedown: function($event) {
                              $event.stopPropagation()
                              _vm.clickItem(item)
                            }
                          }
                        },
                        [_vm._v(_vm._s(item.label))]
                      )
                    })
                  )
                ]
              )
            : _c(
                "ul",
                _vm._l(_vm.options, function(item, i) {
                  return _c(
                    "li",
                    {
                      key: i,
                      staticClass: "bs-slt-item",
                      class: { selected: item.value === _vm.value },
                      on: {
                        mousedown: function($event) {
                          _vm.clickItem(item)
                        }
                      }
                    },
                    [_vm._v(_vm._s(item.label))]
                  )
                })
              )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-37a34a28", esExports)
  }
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFinishDownload = exports.closeDownload = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _common = __webpack_require__(3);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stop = function stop(p) {
  return p.CloseRecordPlay();
};
var open = function open(p, _ref) {
  var startTime = _ref.startTime,
      endTime = _ref.endTime,
      strmInfo = _ref.strmInfo,
      dsIp = _ref.dsIp,
      dsPort = _ref.dsPort;

  var obj = {
    eventList: {
      timeInfo: {
        startTime: startTime,
        endTime: endTime
      },
      strmInfo: strmInfo
    }
  };
  var pa = JSON.stringify({
    ip: dsIp,
    port: '9000',
    beginTime: startTime + '',
    endTime: endTime + '',
    cmdStr: JSON.stringify({
      params: {
        jsonrpc: '2.0',
        id: '1',
        method: 'brest',
        call: 'AV.Record.playopen',
        args: obj
      }
    })
  });
  return p.OpenRecordPlayerEx(pa);
};
var pause = function pause(p) {
  return p.StopRecordPlay();
};
var resume = function resume(p) {
  return p.StartRecordPlay();
};
var getRecordTime = function getRecordTime(p) {
  var r = JSON.parse(p.GetRecordPlayerTime());
  return r.success ? { start: r.msBegin, end: r.msEnd } : { start: 0, end: 0 };
};
var getCurTime = function getCurTime(p) {
  var r = JSON.parse(p.GetRecordPlayerCurTime());
  return r.success ? r.msCur : -1;
};
var setPlayerRate = function setPlayerRate(p, rate) {
  if (rate < 1) {
    return p.SetRecordPlayerRate(1, 1 / rate);
  } else {
    return p.SetRecordPlayerRate(rate, 1);
  }
};
var setPlayerMode = function setPlayerMode(p, mode) {
  return p.SetRecordPlayerMode(mode);
};
var download = function download(p, _ref2) {
  var startTime = _ref2.startTime,
      endTime = _ref2.endTime,
      strmInfo = _ref2.strmInfo,
      dsIp = _ref2.dsIp,
      path = _ref2.path;
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var cmd = {
    eventList: {
      timeInfo: {
        startTime: startTime,
        endTime: endTime
      },
      strmInfo: strmInfo
    }
  };
  var param = JSON.stringify({
    ip: dsIp,
    port: '9000',
    fileName: path,
    beginTime: startTime,
    endTime: endTime,
    cmdStr: JSON.stringify({
      params: {
        jsonrpc: '2.0',
        id: '1',
        method: 'brest',
        call: 'AV.Record.playopen',
        args: cmd
      }
    })
  });
  var r = JSON.parse(p.OpenRecordDump(param));
  if (r.success) {
    p.SetRecordDumpNotifyCallback(r.DumpHandle, function (index, DumpHandle, status) {
      closeDownload(p, DumpHandle);
      callback(DumpHandle);
    });
    return r.DumpHandle;
  } else {
    return -1;
  }
};
var closeDownload = exports.closeDownload = function closeDownload(p, DumpHandle) {
  return p.CloseRecordDump(DumpHandle);
};
var isFinishDownload = exports.isFinishDownload = function isFinishDownload(p, DumpHandle) {
  var r = JSON.parse(p.GetRecordDumpIsEnd(DumpHandle));
  return r.success ? r.bIsEnd : -1;
};
exports.default = _extends({}, _common2.default, {
  stop: stop,
  open: open,
  pause: pause,
  resume: resume,
  getRecordTime: getRecordTime,
  getCurTime: getCurTime,
  setPlayerRate: setPlayerRate,
  setPlayerMode: setPlayerMode,
  download: download,
  closeDownload: closeDownload,
  isFinishDownload: isFinishDownload
});

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closeSpeech = exports.stopSpeech = exports.startSpeech = exports.openSpeech = exports.startRecording = exports.stopRecording = exports.isRecording = exports.stop = exports.open = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _common = __webpack_require__(3);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var open = exports.open = function open(p, _ref) {
  var streamType = _ref.streamType,
      vendor = _ref.vendor,
      ip = _ref.ip,
      port = _ref.port,
      channel = _ref.channel,
      tsPort = _ref.tsPort,
      tsIp = _ref.tsIp;

  var cmd = {
    streamType: streamType,
    vendor: vendor,
    session: '',
    ip: ip,
    port: port,
    channel: channel
  };
  var param = JSON.stringify({
    port: tsPort + '',
    ip: tsIp,
    cmdStr: JSON.stringify(cmd)
  });
  return p.OpenRealStreamEx(param);
};
var stop = exports.stop = function stop(p) {
  return p.CloseRealStream();
};
var isRecording = exports.isRecording = function isRecording(p) {
  var r = JSON.parse(p.RealIsSaving());
  return r.success ? r.bIsSaving : false;
};
var stopRecording = exports.stopRecording = function stopRecording(p) {
  return p.CloseRealSaveAs();
};
var startRecording = exports.startRecording = function startRecording(p, _ref2) {
  var path = _ref2.path,
      type = _ref2.type;

  return p.RealStartSaveAs(path, type, 0);
};
var openSpeech = exports.openSpeech = function openSpeech(p, _ref3) {
  var ip = _ref3.ip,
      port = _ref3.port,
      streamType = _ref3.streamType,
      vendor = _ref3.vendor,
      channel = _ref3.channel,
      tsIp = _ref3.tsIp,
      tsPort = _ref3.tsPort;

  return p.OpenSpeechEx(JSON.stringify({
    ip: tsIp,
    port: tsPort + '',
    cmdStr: JSON.stringify({
      streamType: streamType,
      vendor: vendor,
      session: '',
      ip: ip,
      port: port,
      channel: channel
    })
  }));
};
var startSpeech = exports.startSpeech = function startSpeech(p) {
  return p.StartSpeech(false);
};
var stopSpeech = exports.stopSpeech = function stopSpeech(p) {
  return p.StopSpeech();
};
var closeSpeech = exports.closeSpeech = function closeSpeech(p) {
  return p.CloseSpeech();
};
exports.default = _extends({}, _common2.default, {
  open: open,
  stop: stop,
  isRecording: isRecording,
  stopRecording: stopRecording,
  startRecording: startRecording,
  openSpeech: openSpeech,
  startSpeech: startSpeech,
  stopSpeech: stopSpeech,
  closeSpeech: closeSpeech
});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurTime = exports.getFileTime = exports.pause = exports.resume = exports.stop = exports.open = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _common = __webpack_require__(3);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var open = exports.open = function open(plugin, path) {
  return plugin.OpenLocalPlayer(path, false);
};
var stop = exports.stop = function stop(plugin) {
  return plugin.CloseLocalPlay();
};
var resume = exports.resume = function resume(plugin) {
  return plugin.StartLocalPlay();
};
var pause = exports.pause = function pause(plugin) {
  return plugin.StopLocalPlay();
};
var getFileTime = exports.getFileTime = function getFileTime(p) {
  var r = JSON.parse(p.GetLocalPlayTime());
  return r.success ? { start: r.msBegin, end: r.msEnd } : { start: 0, end: 0 };
};
var getCurTime = exports.getCurTime = function getCurTime(p) {
  var r = JSON.parse(p.GetLocalPlayCurTime());
  console.log(r);
  return r.success ? r.msCur : -1;
};
exports.default = _extends({}, _common2.default, {
  open: open,
  stop: stop,
  resume: resume,
  pause: pause,
  getFileTime: getFileTime,
  getCurTime: getCurTime
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(71);

exports.default = {
  name: 'bs-disable',
  bind: function bind(el, _ref, vnode) {
    var value = _ref.value;

    if (value) {
      add(el);
    } else {
      remove(el);
    }
  },
  componentUpdated: function componentUpdated(el, _ref2) {
    var value = _ref2.value;

    if (value) {
      add(el);
    } else {
      remove(el);
    }
  }
};


function add(el) {
  el.classList.add('bs-disabled');
  var tagName = el.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'a' || tagName === 'textarea') {
    el.setAttribute('disabled', '');
  }
}

function remove(el) {
  el.classList.remove('bs-disabled');
  var tagName = el.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'a' || tagName === 'textarea') {
    el.removeAttribute('disabled');
  }
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(72);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(6)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./disable.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./disable.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".bs-disabled {\r\n  pointer-events: none;\r\n}", ""]);

// exports


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = require("font-awesome/css/font-awesome.min.css");

/***/ })
/******/ ]);