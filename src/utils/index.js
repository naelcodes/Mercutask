'use strict';

//Exposing the utils prototype

const bodyParser = require('./body-parser');
const pathRegex = require('./path-to-regex');
const checkType = require('./type-checker');
const mix = require('./mixin');
module.exports = { mix, bodyParser, pathRegex, checkType };
