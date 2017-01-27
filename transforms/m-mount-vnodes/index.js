"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#passing-vnodes-to-mmount-and-mroute
// Converts raw vnodes passed to m.mount into simple components
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.CallExpression, {
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
        })
        .forEach(() => s("m.mount(vnode)"))
        .replaceWith((p) => j.template.expression`
            m.mount(${p.get("arguments", 0).value}, {
                view: function() {
                    return ${p.get("arguments", 1).value};
                }
            })
        `)
        .toSource();
};
