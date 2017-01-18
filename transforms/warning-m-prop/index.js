"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mprop-removed
// Add a warning around any usage of `m.prop()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "prop" }
            }
        })
        .forEach(() => s("m.prop"))
        .replaceWith((p) => j.template.expression`
            console.warn("m.prop has been removed from mithril 1.0") || ${p.value}
        `)
        .toSource();
};
