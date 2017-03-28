'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = subcommand;

var _lodash = require('lodash.attempt');

var _lodash2 = _interopRequireDefault(_lodash);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function subcommand(fn) {
  _commander2.default.option('-c, --config [path]', 'A config file').option('-k, --apiKey [key]', 'A api key').option('-g, --gemVersion [version]', 'A current gem version');

  return extended => {
    (0, _lodash2.default)(extended, _commander2.default);

    _commander2.default.parse(process.argv);

    fn({
      gemVersion: _commander2.default.gemVersion,
      apiKey: _commander2.default.apiKey,
      config: _commander2.default.config,
      purge: _commander2.default.purge
    });
  };
}