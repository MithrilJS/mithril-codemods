"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
// Change the first param to `vnode`
// Convert any access to the first param to use vnode.attrs.<key> instead
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "controller" },
            value : { type : "FunctionExpression" }
        })
        .forEach((p) => {
            s("controller property");

            // update name to `oninit`
            p.get("key").replace(j.identifier("oninit"));

            // No args means we're done
            if(!p.get("value", "params").getValueProperty("length")) {
                return;
            }

            // Update references to first arg w/ `vnode.attrs`
            j(p.get("value", "body"))
                .find(j.Identifier, { name : p.get("value", "params", 0).getValueProperty("name") })
                // Ensure that `arg` is the object being modified
                // Means that fooga.<arg> will be ignored, but <arg>.fooga will be modified
                .filter((p2) => (j.MemberExpression.check(p2.parent.node) ?
                    p2.parent.get("object") === p2 :
                    true
                ))
                .forEach(() => s("vnode.attrs"))
                .replaceWith(j.memberExpression(
                    j.identifier("vnode"),
                    j.identifier("attrs")
                ));
            
            // Rename first arg to `vnode`
            p.get("value", "params", 0).replace(j.identifier("vnode"));
        })
        .toSource();
};
