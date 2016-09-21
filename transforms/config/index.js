"use strict";

var upwards = require("../../lib/upwards.js"),
    replace = require("../../lib/identifier.js").replace;

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#config-function
// Rewrite all `config` function instances into either oncreate/onupdate
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "config" },
            value : j.Function.check
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
                replace(j, p.get("value"), names[0], j.memberExpression(
                    j.identifier("vnode"),
                    j.identifier("dom")
                ));
            }

            // Check for 4th arg, `vdom`, and rewrite as `vnode`
            if(names[3]) {
                replace(j, p.get("value"), names[3], j.identifier("vnode"));
            }

            // Check for 3rd arg, `state`, and rewrite as `vnode.state`
            if(names[2]) {
                replace(j, p.get("value"), names[2], j.memberExpression(
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
                            ifBody = "oncreate",
                            negated;
                        
                        // Something went real bad if this triggers...
                        if(!conditional) {
                            return false;
                        }

                        // Figure out if the init value has been negated somehow
                        negated = upwards(
                            p2,
                            (n) => j.match(n, {
                                type     : "UnaryExpression",
                                operator : "!"
                            }),
                            (n) => j.IfStatement.check(n.node)
                        );

                        // Negated means rename `config` to `onupdate`
                        // Use conditional body as `oncreate`
                        if(negated.node) {
                            fnBody = "oncreate";
                            ifBody = "onupdate";
                        }

                        p.get("key").replace(j.identifier(ifBody));
                        
                        // Filter out empty return if blocks, they're ignorable
                        if(j.match(conditional, {
                            consequent : {
                                body : [{ type : "ReturnStatement", argument : null }]
                            }
                        })) {
                            return conditional.replace();
                        }

                        // Add the if statement body as a new hook function
                        p.parent.get("properties").push(j.property(
                            "init",
                            j.identifier(fnBody),
                            j.functionExpression(
                                null,
                                [ j.identifier("vnode") ],
                                conditional.get("consequent").node
                            )
                        ));

                        conditional.replace();

                        // Remove original hook if it's now empty
                        if(p.get("value", "body", "body").getValueProperty("length") === 0) {
                            p.replace();
                        }
                    });
            }
        })
        .toSource();
};
