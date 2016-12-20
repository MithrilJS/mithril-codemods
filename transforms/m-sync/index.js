"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#msync-removed
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
        .replaceWith((p) => j.callExpression(
            j.memberExpression(
                j.identifier("Promise"),
                j.identifier("all")
            ),
            p.get("arguments").value
        ))
        .toSource();
};
