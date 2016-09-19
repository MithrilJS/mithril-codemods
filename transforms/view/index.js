"use strict";

// No migration link yet
// Convert the first argument to `view` object properties (that are functions) into `vnode`
// Convert any access to the first param to use `vnode.state.<key>` instead
// Convert any access to the second param to use `vnode.attrs.<key>` instead
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "view" },
            value : {
                type   : "FunctionExpression",
                params : [{}]
            }
        })
        .forEach((p) => {
            var fn      = p.get("value"),
                ctrl    = fn.get("params", 0),
                options = fn.get("params", 1),
                arg1, arg2;
            
            s("view property w/ args");

            // Rewrite `ctrl` into `vnode` and update references
            if(j.Identifier.check(ctrl.node)) {
                arg1 = ctrl.getValueProperty("name");

                ctrl.replace(j.identifier("vnode"));

                j(fn.get("body").node)
                    .find(j.Identifier, { name : arg1 })
                    .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
                        p2.parent.get("object") === p2 :
                        true
                    ))
                    .forEach(() => s("vnode.state"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("state")
                    ));
            }

            // Remove `options` and update references
            if(j.Identifier.check(options.node)) {
                arg2 = options.getValueProperty("name");

                options.replace();

                j(fn.get("body").node)
                    .find(j.Identifier, { name : arg2 })
                    .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
                        p2.parent.get("object") === p2 :
                        true
                    ))
                    .forEach(() => s("vnode.attrs"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("attrs")
                    ));
            }
        })
        .toSource();
};
