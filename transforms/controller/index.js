"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
// TODO: Convert the first arg (if it exists) to be called `vnode`
// TODO: Convert access to properties of the first arg to instead access `vnode.attrs`
module.exports = function(file, api) {
    var j = api.jscodeshift;

    return j(file.source)
        .find(j.Property)
        .filter((p) => p.get("key").getValueProperty("name") === "controller")
        .replaceWith((p) => j.property(
            "init",
            j.identifier("oninit"),
            p.getValueProperty("value")
        ))
        .toSource();
};
