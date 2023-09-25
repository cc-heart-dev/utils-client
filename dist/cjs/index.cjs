'use strict';

var dom = require('./src/lib/dom.cjs');
var navigator = require('./src/lib/navigator.cjs');
var request = require('./src/lib/request.cjs');



exports.addClassName = dom.addClassName;
exports.addStyles = dom.addStyles;
exports.getStyles = dom.getStyles;
exports.removeClassName = dom.removeClassName;
exports.removeStyles = dom.removeStyles;
exports.copy = navigator.copy;
exports.Request = request.Request;
exports.createFetchRequest = request.createFetchRequest;
