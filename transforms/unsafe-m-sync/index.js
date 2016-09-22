"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mrequest
// Convert `m.sync(...).then(...)` into `m.prop.merge(...).run(...)`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.MemberExpression, {
            property : { name : "then" }
        })
        // Walk all the way down and check for m.sync()
        .filter((p) => {
            var o = p.get("object");

            while(j.match(o, {
                callee : {
                    object : { type : "CallExpression" }
                }
            })) {
                o = o.get("callee", "object");
            }

            if(j.match(o, {
                callee : {
                    object   : { name : "m" },
                    property : { name : "sync" }
                }
            })) {
                p.ref = o.get("callee");

                return true;
            }

            return false;
        })
        .replaceWith((p) => {
            // rewrite m.sync as m.prop.merge
            p.ref.replace(j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("prop")
                ),
                j.identifier("merge")
            ));
            
            // rewrite .then() as .run()
            return j.memberExpression(
                p.get("object").node,
                j.identifier("run")
            );
        })
        .toSource();
};
