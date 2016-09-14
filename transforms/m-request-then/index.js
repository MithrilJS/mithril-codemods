"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mrequest
// Convert `m.request(...).then(...)` into `m.request(...).run(...)`
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.MemberExpression)
        .filter((p) => p.get("property").getValueProperty("name") === "then")
        .filter((p) => {
            // Walk all the way down and check for m.request()
            var o = p.get("object");

            while(j.CallExpression.check(o.get("callee", "object").node)) {
                o = o.get("callee", "object");
            }

            return (
                o.get("callee", "object").getValueProperty("name") === "m" &&
                o.get("callee", "property").getValueProperty("name") === "request"
            );
        })
        .forEach(() => s("m.request().then()"))
        .replaceWith((p) => j.memberExpression(
            p.get("object").node,
            j.identifier("run")
        ))
        .toSource();
};
