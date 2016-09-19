"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mrequest
// Convert `m.request(...).then(...)` into `m.request(...).run(...)`
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.MemberExpression, {
            property : { name : "then" }
        })
        // Walk all the way down and check for m.request()
        .filter((p) => {
            var o = p.get("object");

            while(j.match(o, {
                callee : {
                    object : { type : "CallExpression" }
                }
            })) {
                o = o.get("callee", "object");
            }

            return j.match(o, {
                callee : {
                    object   : { name : "m" },
                    property : { name : "request" }
                }
            });
        })
        .forEach(() => s("m.request().then()"))
        .replaceWith((p) => j.memberExpression(
            p.get("object").node,
            j.identifier("run")
        ))
        .toSource();
};
