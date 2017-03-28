'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSyncUri = exports.getInitUri = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (uri, payload) {
    try {
      return yield _axios2.default.post(uri, payload);
    } catch ({ response: { data: { error } } }) {
      throw new Error(error);
    }
  });

  function request(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return request;
})();

const getUri = (apiKey, action) => `${_config.TARGET_URI}/${apiKey}/${action}`;
const getInitUri = exports.getInitUri = apiKey => getUri(apiKey, 'init');
const getSyncUri = exports.getSyncUri = apiKey => getUri(apiKey, 'sync');