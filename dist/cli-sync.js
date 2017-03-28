#!/usr/bin/env node
'use strict';

var _subcommand = require('./subcommand');

var _subcommand2 = _interopRequireDefault(_subcommand);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _subcommand2.default)(_.sync)(program => {
  program.option('-p, --purge', 'Purge sync operation');
});