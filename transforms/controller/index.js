"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
// Convert any access to the first param to use <param>.attrs.<key> instead
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property)
        .filter((p) => (
            p.get("key").getValueProperty("name") === "controller" &&
            j.FunctionExpression.check(p.get("value").node)
        ))
        .forEach(() => s("controller property"))
        .replaceWith((p) => {
            var fn  = p.get("value"),
                arg = fn.get("params", 0);
            
            // Only update if they were already using options
            if(j.Identifier.check(arg.node)) {
                arg = arg.getValueProperty("name");
                
                
                j(p.get("value", "body").node)
                    .find(j.Identifier)
                    .filter((p2) => {
                        // table stakes
                        if(p2.getValueProperty("name") !== arg) {
                            return false;
                        }
                        
                        if(j.MemberExpression.check(p2.parent.node)) {
                            return p2.parent.get("object") === p2;
                        }

                        return true;
                    })
                    .forEach(() => s(`${arg}.attrs`))
                    .replaceWith(j.memberExpression(
                        j.identifier(arg),
                        j.identifier("attrs")
                    ));
            }

            return j.property(
                "init",
                j.identifier("oninit"),
                p.getValueProperty("value")
            );
        })
        .toSource();
};
