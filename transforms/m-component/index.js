"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mcomponent-removed
// Convert `m.component()` invocations into just `m()`
module.exports = (file, api) => {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "component" }
            }
        })
        .replaceWith((p) => j.callExpression(
            j.identifier("m"),
            p.get("arguments").value
        ))
        .toSource();
};
