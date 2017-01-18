"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#passing-vnodes-to-mmount-and-mroute
// Converts raw vnodes passed to m.mount into simple components
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.ExpressionStatement, {
            expression : {
                callee : {
                    object   : { name : "m" },
                    property : { name : "mount" }
                },
                arguments : [
                    {},
                    {
                        
                        callee    : { name : "m" },
                        arguments : [
                            { type : "Literal" }
                        ]
                    }
                ]
            }
        })
        .forEach(() => s("m.mount(vnode)"))
        .replaceWith((p) => j.template.statement`
            m.mount(${p.get("expression", "arguments", 0).value}, {
                view: function() {
                    return ${p.get("expression", "arguments", 1).value};
                }
            });
        `)
        .toSource();
};
