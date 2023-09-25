'use strict';

var shard = require('./shard.cjs');

function clipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        return;
    }
    console.warn('clipboard is not exist of navigator');
}
const copy = shard.handleInvoke(clipboard);

exports.copy = copy;
