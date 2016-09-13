"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#passing-vnodes-to-mmount-and-mroute
// Converts raw vnodes passed to m.route into simple components
module.exports = function(file, api) {
    var j = api.jscodeshift;
    
    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee", "object").value &&
            p.get("callee", "object").getValueProperty("name") === "m" &&
            p.get("callee", "property").value &&
            p.get("callee", "property").getValueProperty("name") === "route" &&
            j.ObjectExpression.check(p.get("arguments", 2).value)
        ))
        .replaceWith((p) => {
            j(p.get("arguments", 2))
                .find(j.Property)
                .filter((p2) => (
                    p2.get("value", "callee").getValueProperty("name") === "m" &&
                    j.Literal.check(p2.get("value", "arguments", 0).value)
                ))
                .replaceWith((p2) => {
                    p2.get("value").replace(j.objectExpression([
                        j.property(
                            "init",
                            j.identifier("view"),
                            j.functionExpression(
                                null,
                                [],
                                j.blockStatement([
                                    j.returnStatement(p2.get("value", "arguments", 1).node)
                                ])
                            )
                        )
                    ]));

                    return p2.node;
                });
            
            return p.node;
        })
        .toSource();
};
