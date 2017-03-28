'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeJSONFile = exports.writeFile = exports.readJSONFile = exports.createForceDir = exports.createDir = exports.readFile = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _path = require('path');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-empty, consistent-return */

const writeFilePromisified = _bluebird2.default.promisify(_fs.writeFile);
const readFilePromisified = _bluebird2.default.promisify(_fs.readFile);
const mkDirPromisified = _bluebird2.default.promisify(_mkdirp2.default);

const readFile = exports.readFile = (fileLocation, encoding = 'utf-8') => readFilePromisified(fileLocation, encoding);

const createDir = exports.createDir = dirName => {
  mkDirPromisified((0, _path.resolve)(dirName));
};

const createForceDir = exports.createForceDir = (() => {
  var _ref = _asyncToGenerator(function* (dirName) {
    try {
      yield createDir(dirName);
    } catch (e) {}
  });

  return function createForceDir(_x) {
    return _ref.apply(this, arguments);
  };
})();

const readJSONFile = exports.readJSONFile = (() => {
  var _ref2 = _asyncToGenerator(function* (path) {
    try {
      const fileContent = yield readFilePromisified((0, _path.resolve)(path), 'utf-8');
      return JSON.parse(fileContent);
    } catch (e) {
      (0, _logger2.default)(e, _logger.infoType.ERROR);
    }
  });

  return function readJSONFile(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const writeFile = exports.writeFile = (path, data) => writeFilePromisified((0, _path.resolve)(path), data, 'utf-8');

const writeJSONFile = exports.writeJSONFile = (path, data) => writeFile(path, JSON.stringify(data, undefined, 2));