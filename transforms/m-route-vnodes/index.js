"use strict";

// https://mithril.js.org/change-log.md#passing-vnodes-to-mmount-and-mroute
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
        .forEach((p) => j(p.get("arguments", 2))
            .find(j.Property, {
                value : {
                    callee    : { name : "m" },
                    arguments : [{ type : "Literal" }]
                }
            })
            .forEach(() => s("m.route(vnode)"))
            .forEach((p2) => p2.get("value").replace(j.template.expression`
                {
                    view : function() {
                        return ${p2.get("value").value};
                    }
                }
            
            `))
        )
        .toSource();
};
