"use strict";

var on = /^on/i;

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#cancelling-redraw-from-event-handlers
// Converts m.redraw.strategy("none") calls in functions accepting `e` to e.redraw = false;
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression)
        .filter((p) => (
            p.get("callee", "object").value &&
            p.get("callee", "object", "object").value &&
            p.get("callee", "object", "object").getValueProperty("name") === "m" &&
            p.get("callee", "object", "property").value &&
            p.get("callee", "object", "property").getValueProperty("name") === "redraw" &&
            p.get("callee", "property").value &&
            p.get("callee", "property").getValueProperty("name") === "strategy" &&
            p.get("arguments", 0).value &&
            p.get("arguments", 0).getValueProperty("value") === "none"
        ))
        .replaceWith((p) => {
            var fn = p.scope.path,
                arg;

            // Go find the nearest scope that is part of a property named "on<something>"
            while(
                fn &&
                !j.Property.check(fn.parent.node) &&
                fn.parent.get("key").value &&
                on.test(fn.parent.get("key").getValueProperty("name"))
            ) {
                fn = fn.scope.path;
            }

            if(!fn) {
                return p;
            }

            // Determine arg name
            arg = fn.get("params", 0).getValueProperty("name");

            if(!arg) {
                return p;
            }
            
            s("m.redraw.strategy(\"none\")");

            return j.assignmentExpression(
                "=",
                j.memberExpression(
                    j.identifier(arg),
                    j.identifier("redraw")
                ),
                j.literal(false)
            );
        })
        .toSource();
};
