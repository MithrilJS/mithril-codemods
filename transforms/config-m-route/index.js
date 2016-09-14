"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#component-controller-function
// Convert `controller` object properties (that are functions) to be called `oninit` instead
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;

    return j(file.source)
        .find(j.Property)
        .filter((p) => (
            p.get("key").getValueProperty("name") === "config" &&
            p.get("value").get("object").getValueProperty("name") === "m" &&
            p.get("value").get("property").getValueProperty("name") === "route"
        ))
        .forEach(() => s("config: m.route"))
        .replaceWith(() => j.property(
            "init",
            j.identifier("oncreate"),
            j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("route")
                ),
                j.identifier("link")
            )
        ))
        .toSource();
};
