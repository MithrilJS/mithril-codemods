"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mrequest
// Convert `m.sync(...).then(...)` into `m.prop.merge(...).run(...)`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.MemberExpression)
        .filter((p) => p.get("property").getValueProperty("name") === "then")
        .filter((p) => {
            // Walk all the way down and check for m.request()
            var o = p.get("object");

            while(o.get("callee").value && j.CallExpression.check(o.get("callee", "object").node)) {
                o = o.get("callee", "object");
            }

            if(o.get("callee").value &&
               o.get("callee", "object").value &&
               o.get("callee", "object").getValueProperty("name") === "m" &&
               o.get("callee", "property").value &&
               o.get("callee", "property").getValueProperty("name") === "sync"
            ) {
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
