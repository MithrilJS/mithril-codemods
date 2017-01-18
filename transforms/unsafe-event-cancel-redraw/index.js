"use strict";

var on = /^on/i;

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#cancelling-redraw-from-event-handlers
// Converts m.redraw.strategy("none") calls in functions accepting `e` to e.redraw = false;
module.exports = (file, api) => {
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
        .forEach((p) => {
            var fn, arg;

            fn = j(p).closest(j.Property, {
                key   : { name : on.test.bind(on) },
                value : j.Function.check
            });
            
            // Has to have a parent function
            if(!fn.length) {
                return;
            }

            if(fn.get("value", "params").getValueProperty("length") > 0) {
                arg = fn.get("value", "params", 0).node;
            } else {
                arg = j.identifier("e");

                fn.get("value", "params").push(arg);
            }

            s("m.redraw.strategy(\"none\")");

            p.replace(j.assignmentExpression(
                "=",
                j.memberExpression(
                    arg,
                    j.identifier("redraw")
                ),
                j.literal(false)
            ));
        })
        .toSource();
};
