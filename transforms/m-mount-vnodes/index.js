"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-vnodes-to-mmount-and-mroute
// Converts raw vnodes passed to m.mount into simple components
module.exports = function(file, api) {
    var j = api.jscodeshift;
    
    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee", "object").value &&
            p.get("callee", "object").getValueProperty("name") === "m" &&
            p.get("callee", "property").value &&
            p.get("callee", "property").getValueProperty("name") === "mount" &&
            j.CallExpression.check(p.get("arguments", 1).value) &&
            p.get("arguments", 1, "callee").getValueProperty("name") === "m" &&
            j.Literal.check(p.get("arguments", 1, "arguments", 0).value)
        ))
        .replaceWith((p) => {
            p.get("arguments", 1).replace(j.objectExpression([
                j.property(
                    "init",
                    j.identifier("view"),
                    j.functionExpression(
                        null,
                        [],
                        j.blockStatement([
                            j.returnStatement(p.get("arguments", 1).node)
                        ])
                    )
                )
            ]));
            
            return p.node;
        })
        .toSource();
};
