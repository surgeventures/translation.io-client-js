'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _po2json = require('po2json');

var _po2json2 = _interopRequireDefault(_po2json);

var _request = require('./request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _file = require('./file');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (config = {}) {
    try {
      const conf = yield (0, _helpers.getConfig)(config);
      (0, _helpers.checkFor)(conf, 'apiKey');
      const syncUri = (0, _request.getSyncUri)(conf.apiKey);

      (0, _logger2.default)('Reading data from config file...');
      const configFile = yield (0, _helpers.readTmpFile)();

      (0, _logger2.default)('Reading data from POT file...');
      (0, _helpers.checkFor)(conf, 'potFile');
      const potData = yield (0, _file.readFile)(conf.potFile);

      (0, _helpers.checkFor)(conf, 'targetLocales');
      (0, _helpers.checkFor)(conf, 'sourceLocale');
      (0, _helpers.checkFor)(conf, 'gemVersion');
      const payload = (0, _helpers.preparePayload)(_extends({
        target_languages: conf.targetLocales,
        source_language: conf.sourceLocale,
        gem_version: conf.gemVersion,
        purge: conf.purge,
        pot_data: potData
      }, configFile));

      (0, _logger2.default)('Requesting sync operation to server...');
      const response = yield (0, _request2.default)(syncUri, payload);
      (0, _logger2.default)('Saving new timestamp to temporary file...');
      yield (0, _helpers.writeTmpInfoFile)({ timestamp: +Date.now() });

      (0, _helpers.checkFor)(conf, 'context');

      yield (0, _file.createForceDir)(`${conf.context}/messages`);
      yield (0, _file.createForceDir)(`${conf.context}/po`);
      conf.targetLocales.forEach((() => {
        var _ref2 = _asyncToGenerator(function* (locale) {
          const poData = response.data[`po_data_${locale}`];
          const jsonPo = _po2json2.default.parse(poData, { format: 'jed1.x' });

          yield (0, _file.writeJSONFile)(`${conf.context}/messages/${locale}.json`, jsonPo);
          yield (0, _file.writeFile)(`${conf.context}/po/${locale}.po`, (0, _helpers.getWellFormattedPoText)(poData));
          (0, _logger2.default)(`Saved new json and po files for ${locale} translation`, _logger.infoType.SUCCESS);
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());
    } catch (error) {
      (0, _logger2.default)('Error occurred during sync operation', _logger.infoType.ERROR);
      (0, _logger2.default)(error.message, _logger.infoType.ERROR);
    }
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();