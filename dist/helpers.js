'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readTmpFile = exports.checkFor = exports.preparePayload = exports.writeTmpInfoFile = exports.generateDictFromPoFiles = exports.getConfig = exports.getWellFormattedPoText = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gettextParser = require('gettext-parser');

var _gettextParser2 = _interopRequireDefault(_gettextParser);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omitby');

var _lodash4 = _interopRequireDefault(_lodash3);

var _path = require('path');

var _config = require('./config');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _file = require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* eslint-disable no-empty, consistent-return */

const isUndefined = val => typeof val === 'undefined';

const getWellFormattedPoText = exports.getWellFormattedPoText = poText => {
  const parsedPoText = _gettextParser2.default.po.compile(_gettextParser2.default.po.parse(poText));
  return parsedPoText.toString('utf8').replace(/\\n/, '');
};

const getConfig = exports.getConfig = (() => {
  var _ref = _asyncToGenerator(function* (configFromCli) {
    if (configFromCli.config) {
      const config = yield (0, _file.readJSONFile)(configFromCli.config);
      const clearConfigFromCli = (0, _lodash4.default)((0, _lodash2.default)(configFromCli, 'config'), isUndefined);
      return _extends({}, config, {
        apiKey: config.apiKey || process.env['TRANSLATIONIO_API_KEY'] }, clearConfigFromCli);
    }

    return configFromCli;
  });

  return function getConfig(_x) {
    return _ref.apply(this, arguments);
  };
})();

const generateDictFromPoFiles = exports.generateDictFromPoFiles = (() => {
  var _ref2 = _asyncToGenerator(function* (config) {
    const {
      targetLocales,
      context
    } = config;

    try {
      return yield _bluebird2.default.reduce(targetLocales, (() => {
        var _ref3 = _asyncToGenerator(function* (prev, next) {
          const poPath = (0, _path.resolve)(process.cwd(), context, `po/${next}.po`);
          const contents = yield (0, _file.readFile)(poPath);
          return _extends({}, prev, {
            [`po_data_${next}`]: contents
          });
        });

        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      })(), {});
    } catch (e) {
      (0, _logger2.default)(e, _logger.infoType.ERROR);
    }
  });

  return function generateDictFromPoFiles(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const writeTmpInfoFile = exports.writeTmpInfoFile = (() => {
  var _ref4 = _asyncToGenerator(function* (data) {
    try {
      yield (0, _file.createDir)('.tmp');
    } catch (e) {}
    try {
      yield (0, _file.writeJSONFile)(_config.TEMP_INFO_PATH, data);
    } catch (e) {
      (0, _logger2.default)(e, _logger.infoType.ERROR);
    }
  });

  return function writeTmpInfoFile(_x5) {
    return _ref4.apply(this, arguments);
  };
})();

const preparePayload = exports.preparePayload = base => Object.keys(base).reduce((prev, next) => {
  const nextObj = base[next] ? { [next]: base[next] } : {};
  return _extends({}, prev, nextObj);
}, {});

const checkFor = exports.checkFor = (value, name, message) => (0, _invariant2.default)(typeof value[name] !== 'undefined', message || `You need to provide: ${name}`);

const readTmpFile = exports.readTmpFile = () => (0, _file.readJSONFile)(_config.TEMP_INFO_PATH);