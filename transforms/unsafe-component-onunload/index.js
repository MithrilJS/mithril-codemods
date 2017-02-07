"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#run-code-on-component-removal
// Convert `controller.onunload` into `controller.onremove`
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key : {
                name : (name) => name === "controller" || name === "oninit"
            },
            value : j.FunctionExpression
        })
        .forEach((prop) => {
            j(prop.get("value"))
                .find(j.AssignmentExpression, {
                    operator : "=",
                    
                    left : {
                        type     : "MemberExpression",
                        property : { name : "onunload" }
                    }
                })
                .forEach((p) => {
                    var fn = p.get("right");

                    s("controller.onunload");

                    // Add onremove property
                    prop.parent.get("properties").push(j.property(
                        "init",
                        j.identifier("onremove"),
                        fn.get("value").node
                    ));
                    
                    // Remove the assignment
                    p.parent.replace();

                    // Check if the controller fn is now empty
                    if(prop.get("value", "body", "body", "length").getValueProperty("value") === 0) {
                        prop.replace();
                    }
                });
        })
        .toSource();
};
