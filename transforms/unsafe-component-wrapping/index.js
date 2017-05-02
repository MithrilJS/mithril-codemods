"use strict";

// https://mithril.js.org/change-log.html#passing-components-to-m
// Attempt to ensure that components as args to `m()` are wrapped in their own `m(<component)`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : { name : "m" }
        })
        .forEach((p) => {
            // Walk function arguments, find things that look like components, wrap with `m()`
            j(p.get("arguments"))
                .find(j.ObjectExpression, {
                    properties : [
                        {
                            key : {
                                name : "view"
                            }
                        }
                    ]
                })
                .forEach(() => s("Unwrapped component"))
                .replaceWith((p2) => j.template.expression`
                    m(${p2.node})
                `);
        })
        .toSource();
};
