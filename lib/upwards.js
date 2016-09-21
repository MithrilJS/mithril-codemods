"use strict";

module.exports = function upwards(start, test, limit) {
    var curr = start;

    if(!limit) {
        limit = (n) => !n;
    }

    while(curr && !test(curr) && !limit(curr)) {
        curr = curr.parent;
    }

    return limit(curr) ? false : curr;
};
