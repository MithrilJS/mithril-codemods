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
        .forEach(() => s("controller property"))
        .replaceWith((p) => j.property(
            "init",
            j.identifier("oninit"),
            j.functionExpression(
                p.get("value").getValueProperty("id"),
                p.get("value", "params").getValueProperty("length") === 0 ?
                    [] :
                    [ j.identifier("vnode") ],
                p.get("value", "body").node
            )
        ))
        .find(j.Identifier)
        // .forEach((p) => { debugger; })
        // .find()
        //     debugger;
            
        //     var fn  = p.get("value"),
        //         arg = fn.get("params", 0);

        //     // Only update if they were already using options
        //     if(j.Identifier.check(arg.node)) {
        //         arg.replace(j.identifier("vnode"));
                
        //         j(p.get("value", "body").node)
        //             .find(j.Identifier, { name : arg })
        //             .filter((p2) => { debugger; return (j.MemberExpression.check(p2.parent.node) ?
        //                 p2.parent.get("object") === p2 :
        //                 true
        //             )})
        //             .forEach(() => s("vnode.attrs"))
        //             .replaceWith(j.memberExpression(
        //                 j.identifier("vnode"),
        //                 j.identifier("attrs")
        //             ));
        //     }

            
        // })
        .toSource();
};
