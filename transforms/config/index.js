"use strict";

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
                    .forEach((p2) => {
                        // if(!init) { ... }
                        // Take conditional body and put into an oncreate function
                        if(j.match(p2, {
                            test : {
                                operator : "!",
                                argument : { name : names[1] }
                            }
                        })) {
                            // First add the if statement body as an oncreate method
                            p.parent.get("properties").push(j.property(
                                "init",
                                j.identifier("oncreate"),
                                j.functionExpression(
                                    null,
                                    [ j.identifier("vnode") ],
                                    p2.get("consequent").node
                                )
                            ));

                            // Then delete it from onupdate
                            return p2.replace();
                        }

                        // if(init) { return; }
                        // Strip out conditional, rename to oncreate
                        if(j.match(p2, {
                            test       : { name : names[1] },
                            consequent : {
                                body : [
                                    { type : "ReturnStatement" }
                                ]
                            }
                        })) {
                            // Rename function to oncreate
                            p.get("key").replace(j.identifier("oncreate"));
                            
                            // Strip out conditional
                            return p2.replace();
                        }
                    });
            }
        })
        .toSource();
};
