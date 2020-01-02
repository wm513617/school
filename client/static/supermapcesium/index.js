(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SuperMapCesium"] = factory();
	else
		root["SuperMapCesium"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
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
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ClampMode = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * 绘制时的贴地模式
   * @author 胡红勋
   * @since 2018-07-05
   **/
  var groundType = {
    GROUND: 'ground', // 贴地模式
    ENTITY: 'entity', // 贴对象模式
    SPACE: 'space' // 空间模式
  };
  exports.groundType = groundType;
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.GeometryType = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   * 几何类型
   * @author 胡红勋
   * @since 2017-12-21
   **/
  var GeometryType = {
    MARKER: 'marker',
    POINT: 'Point', // 点
    POLYLINE: 'LineString', // 线
    LINEARRING: 'LinearRing',
    POLYGON: 'Polygon', // 面
    MULTIPOINT: 'MultiPoint', // 多点
    MULTIPOLYLINE: 'MultiLineString', // 多线
    MULTIPOLYGON: 'MultiPolygon', // 多面
    CIRCLE: 'Circle' // 多面
  };
  exports.GeometryType = GeometryType;
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.MeasureMode = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   *量算的模式
   * @author 胡红勋
   * @since 2018-07-05
   **/
  var MeasureMode = {
    AREA: 'area', // 量算面积
    DISTANCE: 'distance', // 量算距离
    HEIGHT: 'height' // 量算高度
  };
  exports.MeasureMode = MeasureMode;
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(20)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./pretty.css'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.pretty);
    global.tooltip = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = createTooltip;
  function createTooltip(frameDiv) {
    var ToolTip = function ToolTip(frameDiv) {
      var div = document.createElement('div');
      div.className = 'twipsy right';
      var arrow = document.createElement('div');
      arrow.className = 'twipsy-arrow';
      div.appendChild(arrow);
      var title = document.createElement('div');
      title.className = 'twipsy-inner';
      div.appendChild(title);
      this._div = div;
      this._title = title;
      this.message = '';
      frameDiv.appendChild(div);
      var that = this;
      div.onmousemove = function (evt) {
        that.showAt({ x: evt.clientX, y: evt.clientY }, that.message);
      };
    };
    ToolTip.prototype.setVisible = function (visible) {
      this._div.style.display = visible ? 'block' : 'none';
    };
    ToolTip.prototype.showAt = function (position, message) {
      if (position && message) {
        this.setVisible(true);
        this._title.innerHTML = message;
        this._div.style.left = position.x + 10 + 'px';
        this._div.style.top = position.y - this._div.clientHeight / 2 + 'px';
        this.message = message;
      }
    };
    return new ToolTip(frameDiv);
  } /**
     *胡红勋 2018-07-05 绘制时的提示类方法
     * @param {*} frameDiv
     */
  module.exports = exports['default'];
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.common = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  /**
   *胡红勋 2018-07-05 织入给组件的公共方法----
   * @param {*}
   */
  var getParent = function getParent($component) {
    return $component.abstract || $component.$el === $component.$children[0].$el ? getParent($component.$parent) : $component;
  };
  exports.default = {
    methods: {
      ready: function ready() {
        this.$parent = getParent(this.$parent);
        this.Cesium = this.$parent.Cesium;
        this.viewer = this.$parent.viewer;
        this.load();
      },
      transmitEvent: function transmitEvent(e) {
        this.$emit(e.type.replace(/^on/, ''), e);
      },
      reload: function reload() {
        this.load();
      }
    },
    mounted: function mounted() {
      this.$parent = getParent(this.$parent);
      var viewer = this.$parent.viewer;
      var ready = this.ready;

      viewer ? ready() : this.$parent.$on('ready', ready);
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(14),
  /* template */
  null,
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\vue-supermap-cesium-master\\components\\viewer\\Draw.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d35b8c02", Component.options)
  } else {
    hotAPI.reload("data-v-d35b8c02", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(15),
  /* template */
  null,
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\vue-supermap-cesium-master\\components\\viewer\\Measure.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38b7741a", Component.options)
  } else {
    hotAPI.reload("data-v-38b7741a", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(16),
  /* template */
  __webpack_require__(21),
  /* scopeId */
  null,
  /* cssModules */
  null
)
Component.options.__file = "D:\\vue-supermap-cesium-master\\components\\viewer\\viewer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key !== "__esModule"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] viewer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70ba6226", Component.options)
  } else {
    hotAPI.reload("data-v-70ba6226", Component.options)
  }
})()}

