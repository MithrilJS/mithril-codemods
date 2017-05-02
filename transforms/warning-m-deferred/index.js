"use strict";

// https://mithril.js.org/change-log.html#mdeferred-removed
// Add a warning above any usage of `m.deferred()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "deferred" }
            }
        })
        .forEach(() => s("m.deferred"))
        .replaceWith((p) => j.template.expression`
            console.warn("m.deferred has been removed from mithril 1.0") || ${p.value}
        `)
        .toSource();
};
