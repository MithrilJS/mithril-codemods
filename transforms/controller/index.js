"use strict";

var replace = require("../../lib/identifier.js").replace;

// http://mithril.js.org/change-log.html#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
// Change the first param to `vnode`
// Convert any access to the first param to use vnode.attrs.<key> instead
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property, {
            key : { name : "controller" }
        })
        .forEach((p) => {
            s("controller property");

            // update name to `oninit`
            p.get("key").replace(j.identifier("oninit"));

            // If we don't know what the value is, bail at this point
            if(!j.match(p, { value : j.Function.check })) {
                return;
            }

            // No args means we're done
            if(!p.get("value", "params").getValueProperty("length")) {
                return;
            }

            // Update references to first arg w/ `vnode.attrs`
            replace(
                j,
                p.get("value", "body"),
                p.get("value", "params", 0).getValueProperty("name"),
                j.template.expression`vnode.attrs`
            );
            
            // Rename first arg to `vnode`
            p.get("value", "params", 0).replace(j.identifier("vnode"));
        })
        .toSource();
};
