"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mcomponent-removed
// Convert `m.component()` invocations into just `m()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "component" }
            }
        })
        .forEach(() => s("m.component()"))
        .replaceWith((p) => j.callExpression(
            j.identifier("m"),
            p.get("arguments").value
        ))
        .toSource();
};
