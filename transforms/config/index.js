"use strict";

function upwards(start, test) {
    var curr = start;

    while(curr && !test(curr)) {
        curr = curr.parent;
    }

    return curr;
}

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#config-function
// Rewrite all `config` function instances into either oncreate/onupdate
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "config" },
            value : { type : "FunctionExpression" }
        })
        .forEach((p) => {
            var params = p.get("value", "params"),
                names  = params.map((param) => param.getValueProperty("name"));
            
            s("config function");

            // rename `config` to `onupdate`
            p.get("key").replace(j.identifier("onupdate"));

            // If if takes any params rewrite to be more accurate
            if(names.length) {
                params.replace([ j.identifier("vnode") ]);
            }

            // Check for 1st arg, `el`, and rewrite as `vnode.dom`
            // This one is done early so the rewrites are already done
            // before the potential oncreate/onupdate split down below
            if(names[0]) {
                j(p.get("value"))
                    .find(j.Identifier, { name : names[0] })
                    .forEach(() => s("vnode reference"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("dom")
                    ));
            }

            // Check for 4th arg, `vdom`, and rewrite as `vnode`
            if(names[3]) {
                j(p.get("value"))
                    .find(j.Identifier, { name : names[3] })
                    .forEach(() => s("vdom reference"))
                    .replaceWith(j.identifier("vnode"));
            }

            // Check for 3rd arg, `state`, and rewrite as `vnode.state`
            if(names[2]) {
                j(p.get("value"))
                    .find(j.Identifier, { name : names[2] })
                    .forEach(() => s("state reference"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("state")
                    ));
            }

            // If it uses isInitialized need to split behavior somewhat
            if(names[1]) {
                j(p.get("value"))
                    .find(j.IfStatement)
                    .find(j.Identifier, { name : names[1] })
                    .forEach((p2) => {
                        var conditional = upwards(p2.parent, (n) => j.IfStatement.check(n.node)),
                            
                            fnBody = "onupdate",
                            ifBody = "oncreate";
                        
                        // Something went real bad if this triggers...
                        if(!conditional) {
                            return false;
                        }
                        
                        // Negated means rename `config` to `onupdate`
                        // Use conditional body as `oncreate`
                        if(j.match(p2.parent, {
                            type     : "UnaryExpression",
                            operator : "!",
                            argument : { name : names[1] }
                        })) {
                            fnBody = "oncreate";
                            ifBody = "onupdate";
                        }

                        p.get("key").replace(j.identifier(ifBody));
                        
                        // Add the if statement body as the oncreate method
                        // TODO: creates a function even if the conditional is just
                        // "return;" which seems silly
                        if(j.match(conditional, {
                            consequent : {
                                body : [{}]
                            }
                        })) {
                            p.parent.get("properties").push(j.property(
                                "init",
                                j.identifier(fnBody),
                                j.functionExpression(
                                    null,
                                    [ j.identifier("vnode") ],
                                    conditional.get("consequent").node
                                )
                            ));
                        }

                        return conditional.replace();
                    });
            }
        })
        .toSource();
};
