"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var events = require('events');

var JSZip = require('jszip');

var PromiseLib = require('./promise');

var StreamBuf = require('./stream-buf'); // The purpose of this module is to wrap the js-zip library into a streaming zip library
// since most of the exceljs code uses streams.
// One day I might find (or build) a properly streaming browser safe zip lib
// =============================================================================
// The ZipReader class
// Unpacks an incoming zip stream


var ZipReader =
/*#__PURE__*/
function (_events$EventEmitter) {
  _inherits(ZipReader, _events$EventEmitter);

  function ZipReader(options) {
    var _this;

    _classCallCheck(this, ZipReader);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ZipReader).call(this));
    _this.count = 0;
    _this.jsZip = new JSZip();
    _this.stream = new StreamBuf();

    _this.stream.on('finish', function () {
      _this._process();
    });

    _this.getEntryType = options.getEntryType || function () {
      return 'string';
    };

    return _this;
  }

  _createClass(ZipReader, [{
    key: "_finished",
    value: function _finished() {
      var _this2 = this;

      if (! --this.count) {
        PromiseLib.Promise.resolve().then(function () {
          _this2.emit('finished');
        });
      }
    }
  }, {
    key: "_process",
    value: function _process() {
      var _this3 = this;

      var content = this.stream.read();
      this.jsZip.loadAsync(content).then(function (zip) {
        zip.forEach(function (path, entry) {
          if (!entry.dir) {
            _this3.count++;
            entry.async(_this3.getEntryType(path)).then(function (data) {
              var entryStream = new StreamBuf();
              entryStream.path = path;
              entryStream.write(data);

              entryStream.autodrain = function () {
                _this3._finished();
              };

              entryStream.on('finish', function () {
                _this3._finished();
              });

              _this3.emit('entry', entryStream);
            })["catch"](function (error) {
              _this3.emit('error', error);
            });
          }
        });
      })["catch"](function (error) {
        _this3.emit('error', error);
      });
    } // ==========================================================================
    // Stream.Writable interface

  }, {
    key: "write",
    value: function write(data, encoding, callback) {
      if (this.error) {
        if (callback) {
          callback(this.error);
        }

        throw this.error;
      } else {
        return this.stream.write(data, encoding, callback);
      }
    }
  }, {
    key: "cork",
    value: function cork() {
      return this.stream.cork();
    }
  }, {
    key: "uncork",
    value: function uncork() {
      return this.stream.uncork();
    }
  }, {
    key: "end",
    value: function end() {
      return this.stream.end();
    }
  }, {
    key: "destroy",
    value: function destroy(error) {
      this.emit('finished');
      this.error = error;
    }
  }]);

  return ZipReader;
}(events.EventEmitter); // =============================================================================
// The ZipWriter class
// Packs streamed data into an output zip stream


var ZipWriter =
/*#__PURE__*/
function (_events$EventEmitter2) {
  _inherits(ZipWriter, _events$EventEmitter2);

  function ZipWriter(options) {
    var _this4;

    _classCallCheck(this, ZipWriter);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(ZipWriter).call(this));
    _this4.options = Object.assign({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    }, options);
    _this4.zip = new JSZip();
    _this4.stream = new StreamBuf();
    return _this4;
  }

  _createClass(ZipWriter, [{
    key: "append",
    value: function append(data, options) {
      if (options.hasOwnProperty('base64') && options.base64) {
        this.zip.file(options.name, data, {
          base64: true
        });
      } else {
        this.zip.file(options.name, data);
      }
    }
  }, {
    key: "finalize",
    value: function finalize() {
      var _this5 = this;

      return this.zip.generateAsync(this.options).then(function (content) {
        _this5.stream.end(content);

        _this5.emit('finish');
      });
    } // ==========================================================================
    // Stream.Readable interface

  }, {
    key: "read",
    value: function read(size) {
      return this.stream.read(size);
    }
  }, {
    key: "setEncoding",
    value: function setEncoding(encoding) {
      return this.stream.setEncoding(encoding);
    }
  }, {
    key: "pause",
    value: function pause() {
      return this.stream.pause();
    }
  }, {
    key: "resume",
    value: function resume() {
      return this.stream.resume();
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.stream.isPaused();
    }
  }, {
    key: "pipe",
    value: function pipe(destination, options) {
      return this.stream.pipe(destination, options);
    }
  }, {
    key: "unpipe",
    value: function unpipe(destination) {
      return this.stream.unpipe(destination);
    }
  }, {
    key: "unshift",
    value: function unshift(chunk) {
      return this.stream.unshift(chunk);
    }
  }, {
    key: "wrap",
    value: function wrap(stream) {
      return this.stream.wrap(stream);
    }
  }]);

  return ZipWriter;
}(events.EventEmitter); // =============================================================================


module.exports = {
  ZipReader: ZipReader,
  ZipWriter: ZipWriter
};
//# sourceMappingURL=zip-stream.js.map