module.exports = Component.exports


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = {"name":"bstar-vue-supermap","version":"1.1.4","description":"SuperMap iClient 3D for WebGL(built on Cesium) Component for Vue 2.0","main":"index.js","scripts":{"build:docs":"webpack -p --config ./build/webpack.docs.config.js","build":"webpack --config ./build/webpack.prod.config.js","dev":"webpack-dev-server --content-base docs --config ./build/webpack.docs.config.js --hot --inline","deploy":"npm run build && npm run build:docs","test":"echo \"Error: no test specified\" && exit 1","lint":"eslint --ext .js,.vue src docs build"},"keywords":["Vue","Cesium","SuperMap","WebGL"],"author":"huhongxun","license":"MIT","devDependencies":{"babel-core":"^6.26.0","babel-eslint":"^7.2.3","babel-loader":"^6.2.10","babel-plugin-add-module-exports":"^0.2.1","babel-plugin-module-alias":"^1.6.0","babel-plugin-syntax-dynamic-import":"^6.18.0","babel-plugin-transform-es2015-modules-umd":"^6.24.0","babel-preset-es2015":"^6.18.0","bmaplib.distancetool":"^1.0.2","bulma":"^0.3.0","chai":"^4.0.2","css-loader":"^0.26.1","eslint":"^3.19.0","eslint-config-standard":"^10.2.1","eslint-loader":"^1.7.1","eslint-plugin-html":"^2.0.1","eslint-plugin-import":"^2.2.0","eslint-plugin-node":"^4.2.2","eslint-plugin-promise":"^3.5.0","eslint-plugin-standard":"^3.0.1","file-loader":"^0.10.0","github-markdown-css":"^2.4.1","html-webpack-plugin":"^2.26.0","inline-manifest-webpack-plugin":"^3.0.1","karma":"^1.7.0","karma-chrome-launcher":"^2.1.1","karma-coverage":"^1.1.1","karma-mocha":"^1.3.0","karma-webpack":"^2.0.3","material-design-icons":"^3.0.1","mocha":"^3.4.2","prismjs":"^1.6.0","pug":"^2.0.0-beta6","requirejs":"^2.3.3","rmdir":"^1.2.0","roboto-fontface":"^0.7.0","style-loader":"^0.13.1","stylus":"^0.54.5","stylus-loader":"^3.0.1","url-loader":"^0.5.7","vue":"^2.4.3","vue-loader":"^10.0.2","vue-markdown-loader":"^0.6.2","vue-material":"^0.7.4","vue-router":"^2.7.0","vue-template-compiler":"^2.1.8","webpack":"^2.4.1","webpack-dev-server":"^2.4.4"},"peerDependencies":{"vue":"^2.1.8"},"dependencies":{"markdown-it":"^8.4.0"}}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(11), __webpack_require__(12)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./events.js'), require('./util.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.events, global.util);
    global.bindEvent = mod.exports;
  }
})(this, function (module, exports, _events, _util) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (instance, eventList) {
    var _this = this;

    var ev = eventList || _events2.default[(0, _util.toKebabCase)(this.$options._componentTag)];
    ev && ev.forEach(function (event) {
      var hasOn = event.slice(0, 2) === 'on';
      instance[event].addEventListener(function (arg) {
        _this.$emit(hasOn ? event.slice(2) : event, arg);
      });
      // instance[event].addEventListener(
      //   (function (me) {
      //     return function (e) {
      //       console.log(this, me)
      //       me.$emit(hasOn ? event.slice(2) : event, e)
      //     }
      //   }
      //   )(this))
    });
  };

  var _events2 = _interopRequireDefault(_events);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.events = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    'sm-viewer': ['selectedEntityChanged', 'trackedEntityChanged'],
    'sm-cesiumWidget': ['morphComplete', 'morphStart', 'postRender', 'preRender', 'preUpdate', 'renderError', 'terrainProviderChanged']
  };
  module.exports = exports['default'];
});

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.util = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var checkType = exports.checkType = function checkType(val) {
    return Object.prototype.toString.call(val).slice(8, -1);
  };
  var toKebabCase = exports.toKebabCase = function toKebabCase(str) {
    return str.replace(/[A-Z]/g, function (letter) {
      return '-' + letter.toLowerCase();
    }).replace(/^-/, '');
  };
  var getDocumentByClassName = exports.getDocumentByClassName = function getDocumentByClassName(htmlCollection, className) {
    var temp = void 0;
    var BreakException = {};
    try {
      Array.prototype.slice.call(htmlCollection).forEach(function (element) {
        if (element.className === className) {
          temp = element;
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return temp;
  };
});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(9), __webpack_require__(8), __webpack_require__(6), __webpack_require__(7), __webpack_require__(2), __webpack_require__(3), __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../package.json'), require('./viewer/viewer.vue'), require('./viewer/Draw.vue'), require('./viewer/Measure.vue'), require('./base/GeometryType'), require('./base/MeasureMode'), require('./base/ClampMode'), require('./base/tooltip'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._package, global.viewer, global.Draw, global.Measure, global.GeometryType, global.MeasureMode, global.ClampMode, global.tooltip);
    global.index = mod.exports;
  }
})(this, function (exports, _package, _viewer, _Draw, _Measure, _GeometryType, _MeasureMode, _ClampMode, _tooltip) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createTooltip = exports.groundType = exports.MeasureMode = exports.GeometryType = exports.SmMeasure = exports.SmDraw = exports.SmViewer = undefined;

  var _viewer2 = _interopRequireDefault(_viewer);

  var _Draw2 = _interopRequireDefault(_Draw);

  var _Measure2 = _interopRequireDefault(_Measure);

  var _tooltip2 = _interopRequireDefault(_tooltip);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    install: function install(Vue) {
      Vue.component('sm-viewer', _viewer2.default); // 注册全局容器地图组件
      Vue.component('sm-draw', _Draw2.default); // 注册全局绘制组件
      Vue.component('sm-measure', _Measure2.default); // 注册全局测量组件
    },
    version: _package.version // 组件库版本------
  };
  exports.SmViewer = _viewer2.default;
  exports.SmDraw = _Draw2.default;
  exports.SmMeasure = _Measure2.default;
  exports.GeometryType = _GeometryType.GeometryType;
  exports.MeasureMode = _MeasureMode.MeasureMode;
  exports.groundType = _ClampMode.groundType;
  exports.createTooltip = _tooltip2.default;
});

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(5), __webpack_require__(2), __webpack_require__(1), __webpack_require__(4)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../base/mixins/common.js'), require('../base/GeometryType.js'), require('../base/ClampMode.js'), require('../base/tooltip.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.common, global.GeometryType, global.ClampMode, global.tooltip);
    global.Draw = mod.exports;
  }
})(this, function (module, exports, _common, _GeometryType, _ClampMode, _tooltip) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _common2 = _interopRequireDefault(_common);

  var _tooltip2 = _interopRequireDefault(_tooltip);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    name: 'bs-draw',
    render: function render() {},

    mixins: [_common2.default],
    props: {
      actived: {
        type: Boolean,
        default: true
      },
      type: {
        type: String
      },
      clampMode: {
        type: String
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        originInstance: null
      };
    },

    watch: {
      actived: function actived(flag) {
        if (flag) {
          this.originInstance.activate();
        } else {
          this.originInstance.deactivate();
        }
      },
      type: function type(mode) {
        this.originInstance.deactivate();
        this.reload();
      },
      clampMode: function clampMode(mode) {
        this.originInstance.deactivate();
        this.reload();
      },
      isClear: function isClear(flag) {
        if (flag) {
          this.originInstance.clear();
          this.$emit('update:isClear', false);
        }
      }
    },
    methods: {
      load: function load() {
        var _this = this;

        var Cesium = this.Cesium,
            viewer = this.viewer,
            actived = this.actived,
            type = this.type,
            clampMode = this.clampMode,
            $parent = this.$parent;

        var tooltip = (0, _tooltip2.default)($parent.$el);
        var drawMode = Cesium.DrawMode.Point;
        var tips = '<p>点击地图绘制点或者地标</p>';
        if (type === _GeometryType.GeometryType.MARKER) {
          drawMode = Cesium.DrawMode.Marker;
        }
        if (type === _GeometryType.GeometryType.POLYLINE) {
          drawMode = Cesium.DrawMode.Line;
          tips = '<p>左键点击确定折线中间点</p><p>右键单击结束绘制</p>';
        }
        if (type === _GeometryType.GeometryType.POLYGON) {
          drawMode = Cesium.DrawMode.Polygon;
          tips = '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>';
        }
        var mode = Cesium.ClampMode.Space;
        if (clampMode === _ClampMode.groundType.GROUND) {
          mode = Cesium.ClampMode.Ground;
        }
        if (clampMode === _ClampMode.groundType.ENTITY) {
          mode = Cesium.ClampMode.S3mModel;
        }
        this.originInstance = new Cesium.DrawHandler(viewer, drawMode, mode);
        if (actived) {
          this.originInstance.activate();
        } else {
          this.originInstance.deactivate();
        }
        this.originInstance.activeEvt.addEventListener(function (isActive) {
          _this.$emit('active', { isActive: isActive });
        });
        this.originInstance.movingEvt.addEventListener(function (windowPosition) {
          _this.$emit('move', { postiton: windowPosition });
          if (drawMode === Cesium.DrawMode.Marker || drawMode === Cesium.DrawMode.Point) {
            tooltip.showAt(windowPosition, tips);
          } else {
            if (_this.originInstance.isDrawing) {
              tooltip.showAt(windowPosition, tips);
            } else {
              tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>');
            }
          }
        });
        this.originInstance.drawEvt.addEventListener(function (result) {
          tooltip.setVisible(false);
          _this.$emit('drawend', { result: result });
        });
      }
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(5), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../base/mixins/common.js'), require('../base/MeasureMode.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.common, global.MeasureMode);
    global.Measure = mod.exports;
  }
})(this, function (module, exports, _common, _MeasureMode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _common2 = _interopRequireDefault(_common);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    name: 'bs-measure',
    render: function render() {},

    mixins: [_common2.default],
    props: {
      actived: {
        type: Boolean,
        default: true
      },
      measureMode: {
        type: String
      },
      clampMode: {
        type: Number,
        default: 0
      },
      isClear: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        originInstance: null
      };
    },

    watch: {
      actived: function actived(flag) {
        if (flag) {
          this.originInstance.activate();
        } else {
          this.originInstance.deactivate();
        }
      },
      measureMode: function measureMode(mode) {
        this.originInstance.deactivate();
        this.reload();
      },
      clampMode: function clampMode(val) {
        this.originInstance.clampMode = val;
      },
      isClear: function isClear(flag) {
        if (flag) {
          this.originInstance.clear();
          this.$emit('update:isClear', false);
        }
      }
    },
    methods: {
      load: function load() {
        var _this = this;

        var Cesium = this.Cesium,
            viewer = this.viewer,
            actived = this.actived,
            measureMode = this.measureMode,
            clampMode = this.clampMode;

        var mode = Cesium.MeasureMode.Distance;
        if (measureMode === _MeasureMode.MeasureMode.AREA) {
          mode = Cesium.MeasureMode.Area;
        }
        if (measureMode === _MeasureMode.MeasureMode.HEIGHT) {
          mode = Cesium.MeasureMode.DVH;
        }
        this.originInstance = new Cesium.MeasureHandler(viewer, mode, clampMode);
        if (actived) {
          this.originInstance.activate();
        } else {
          this.originInstance.deactivate();
        }
        this.originInstance.activeEvt.addEventListener(function (isActive) {
          _this.$emit('active', { isActive: isActive });
        });
        this.originInstance.measureEvt.addEventListener(function (result) {
          if (mode === Cesium.MeasureMode.Distance) {
            var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance.toFixed(2) + 'm';
            _this.originInstance.disLabel.text = '距离:' + distance;
          }
          if (mode === Cesium.MeasureMode.Area) {
            var area = result.area;
            area = Number(area) > 1000000 ? (Number(area) / 1000000).toFixed(2) + 'km²' : Number(area).toFixed(2) + '㎡';
            _this.originInstance.areaLabel.text = '面积:' + area;
          }
          if (mode === Cesium.MeasureMode.DVH) {
            var _distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
            var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
            var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
            _this.originInstance.disLabel.text = '空间距离:' + _distance;
            _this.originInstance.vLabel.text = '垂直高度:' + vHeight;
            _this.originInstance.hLabel.text = '水平距离:' + hDistance;
          }
          _this.$emit('measureEnd', { result: result });
        });
      }
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module, exports, __webpack_require__(10)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../base/bindEvent'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.bindEvent);
    global.viewer = mod.exports;
  }
})(this, function (module, exports, _bindEvent) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _bindEvent2 = _interopRequireDefault(_bindEvent);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  exports.default = {
    name: 'sm-viewer',
    props: {
      cesiumPath: {
        type: String
      },
      animation: {
        type: Boolean,
        default: false
      },
      baseLayerPicker: {
        type: Boolean,
        default: false
      },
      fullscreenButton: {
        type: Boolean,
        default: false
      },
      vrButton: {
        type: Boolean,
        default: false
      },
      geocoder: {
        type: Boolean,
        default: false
      },
      homeButton: {
        type: Boolean,
        default: false
      },
      infoBox: {
        type: Boolean,
        default: false
      },
      sceneModePicker: {
        type: Boolean,
        default: false
      },
      selectionIndicator: {
        type: Boolean,
        default: false
      },
      timeline: {
        type: Boolean,
        default: false
      },
      navigationHelpButton: {
        type: Boolean,
        default: false
      },
      navigationInstructionsInitiallyVisible: {
        type: Boolean,
        default: false
      },
      scene3DOnly: {
        type: Boolean,
        default: false
      },
      shouldAnimate: {
        type: Boolean,
        default: false
      },
      clockViewModel: {
        type: Object
      },
      skyBox: {
        type: Object
      },
      skyAtmosphere: {
        type: Object
      },
      fullscreenElement: {
        type: String
      },
      useDefaultRenderLoop: {
        type: Boolean,
        default: true
      },
      targetFrameRate: {
        type: Number
      },
      showRenderLoopErrors: {
        type: Boolean,
        default: true
      },
      automaticallyTrackDataSourceClocks: {
        type: Boolean,
        default: true
      },
      contextOptions: {
        type: Object
      },
      sceneMode: {
        type: Number,
        default: 3
      },
      mapProjection: {
        type: Object
      },
      globe: {
        type: Object
      },
      orderIndependentTranslucency: {
        type: Boolean,
        default: true
      },
      creditContainer: {
        type: String
      },
      creditViewport: {
        type: String
      },
      dataSources: {
        type: Object
      },
      terrainExaggeration: {
        type: Number,
        default: 1.0
      },
      shadows: {
        type: Boolean,
        default: false
      },
      terrainShadows: {
        type: Number
        // default: Cesium.ShadowMode.RECEIVE_ONLY
      },
      mapMode2D: {
        type: Number
        // default: Cesium.MapMode2D.INFINITE_SCROLL
      },
      projectionPicker: {
        type: Boolean,
        default: false
      },
      requestRenderMode: {
        type: Boolean,
        default: false
      },
      maximumRenderTimeChange: {
        type: Number,
        default: 0.0
      },
      navigation: {
        type: Boolean,
        default: true
      },
      camera: {
        type: Object
      }
    },
    methods: {
      init: function init(Cesium) {
        if (this.viewer) {
          return;
        }

        var $el = this.$refs.viewer; // 获取id为viewer的dom对象
        // for (let $node of this.$slots.default || []) {
        //   if ($node.componentOptions && $node.componentOptions.tag === 'sm-cesium-view') {
        //     this.hasSmCesiumView = true
        //     $el = $node.elm
        //   }
        // }
        //  获取视图查看器对象----
        var viewer = new Cesium.Viewer($el, {
          animation: this.animation, // 是否显示动画控件
          baseLayerPicker: this.baseLayerPicker, // 是否显示基础图层选择器控件
          fullscreenButton: this.fullscreenButton, // 是否显示全屏按钮控件
          vrButton: this.vrButton, // 是否显示切换VR模式的单个按钮控件
          geocoder: this.geocoder, // 是否显示地理编码控件小部件
          homeButton: this.homeButton, // 是否显示主页按钮控件小部件
          infoBox: this.infoBox, // 是否显示信息框小部件
          sceneModePicker: this.sceneModePicker, // 是否显示场景模式选择器小部件
          selectionIndicator: this.selectionIndicator, // 是否显示选择指示器控件小部件
          timeline: this.timeline, // 是否显示时间基线小部件
          navigationHelpButton: this.navigationHelpButton, // 是否显示导航帮助按钮控件小部件
          navigationInstructionsInitiallyVisible: this.navigationInstructionsInitiallyVisible, // 如果导航指令最初应 该是可见的，则为true，如果用户不显式地单击按钮，则不应该显示导航指令。
          scene3DOnly: this.scene3DOnly, // 当TRUE，每个几何实例将只在3D场景中渲染，以节省GPU内存。.
          shouldAnimate: this.shouldAnimate, // 默认情况下如果时钟试图先于模拟时间，则设置为true,否则设置为false
          clockViewModel: this.clockViewModel, // The clock view model to use to control current time.
          skyBox: this.skyBox, // 用于渲染星辰的天空盒，未定义时，使用默认星辰效果。
          skyAtmosphere: this.skyAtmosphere, // 环绕地球边缘的蓝天和光晕效果，设置为false可将其关闭。
          fullscreenElement: this.fullscreenElement, // 当按下全屏按钮时，要将元素或ID放置到全屏模式中
          useDefaultRenderLoop: this.useDefaultRenderLoop, // 如果此部件能够控制渲染循环，设置为true，反之设置为false。
          targetFrameRate: this.targetFrameRate, // 使用默认渲染循环时的目标帧速率。
          showRenderLoopErrors: this.showRenderLoopErrors, // 如果设置为true，发生渲染循环错误时，将自动给用户显示一个包含错误信息的HTML面板。
          automaticallyTrackDataSourceClocks: this.automaticallyTrackDataSourceClocks, // 如果设置为true，将自动跟踪新添加数据源的时钟设置，如果数据源的时钟变更，则更新。如需单独设置时钟，请将此项设置为false
          contextOptions: this.contextOptions, // Context and WebGL 创建属性与传递给Scene匹配的选项.
          sceneMode: this.sceneMode,
          mapProjection: this.mapProjection, // 在二维和Columbus视图模式下所使用的地图投影
          globe: this.globe, // 场景中的地球，如果此项设置为false，将不添加球体对象
          orderIndependentTranslucency: this.orderIndependentTranslucency, // 果此项设置为true，并且使用设备支持，将使用与顺序无关的半透明
          creditContainer: this.creditContainer,
          creditViewport: this.creditViewport,
          terrainExaggeration: this.terrainExaggeration, // 用于夸大地形的标量。请注意，设置地形夸张不会修改其它任何数据。
          shadows: this.shadows, // 确定阴影是否由太阳投射形成
          terrainShadows: this.terrainShadows, // 确定地形是否投射或接受来自太阳的阴影
          mapMode2D: this.mapMode2D, // 定二维地图是可旋转的或是可以在在水平方向上无限滚动
          projectionPicker: this.projectionPicker, // 投影选择器小部件
          requestRenderMode: this.requestRenderMode, // 如果为真，则需要时对一帧的渲染由场景内的变化确定。启用可提高应用程序的性能，但需要使用Scene#requestRender方法在该模式中显式地呈现新帧。这将在许多情况下在API的其他部分中改变场景之后是必要的。用显式渲染来提高性能。
          maximumRenderTimeChange: this.maximumRenderTimeChange, // 如果requestRenderMode为真，则该值定义在请求渲染之前允许的模拟时间的最大变化。
          navigation: this.navigation // 是否显示导航罗盘控件。如需显示，需在初始化viewer时此项设置为true。
        });
        this.viewer = viewer;
        // options待完善
        _bindEvent2.default.call(this, viewer); // 为viewer注册事件监听程序---，并将此Vue实例作为bindEvents函数调用的上下文
        // bindEvents.call(this, viewer.scene, sceneEventList)
        // bindEvents.call(this, viewer.dataSources, dataSourcesEventList)
        // viewer.reset()
        if (Cesium.defined(this.camera)) {
          viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(this.camera.position.longitude, this.camera.position.latitude, this.camera.position.height),
            orientation: {
              heading: Cesium.Math.toRadians(this.camera.heading),
              pitch: Cesium.Math.toRadians(this.camera.pitch),
              roll: Cesium.Math.toRadians(this.camera.roll)
            }
          });
        }
        this.$emit('ready', { Cesium: Cesium, viewer: viewer });
      },

      // 初始化视图查看器以及获取cesium全局命名空间----
      initViewer: function initViewer(Cesium) {
        this.Cesium = Cesium;
        this.init(Cesium);
      },

      // 加载cesium类库文件----
      getCesiumScript: function getCesiumScript() {
        if (!window.Cesium) {
          var cesiumPath = this.cesiumPath;
          // if (cesiumPath.charAt(cesiumPath.length - 1) !== '/') {
          //   cesiumPath = cesiumPath + '/'
          // }
          // window.Cesium = {}
          return new Promise(function (resolve, reject) {
            // 定义全局函数当库文件加载完成后调用--
            // window._initCesium = function () {
            //   debugger
            //   resolve(window.Cesium)
            //   window.Cesium._preloader = null
            //   window._initCesium = null
            // }
            // 加载cesium 小部件样式文件---
            var $link = document.createElement('link');
            $link.rel = 'stylesheet';
            document.head.appendChild($link);
            $link.href = cesiumPath + '/Build/Cesium/Widgets/widgets.css';
            // 加载超图三维库文件
            var $scriptRequire = document.createElement('script');
            $scriptRequire.src = cesiumPath + '/examples/js/require.min.js';
            document.body.appendChild($scriptRequire);
            var $script = document.createElement('script');
            $script.src = cesiumPath + '/Build/Cesium/Cesium.js';
            document.body.appendChild($script);
            var $scriptZlib = document.createElement('script');
            $scriptZlib.src = cesiumPath + '/Build/Cesium/Workers/zlib.min.js';
            document.body.appendChild($scriptZlib);
            // 加载库文件后启用的函数
            $script.onload = function () {
              resolve(window.Cesium);
            };
          });
          //    return window.Cesium._preloader
        } else {
          return Promise.resolve(window.Cesium);
        }
      },
      reset: function reset() {
        var getCesiumScript = this.getCesiumScript,
            initViewer = this.initViewer;

        getCesiumScript().then(initViewer);
      }
    },
    mounted: function mounted() {
      this.reset();
    },
    beforeDestroy: function beforeDestroy() {},
    data: function data() {
      return {
        viewer: null,
        viewerContainer: null
      };
    }
  };
  module.exports = exports['default'];
});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(18)();
// imports


