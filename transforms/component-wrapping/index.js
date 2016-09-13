"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-components-to-m
// Attempt to ensure that components as args to `m()` are wrapped in their own `m(<component)`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee").getValueProperty("name") === "m"
        ))
        .replaceWith((p) => {
            // Walk function arguments, filter to object expressions
            p.get("arguments")
                .filter((p2) => (
                    j.ObjectExpression.check(p2.node)
                ))
                // filter to objects with a "view" property
                .filter((p2) => (
                    p2.get("properties").filter((p3) => (
                        p3.get("key").getValueProperty("name") === "view"
                    )).length
                ))
                // Wrap with `m()`
                .forEach((p2) => p2.replace(j.callExpression(
                    j.identifier("m"),
                    [ p2.node ]
                )));
            
            return p.node;
        })
        .toSource();
};
