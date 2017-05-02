"use strict";

// https://mithril.js.org/change-log.md#msync-removed
// Convert `m.sync(...).then(...)` into `Promise.all(...).then(...)`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "sync" }
            }
        })
        .forEach(() => s("m.sync()"))
        // rewrite m.sync as Promise.all
        .replaceWith((p) => j.template.expression`
            Promise.all(${p.get("arguments").value})
        `)
        .toSource();
};
