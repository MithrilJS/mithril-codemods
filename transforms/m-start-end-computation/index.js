"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#no-more-redraw-locks
// Remove instances of m.startComputation()/m.endComputation()
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : (name) => (name === "startComputation" || name === "endComputation") }
            }
        })
        .forEach(() => s("m.startComputation/m.endComputation"))
        .remove()
        .toSource();
};
