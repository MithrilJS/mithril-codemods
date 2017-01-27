"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#mcomponent-removed
// Convert `m.module()` invocations into `m.mount()`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "module" }
            }
        })
        .forEach(() => s("m.module()"))
        .replaceWith((p) => j.template.expression`
            m.mount(${p.get("arguments").value})
        `)
        .toSource();
};
