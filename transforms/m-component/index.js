"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mcomponent-removed
// Convert `m.component()` invocations into just `m()`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee").get("object").getValueProperty("name") === "m" &&
            p.get("callee").get("property").getValueProperty("name") === "component"
        ))
        .replaceWith((p) => j.callExpression(
            j.identifier("m"),
            p.get("arguments").value
        ))
        .toSource();
};
