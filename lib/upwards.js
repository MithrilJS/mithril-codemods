"use strict";

module.exports = function upwards(start, args) {
    var curr = start,
        test, limit, step;

    if(!args) {
        throw new Error("No test specified");
    }

    test  = args.test  || (() => true);
    step  = args.step  || ((n) => n.parent);
    limit = args.limit || ((n) => !n);

    while(curr && !test(curr) && !limit(curr)) {
        curr = step(curr);
    }

    return limit(curr) ? false : curr;
};
