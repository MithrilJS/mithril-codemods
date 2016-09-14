"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#config-function
// Rewrite all `config` function instances into either oninit/onupdate
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property)
        .filter((p) => (
            p.get("key").getValueProperty("name") === "config" &&
            j.FunctionExpression.check(p.get("value").node)
        ))
        .forEach(() => s("config function"))
        .replaceWith((p) => {
            var params = p.get("value", "params"),
                el, init, state, vdom;

            // rename `config` to `onupdate`
            p.get("key").replace(j.identifier("onupdate"));

            // Check for 1st arg, `el`, and rewrite as `vnode.dom`
            // This one is done early so the rewrites are already done
            // before the potential oninit/onupdate split down below
            el = params.get(0);
            if(el.value) {
                el = el.getValueProperty("name");
                
                params.get(0).replace(j.identifier("vnode"));

                // Update any element references to use vnode.dom
                j(p.get("value").node)
                    .find(j.Identifier)
                    .filter((p2) => (
                        p2.getValueProperty("name") === el
                    ))
                    .forEach(() => s("vnode reference"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("dom")
                    ));
            }
            
            // Check for 4th arg, `vdom`, and rewrite as `vnode`
            vdom = params.get(3);
            if(vdom.value) {
                vdom = vdom.getValueProperty("name");

                params.get(3).replace();

                j(p.get("value").node)
                    .find(j.Identifier)
                    .filter((p2) => (
                        p2.getValueProperty("name") === vdom
                    ))
                    .forEach(() => s("vdom reference"))
                    .replaceWith(j.identifier("vnode"));
            }

            // Check for 3rd arg, `state`, and rewrite as `vnode.state`
            state = params.get(2);
            if(state.value) {
                state = state.getValueProperty("name");

                params.get(2).replace();

                j(p.get("value").node)
                    .find(j.Identifier)
                    .filter((p2) => (
                        p2.getValueProperty("name") === state
                    ))
                    .forEach(() => s("state reference"))
                    .replaceWith(j.memberExpression(
                        j.identifier("vnode"),
                        j.identifier("state")
                    ));
            }

            // If it uses isInitialized need to split between oninit/onupdate
            init = params.get(1);
            if(init.value) {
                init = init.getValueProperty("name");

                params.get(1).replace();

                // Find a conditional using `!<init>` and use the body as `oninit`
                j(p.get("value").node)
                    .find(j.IfStatement)
                    .filter((p2) => (
                        p2.get("test", "operator").value === "!" &&
                        p2.get("test", "argument").value &&
                        p2.get("test", "argument").getValueProperty("name") === init
                    ))
                    .forEach(() => s(`!${init} statement`))
                    .replaceWith((p2) => {
                        // First add the if statement body as an oninit method
                        p.parent.get("properties").push(j.property(
                            "init",
                            j.identifier("oninit"),
                            j.functionExpression(
                                null,
                                [ j.identifier("vnode") ],
                                p2.get("consequent").node
                            )
                        ));

                        // Then delete it from onupdate
                        return null;
                    });
            }
            
            return p.node;
        })
        .toSource();
};