// module
exports.push([module.i, "/*--------tooltip----------------*/\r\n.twipsy {\r\n    display: block;\r\n    position: absolute;\r\n    visibility: visible;\r\n    max-width: 200px;\r\n    min-width: 100px;\r\n    padding: 5px;\r\n    font-size: 11px;\r\n    z-index: 1000;\r\n    opacity: 0.8;\r\n    -khtml-opacity: 0.8;\r\n    -moz-opacity: 0.8;\r\n    filter: alpha(opacity=80);\r\n}\r\n.twipsy.left .twipsy-arrow {\r\n    top: 50%;\r\n    right: 0;\r\n    margin-top: -5px;\r\n    border-top: 5px solid transparent;\r\n    border-bottom: 5px solid transparent;\r\n    border-left: 5px solid #000000;\r\n}\r\n.twipsy.right .twipsy-arrow {\r\n    top: 50%;\r\n    left: 0;\r\n    margin-top: -5px;\r\n    border-top: 5px solid transparent;\r\n    border-bottom: 5px solid transparent;\r\n    border-right: 5px solid #000000;\r\n}\r\n.twipsy-inner {\r\n    padding: 3px 8px;\r\n    background-color: #000000;\r\n    color: white;\r\n    text-align: center;\r\n    max-width: 200px;\r\n    text-decoration: none;\r\n    -webkit-border-radius: 4px;\r\n    -moz-border-radius: 4px;\r\n    border-radius: 4px;\r\n}\r\n.twipsy-arrow {\r\n    position: absolute;\r\n    width: 0;\r\n    height: 0;\r\n}\r\n/*--------tooltip end------------*/", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
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


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
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

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
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

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(19)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!./pretty.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!./pretty.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "viewer",
    staticStyle: {
      "width": "100%",
      "height": "100%",
      "margin": "0",
      "padding": "0",
      "overflow": "hidden"
    },
    attrs: {
      "id": "cesiumContainer"
    }
  }, [_vm._t("default")], 2)
},staticRenderFns: []}
module.exports.render._withStripped = true
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-70ba6226", module.exports)
  }
}

/***/ })
/******/ ]);
});