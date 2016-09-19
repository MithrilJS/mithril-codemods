"use strict";

var on = /^on/i;

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#cancelling-redraw-from-event-handlers
// Converts m.redraw.strategy("none") calls in functions accepting `e` to e.redraw = false;
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object : {
                    object   : { name : "m" },
                    property : { name : "redraw" }
                },
                property : { name : "strategy" }
            },

            arguments : [{ value : "none" }]
        })
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
