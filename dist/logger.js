'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.infoType = undefined;
exports.default = info;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const infoType = exports.infoType = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error'
}); /* eslint-disable no-console */

function info(message, type) {
  switch (type) {
    case infoType.ERROR:
      {
        console.error(_chalk2.default.red(message));
        break;
      }
    case infoType.SUCCESS:
      {
        console.log(_chalk2.default.green(message));
        break;
      }
    default:
      console.log(message);
  }
}