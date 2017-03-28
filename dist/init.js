'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _file = require('./file');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (config = {}) {
    try {
      const conf = yield (0, _helpers.getConfig)(config);
      (0, _helpers.checkFor)(conf, 'apiKey');
      const targetUri = (0, _request.getInitUri)(conf.apiKey);

      (0, _logger2.default)('Reading data from POT file...');
      const potData = yield (0, _file.readFile)(conf.potFile);

      (0, _logger2.default)('Reading data from PO translation files...');
      (0, _helpers.checkFor)(conf, 'targetLocales');
      const poData = yield (0, _helpers.generateDictFromPoFiles)(conf);

      (0, _helpers.checkFor)(conf, 'sourceLocale');
      (0, _helpers.checkFor)(conf, 'gemVersion');
      const payload = _extends({
        target_languages: conf.targetLocales,
        source_language: conf.sourceLocale,
        gem_version: conf.gemVersion,
        pot_data: potData
      }, poData);

      (0, _logger2.default)('Requesting init operation to server...');
      yield (0, _request2.default)(targetUri, payload);
      (0, _logger2.default)('Saving new timestamp to temporary file...');
      yield (0, _helpers.writeTmpInfoFile)({ timestamp: +Date.now() });
      (0, _logger2.default)('Init completed', _logger.infoType.SUCCESS);
    } catch (error) {
      (0, _logger2.default)('Error occurred during init operation', _logger.infoType.ERROR);
      (0, _logger2.default)(error.message, _logger.infoType.ERROR);
    }
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();