"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var ZipStream = require('../utils/zip-stream');

var StreamBuf = require('../utils/stream-buf');

var PromiseLib = require('../utils/promise');

var utils = require('../utils/utils');

var XmlStream = require('../utils/xml-stream');

var StylesXform = require('./xform/style/styles-xform');

var CoreXform = require('./xform/core/core-xform');

var SharedStringsXform = require('./xform/strings/shared-strings-xform');

var RelationshipsXform = require('./xform/core/relationships-xform');

var ContentTypesXform = require('./xform/core/content-types-xform');

var AppXform = require('./xform/core/app-xform');

var WorkbookXform = require('./xform/book/workbook-xform');

var WorksheetXform = require('./xform/sheet/worksheet-xform');

var DrawingXform = require('./xform/drawing/drawing-xform');

var TableXform = require('./xform/table/table-xform');

var CommentsXform = require('./xform/comment/comments-xform');

var VmlNotesXform = require('./xform/comment/vml-notes-xform');

var theme1Xml = require('./xml/theme1.js');

function fsReadFileAsync(filename, options) {
  return new PromiseLib.Promise(function (resolve, reject) {
    fs.readFile(filename, options, function (error, data) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

var XLSX =
/*#__PURE__*/
function () {
  function XLSX(workbook) {
    _classCallCheck(this, XLSX);

    this.workbook = workbook;
  } // ===============================================================================
  // Workbook
  // =========================================================================
  // Read


  _createClass(XLSX, [{
    key: "readFile",
    value: function readFile(filename, options) {
      var _this = this;

      var stream;
      return utils.fs.exists(filename).then(function (exists) {
        if (!exists) {
          throw new Error("File not found: ".concat(filename));
        }

        stream = fs.createReadStream(filename);
        return _this.read(stream, options)["catch"](function (error) {
          stream.close();
          throw error;
        });
      }).then(function (workbook) {
        stream.close();
        return workbook;
      });
    }
  }, {
    key: "parseRels",
    value: function parseRels(stream) {
      var xform = new RelationshipsXform();
      return xform.parseStream(stream);
    }
  }, {
    key: "parseWorkbook",
    value: function parseWorkbook(stream) {
      var xform = new WorkbookXform();
      return xform.parseStream(stream);
    }
  }, {
    key: "parseSharedStrings",
    value: function parseSharedStrings(stream) {
      var xform = new SharedStringsXform();
      return xform.parseStream(stream);
    }
  }, {
    key: "reconcile",
    value: function reconcile(model, options) {
      var workbookXform = new WorkbookXform();
      var worksheetXform = new WorksheetXform(options);
      var drawingXform = new DrawingXform();
      var tableXform = new TableXform();
      workbookXform.reconcile(model); // reconcile drawings with their rels

      var drawingOptions = {
        media: model.media,
        mediaIndex: model.mediaIndex
      };
      Object.keys(model.drawings).forEach(function (name) {
        var drawing = model.drawings[name];
        var drawingRel = model.drawingRels[name];

        if (drawingRel) {
          drawingOptions.rels = drawingRel.reduce(function (o, rel) {
            o[rel.Id] = rel;
            return o;
          }, {});
          drawingXform.reconcile(drawing, drawingOptions);
        }
      }); // reconcile tables with the default styles

      var tableOptions = {
        styles: model.styles
      };
      Object.values(model.tables).forEach(function (table) {
        tableXform.reconcile(table, tableOptions);
      });
      var sheetOptions = {
        styles: model.styles,
        sharedStrings: model.sharedStrings,
        media: model.media,
        mediaIndex: model.mediaIndex,
        date1904: model.properties && model.properties.date1904,
        drawings: model.drawings,
        comments: model.comments,
        tables: model.tables
      };
      model.worksheets.forEach(function (worksheet) {
        worksheet.relationships = model.worksheetRels[worksheet.sheetNo];
        worksheetXform.reconcile(worksheet, sheetOptions);
      }); // delete unnecessary parts

      delete model.worksheetHash;
      delete model.worksheetRels;
      delete model.globalRels;
      delete model.sharedStrings;
      delete model.workbookRels;
      delete model.sheetDefs;
      delete model.styles;
      delete model.mediaIndex;
      delete model.drawings;
      delete model.drawingRels;
    }
  }, {
    key: "processWorksheetEntry",
    value: function processWorksheetEntry(entry, model, options) {
      var match = entry.path.match(/xl\/worksheets\/sheet(\d+)[.]xml/);

      if (match) {
        var sheetNo = match[1];
        var xform = new WorksheetXform(options);
        return xform.parseStream(entry).then(function (worksheet) {
          worksheet.sheetNo = sheetNo;
          model.worksheetHash[entry.path] = worksheet;
          model.worksheets.push(worksheet);
        });
      }

      return undefined;
    }
  }, {
    key: "processCommentEntry",
    value: function processCommentEntry(entry, model) {
      var match = entry.path.match(/xl\/(comments\d+)[.]xml/);

      if (match) {
        var name = match[1];
        var xform = new CommentsXform();
        return xform.parseStream(entry).then(function (comments) {
          model.comments["../".concat(name, ".xml")] = comments;
        });
      }

      return undefined;
    }
  }, {
    key: "processTableEntry",
    value: function processTableEntry(entry, model) {
      var match = entry.path.match(/xl\/tables\/(table\d+)[.]xml/);

      if (match) {
        var name = match[1];
        var xform = new TableXform();
        return xform.parseStream(entry).then(function (table) {
          model.tables["../tables/".concat(name, ".xml")] = table;
        });
      }

      return undefined;
    }
  }, {
    key: "processWorksheetRelsEntry",
    value: function processWorksheetRelsEntry(entry, model) {
      var match = entry.path.match(/xl\/worksheets\/_rels\/sheet(\d+)[.]xml.rels/);

      if (match) {
        var sheetNo = match[1];
        var xform = new RelationshipsXform();
        return xform.parseStream(entry).then(function (relationships) {
          model.worksheetRels[sheetNo] = relationships;
        });
      }

      return undefined;
    }
  }, {
    key: "processMediaEntry",
    value: function processMediaEntry(entry, model) {
      var match = entry.path.match(/xl\/media\/([a-zA-Z0-9]+[.][a-zA-Z0-9]{3,4})$/);

      if (match) {
        var filename = match[1];
        var lastDot = filename.lastIndexOf('.');

        if (lastDot === -1) {
          // if we can't determine extension, ignore it
          return undefined;
        }

        var extension = filename.substr(lastDot + 1);
        var name = filename.substr(0, lastDot);
        return new PromiseLib.Promise(function (resolve, reject) {
          var streamBuf = new StreamBuf();
          streamBuf.on('finish', function () {
            model.mediaIndex[filename] = model.media.length;
            model.mediaIndex[name] = model.media.length;
            var medium = {
              type: 'image',
              name: name,
              extension: extension,
              buffer: streamBuf.toBuffer()
            };
            model.media.push(medium);
            resolve();
          });
          entry.on('error', function (error) {
            reject(error);
          });
          entry.pipe(streamBuf);
        });
      }

      return undefined;
    }
  }, {
    key: "processDrawingEntry",
    value: function processDrawingEntry(entry, model) {
      var match = entry.path.match(/xl\/drawings\/([a-zA-Z0-9]+)[.]xml/);

      if (match) {
        var name = match[1];
        var xform = new DrawingXform();
        return xform.parseStream(entry).then(function (drawing) {
          model.drawings[name] = drawing;
        });
      }

      return undefined;
    }
  }, {
    key: "processDrawingRelsEntry",
    value: function processDrawingRelsEntry(entry, model) {
      var match = entry.path.match(/xl\/drawings\/_rels\/([a-zA-Z0-9]+)[.]xml[.]rels/);

      if (match) {
        var name = match[1];
        var xform = new RelationshipsXform();
        return xform.parseStream(entry).then(function (relationships) {
          model.drawingRels[name] = relationships;
        });
      }

      return undefined;
    }
  }, {
    key: "processThemeEntry",
    value: function processThemeEntry(entry, model) {
      var match = entry.path.match(/xl\/theme\/([a-zA-Z0-9]+)[.]xml/);

      if (match) {
        return new PromiseLib.Promise(function (resolve, reject) {
          var name = match[1]; // TODO: stream entry into buffer and store the xml in the model.themes[]

          var stream = new StreamBuf();
          entry.on('error', reject);
          stream.on('error', reject);
          stream.on('finish', function () {
            model.themes[name] = stream.read().toString();
            resolve();
          });
          entry.pipe(stream);
        });
      }

      return undefined;
    }
  }, {
    key: "processIgnoreEntry",
    value: function processIgnoreEntry(entry) {
      entry.autodrain();
    }
  }, {
    key: "createInputStream",
    value: function createInputStream(options) {
      var _this2 = this;

      var model = {
        worksheets: [],
        worksheetHash: {},
        worksheetRels: [],
        themes: {},
        media: [],
        mediaIndex: {},
        drawings: {},
        drawingRels: {},
        comments: {},
        tables: {}
      }; // we have to be prepared to read the zip entries in whatever order they arrive

      var promises = [];
      var stream = new ZipStream.ZipReader({
        getEntryType: function getEntryType(path) {
          return path.match(/xl\/media\//) ? 'nodebuffer' : 'string';
        }
      });
      stream.on('entry', function (entry) {
        var promise = null;
        var entryPath = entry.path;

        if (entryPath[0] === '/') {
          entryPath = entryPath.substr(1);
        }

        switch (entryPath) {
          case '_rels/.rels':
            promise = _this2.parseRels(entry).then(function (relationships) {
              model.globalRels = relationships;
            });
            break;

          case 'xl/workbook.xml':
            promise = _this2.parseWorkbook(entry).then(function (workbook) {
              model.sheets = workbook.sheets;
              model.definedNames = workbook.definedNames;
              model.views = workbook.views;
              model.properties = workbook.properties;
            });
            break;

          case 'xl/_rels/workbook.xml.rels':
            promise = _this2.parseRels(entry).then(function (relationships) {
              model.workbookRels = relationships;
            });
            break;

          case 'xl/sharedStrings.xml':
            model.sharedStrings = new SharedStringsXform();
            promise = model.sharedStrings.parseStream(entry);
            break;

          case 'xl/styles.xml':
            model.styles = new StylesXform();
            promise = model.styles.parseStream(entry);
            break;

          case 'docProps/app.xml':
            {
              var appXform = new AppXform();
              promise = appXform.parseStream(entry).then(function (appProperties) {
                Object.assign(model, {
                  company: appProperties.company,
                  manager: appProperties.manager
                });
              });
              break;
            }

          case 'docProps/core.xml':
            {
              var coreXform = new CoreXform();
              promise = coreXform.parseStream(entry).then(function (coreProperties) {
                Object.assign(model, coreProperties);
              });
              break;
            }

          default:
            promise = _this2.processWorksheetEntry(entry, model, options) || _this2.processWorksheetRelsEntry(entry, model) || _this2.processThemeEntry(entry, model) || _this2.processMediaEntry(entry, model) || _this2.processDrawingEntry(entry, model) || _this2.processCommentEntry(entry, model) || _this2.processTableEntry(entry, model) || _this2.processDrawingRelsEntry(entry, model) || _this2.processIgnoreEntry(entry);
            break;
        }

        if (promise) {
          promise = promise["catch"](function (error) {
            stream.destroy(error);
            throw error;
          });
          promises.push(promise);
          promise = null;
        }
      });
      stream.on('finished', function () {
        PromiseLib.Promise.all(promises).then(function () {
          _this2.reconcile(model, options); // apply model


          _this2.workbook.model = model;
        }).then(function () {
          stream.emit('done');
        })["catch"](function (error) {
          stream.emit('error', error);
        });
      });
      return stream;
    }
  }, {
    key: "read",
    value: function read(stream, options) {
      var _this3 = this;

      options = options || {};
      var zipStream = this.createInputStream(options);
      return new PromiseLib.Promise(function (resolve, reject) {
        zipStream.on('done', function () {
          resolve(_this3.workbook);
        }).on('error', function (error) {
          reject(error);
        });
        stream.pipe(zipStream);
      });
    }
  }, {
    key: "load",
    value: function load(data, options) {
      var _this4 = this;

      if (options === undefined) {
        options = {};
      }

      var zipStream = this.createInputStream();
      return new PromiseLib.Promise(function (resolve, reject) {
        zipStream.on('done', function () {
          resolve(_this4.workbook);
        }).on('error', function (error) {
          reject(error);
        });

        if (options.base64) {
          var buffer = Buffer.from(data.toString(), 'base64');
          zipStream.write(buffer);
        } else {
          zipStream.write(data);
        }

        zipStream.end();
      });
    } // =========================================================================
    // Write

  }, {
    key: "addMedia",
    value: function addMedia(zip, model) {
      return PromiseLib.Promise.all(model.media.map(function (medium) {
        if (medium.type === 'image') {
          var filename = "xl/media/".concat(medium.name, ".").concat(medium.extension);

          if (medium.filename) {
            return fsReadFileAsync(medium.filename).then(function (data) {
              zip.append(data, {
                name: filename
              });
            });
          }

          if (medium.buffer) {
            return new PromiseLib.Promise(function (resolve) {
              zip.append(medium.buffer, {
                name: filename
              });
              resolve();
            });
          }

          if (medium.base64) {
            return new PromiseLib.Promise(function (resolve) {
              var dataimg64 = medium.base64;
              var content = dataimg64.substring(dataimg64.indexOf(',') + 1);
              zip.append(content, {
                name: filename,
                base64: true
              });
              resolve();
            });
          }
        }

        return PromiseLib.Promise.reject(new Error('Unsupported media'));
      }));
    }
  }, {
    key: "addDrawings",
    value: function addDrawings(zip, model) {
      var drawingXform = new DrawingXform();
      var relsXform = new RelationshipsXform();
      model.worksheets.forEach(function (worksheet) {
        var drawing = worksheet.drawing;

        if (drawing) {
          drawingXform.prepare(drawing, {});
          var xml = drawingXform.toXml(drawing);
          zip.append(xml, {
            name: "xl/drawings/".concat(drawing.name, ".xml")
          });
          xml = relsXform.toXml(drawing.rels);
          zip.append(xml, {
            name: "xl/drawings/_rels/".concat(drawing.name, ".xml.rels")
          });
        }
      });
    }
  }, {
    key: "addTables",
    value: function addTables(zip, model) {
      var tableXform = new TableXform();
      model.worksheets.forEach(function (worksheet) {
        var tables = worksheet.tables;
        tables.forEach(function (table) {
          tableXform.prepare(table, {});
          var tableXml = tableXform.toXml(table);
          zip.append(tableXml, {
            name: "xl/tables/".concat(table.target)
          });
        });
      });
    }
  }, {
    key: "addContentTypes",
    value: function addContentTypes(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var xform = new ContentTypesXform();
        var xml = xform.toXml(model);
        zip.append(xml, {
          name: '[Content_Types].xml'
        });
        resolve();
      });
    }
  }, {
    key: "addApp",
    value: function addApp(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var xform = new AppXform();
        var xml = xform.toXml(model);
        zip.append(xml, {
          name: 'docProps/app.xml'
        });
        resolve();
      });
    }
  }, {
    key: "addCore",
    value: function addCore(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var coreXform = new CoreXform();
        zip.append(coreXform.toXml(model), {
          name: 'docProps/core.xml'
        });
        resolve();
      });
    }
  }, {
    key: "addThemes",
    value: function addThemes(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var themes = model.themes || {
          theme1: theme1Xml
        };
        Object.keys(themes).forEach(function (name) {
          var xml = themes[name];
          var path = "xl/theme/".concat(name, ".xml");
          zip.append(xml, {
            name: path
          });
        });
        resolve();
      });
    }
  }, {
    key: "addOfficeRels",
    value: function addOfficeRels(zip) {
      return new PromiseLib.Promise(function (resolve) {
        var xform = new RelationshipsXform();
        var xml = xform.toXml([{
          Id: 'rId1',
          Type: XLSX.RelType.OfficeDocument,
          Target: 'xl/workbook.xml'
        }, {
          Id: 'rId2',
          Type: XLSX.RelType.CoreProperties,
          Target: 'docProps/core.xml'
        }, {
          Id: 'rId3',
          Type: XLSX.RelType.ExtenderProperties,
          Target: 'docProps/app.xml'
        }]);
        zip.append(xml, {
          name: '_rels/.rels'
        });
        resolve();
      });
    }
  }, {
    key: "addWorkbookRels",
    value: function addWorkbookRels(zip, model) {
      var count = 1;
      var relationships = [{
        Id: "rId".concat(count++),
        Type: XLSX.RelType.Styles,
        Target: 'styles.xml'
      }, {
        Id: "rId".concat(count++),
        Type: XLSX.RelType.Theme,
        Target: 'theme/theme1.xml'
      }];

      if (model.sharedStrings.count) {
        relationships.push({
          Id: "rId".concat(count++),
          Type: XLSX.RelType.SharedStrings,
          Target: 'sharedStrings.xml'
        });
      }

      model.worksheets.forEach(function (worksheet) {
        worksheet.rId = "rId".concat(count++);
        relationships.push({
          Id: worksheet.rId,
          Type: XLSX.RelType.Worksheet,
          Target: "worksheets/sheet".concat(worksheet.id, ".xml")
        });
      });
      return new PromiseLib.Promise(function (resolve) {
        var xform = new RelationshipsXform();
        var xml = xform.toXml(relationships);
        zip.append(xml, {
          name: 'xl/_rels/workbook.xml.rels'
        });
        resolve();
      });
    }
  }, {
    key: "addSharedStrings",
    value: function addSharedStrings(zip, model) {
      if (!model.sharedStrings || !model.sharedStrings.count) {
        return PromiseLib.Promise.resolve();
      }

      return new PromiseLib.Promise(function (resolve) {
        zip.append(model.sharedStrings.xml, {
          name: 'xl/sharedStrings.xml'
        });
        resolve();
      });
    }
  }, {
    key: "addStyles",
    value: function addStyles(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var xml = model.styles.xml;

        if (xml) {
          zip.append(xml, {
            name: 'xl/styles.xml'
          });
        }

        resolve();
      });
    }
  }, {
    key: "addWorkbook",
    value: function addWorkbook(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        var xform = new WorkbookXform();
        zip.append(xform.toXml(model), {
          name: 'xl/workbook.xml'
        });
        resolve();
      });
    }
  }, {
    key: "addWorksheets",
    value: function addWorksheets(zip, model) {
      return new PromiseLib.Promise(function (resolve) {
        // preparation phase
        var worksheetXform = new WorksheetXform();
        var relationshipsXform = new RelationshipsXform();
        var commentsXform = new CommentsXform();
        var vmlNotesXform = new VmlNotesXform(); // write sheets

        model.worksheets.forEach(function (worksheet) {
          var xmlStream = new XmlStream();
          worksheetXform.render(xmlStream, worksheet);
          zip.append(xmlStream.xml, {
            name: "xl/worksheets/sheet".concat(worksheet.id, ".xml")
          });

          if (worksheet.rels && worksheet.rels.length) {
            xmlStream = new XmlStream();
            relationshipsXform.render(xmlStream, worksheet.rels);
            zip.append(xmlStream.xml, {
              name: "xl/worksheets/_rels/sheet".concat(worksheet.id, ".xml.rels")
            });
          }

          if (worksheet.comments.length > 0) {
            xmlStream = new XmlStream();
            commentsXform.render(xmlStream, worksheet);
            zip.append(xmlStream.xml, {
              name: "xl/comments".concat(worksheet.id, ".xml")
            });
            xmlStream = new XmlStream();
            vmlNotesXform.render(xmlStream, worksheet);
            zip.append(xmlStream.xml, {
              name: "xl/drawings/vmlDrawing".concat(worksheet.id, ".vml")
            });
          }
        });
        resolve();
      });
    }
  }, {
    key: "_finalize",
    value: function _finalize(zip) {
      var _this5 = this;

      return new PromiseLib.Promise(function (resolve, reject) {
        zip.on('finish', function () {
          resolve(_this5);
        });
        zip.on('error', reject);
        zip.finalize();
      });
    }
  }, {
    key: "prepareModel",
    value: function prepareModel(model, options) {
      // ensure following properties have sane values
      model.creator = model.creator || 'ExcelJS';
      model.lastModifiedBy = model.lastModifiedBy || 'ExcelJS';
      model.created = model.created || new Date();
      model.modified = model.modified || new Date();
      model.useSharedStrings = options.useSharedStrings !== undefined ? options.useSharedStrings : true;
      model.useStyles = options.useStyles !== undefined ? options.useStyles : true; // Manage the shared strings

      model.sharedStrings = new SharedStringsXform(); // add a style manager to handle cell formats, fonts, etc.

      model.styles = model.useStyles ? new StylesXform(true) : new StylesXform.Mock(); // prepare all of the things before the render

      var workbookXform = new WorkbookXform();
      var worksheetXform = new WorksheetXform();
      workbookXform.prepare(model);
      var worksheetOptions = {
        sharedStrings: model.sharedStrings,
        styles: model.styles,
        date1904: model.properties.date1904,
        drawingsCount: 0,
        media: model.media
      };
      worksheetOptions.drawings = model.drawings = [];
      worksheetOptions.commentRefs = model.commentRefs = [];
      var tableCount = 0;
      model.tables = [];
      model.worksheets.forEach(function (worksheet) {
        // assign unique filenames to tables
        worksheet.tables.forEach(function (table) {
          tableCount++;
          table.target = "table".concat(tableCount, ".xml");
          table.id = tableCount;
          model.tables.push(table);
        });
        worksheetXform.prepare(worksheet, worksheetOptions);
      }); // TODO: workbook drawing list
    }
  }, {
    key: "write",
    value: function write(stream, options) {
      var _this6 = this;

      options = options || {};
      var model = this.workbook.model;
      var zip = new ZipStream.ZipWriter(options.zip);
      zip.pipe(stream);
      this.prepareModel(model, options); // render

      return PromiseLib.Promise.resolve().then(function () {
        return _this6.addContentTypes(zip, model);
      }).then(function () {
        return _this6.addOfficeRels(zip, model);
      }).then(function () {
        return _this6.addWorkbookRels(zip, model);
      }).then(function () {
        return _this6.addWorksheets(zip, model);
      }).then(function () {
        return _this6.addSharedStrings(zip, model);
      }) // always after worksheets
      .then(function () {
        return _this6.addDrawings(zip, model);
      }).then(function () {
        return _this6.addTables(zip, model);
      }).then(function () {
        var promises = [_this6.addThemes(zip, model), _this6.addStyles(zip, model)];
        return PromiseLib.Promise.all(promises);
      }).then(function () {
        return _this6.addMedia(zip, model);
      }).then(function () {
        var afters = [_this6.addApp(zip, model), _this6.addCore(zip, model)];
        return PromiseLib.Promise.all(afters);
      }).then(function () {
        return _this6.addWorkbook(zip, model);
      }).then(function () {
        return _this6._finalize(zip);
      });
    }
  }, {
    key: "writeFile",
    value: function writeFile(filename, options) {
      var _this7 = this;

      var stream = fs.createWriteStream(filename);
      return new PromiseLib.Promise(function (resolve, reject) {
        stream.on('finish', function () {
          resolve();
        });
        stream.on('error', function (error) {
          reject(error);
        });

        _this7.write(stream, options).then(function () {
          stream.end();
        })["catch"](function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: "writeBuffer",
    value: function writeBuffer(options) {
      var stream = new StreamBuf();
      return this.write(stream, options).then(function () {
        return stream.read();
      });
    }
  }]);

  return XLSX;
}();

XLSX.RelType = require('./rel-type');
module.exports = XLSX;
//# sourceMappingURL=xlsx.js.map
