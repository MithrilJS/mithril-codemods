"use strict";

var replace = require("../../lib/identifier.js").replace;

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/change-log.md#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
// Change the first param to `vnode`
// Convert any access to the first param to use vnode.attrs.<key> instead
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key   : { name : "controller" },
            value : j.Function.check
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
            replace(
                j,
                p.get("value", "body"),
                p.get("value", "params", 0).getValueProperty("name"),
                j.memberExpression(
                    j.identifier("vnode"),
                    j.identifier("attrs")
                )
            );
            
            // Rename first arg to `vnode`
            p.get("value", "params", 0).replace(j.identifier("vnode"));
        })
        .toSource();
};
