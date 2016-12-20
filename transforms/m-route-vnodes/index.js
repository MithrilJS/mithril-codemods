"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#passing-vnodes-to-mmount-and-mroute
// Converts raw vnodes passed to m.route into simple components
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "route" }
            },

            arguments : [{}, {}, { type : "ObjectExpression" }]
        })
        .forEach(() => s("m.route(vnode)"))
        .forEach((p) => j(p.get("arguments", 2))
            .find(j.Property, {
                value : {
                    callee    : { name : "m" },
                    arguments : [{ type : "Literal" }]
                }
            })
            .forEach((p2) => p2.get("value").replace(j.objectExpression([
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
            ])))
        )
        .toSource();
};
