"use strict";

// https://mithril.js.org/change-log.html#view-parameters
// Finds functions w/ "ctrl" as the first param, or "view" properties that are functions
// Convert the first argument to into `vnode`
// Convert any access to the first param to use `vnode.state.<key>` instead
// Convert any access to the second param to use `vnode.attrs.<key>` instead
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Function)
        .filter((p) =>
             // Function with ctrl as first param
            j.match(p, {
                params : [{ name : "ctrl" }]
            }) ||
            // Property named "view" that is a function
            j.match(p.parent, {
                key   : { name : "view" },
                value : j.Function.check
            })
        )
        .forEach((p) => {
            var ctrl    = p.get("params", 0),
                options = p.get("params", 1),
                arg1, arg2;
            
            s("view property w/ args");

            // Rewrite `ctrl` into `vnode` and update references
            if(j.Identifier.check(ctrl.node)) {
                arg1 = ctrl.getValueProperty("name");

                // Early-out if this has already been transformed
                if(arg1 === "vnode") {
                    return;
                }

                ctrl.replace(j.identifier("vnode"));

                j(p.get("body").node)
                    .find(j.Identifier, { name : arg1 })
                    .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
                        p2.parent.get("object") === p2 :
                        true
                    ))
                    .forEach(() => s("vnode.state"))
                    .replaceWith(j.template.expression`
                        vnode.state
                    `);
            }

            // Remove `options` and update references
            if(j.Identifier.check(options.node)) {
                arg2 = options.getValueProperty("name");

                options.replace();

                j(p.get("body").node)
                    .find(j.Identifier, { name : arg2 })
                    .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
                        p2.parent.get("object") === p2 :
                        true
                    ))
                    .forEach(() => s("vnode.attrs"))
                    .replaceWith(j.template.expression`
                        vnode.attrs
                    `);
            }
        })
        .toSource();
};
