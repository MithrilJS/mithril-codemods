"use strict";

// Wraps m.redraw.strategy() calls in a conditional that checks for existence (to ease porting)
// Also console.warns about their existence
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.ExpressionStatement, {
            expression : {
                callee : {
                    object : {
                        object   : { name : "m" },
                        property : { name : "redraw" }
                    },
                    property : { name : "strategy" }
                }
            }
        })
        .forEach(() => s("m.redraw.strategy()"))
        .replaceWith((p) => j.template.statements`
            console.warn("m.redraw.strategy() does not exist in mithril 1.0");

            if(m.redraw.strategy) {
                m.redraw.strategy(${p.get("expression", "arguments", 0).node});
            }
        `)
        .toSource();
};
