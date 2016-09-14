"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#cancelling-redraw-from-event-handlers
// Converts m.redraw.strategy("none") calls in functions accepting `e` to e.redraw = false;
module.exports = function(file, api) {
    var j = api.jscodeshift;

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
            var fn = p,
                arg;

            // Go find the parent function & determine the arg value
            while(fn.node.type !== "FunctionExpression" && p.parent) {
                fn = fn.parent;
            }

            if(!fn) {
                return p;
            }

            // Determine arg name
            arg = fn.get("params", 0).getValueProperty("name");

            if(!arg) {
                return p;
            }

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
