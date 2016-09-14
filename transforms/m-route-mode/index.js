"use strict";

var conversion = {
        search   : "?",
        hash     : "#",
        pathname : ""
    };

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#mroute-mode
// Converts m.route.mode = "..." calls into m.route.prefix()
module.exports = function(file, api) {
    var j = api.jscodeshift,
        s = api.stats;
    
    return j(file.source)
        .find(j.AssignmentExpression)
        .filter((p) => (
            p.get("left", "object").value &&
            p.get("left", "object", "object").value &&
            p.get("left", "object", "object").getValueProperty("name") === "m" &&
            p.get("left", "object", "property").value &&
            p.get("left", "object", "property").getValueProperty("name") === "route" &&
            p.get("left", "property").value &&
            p.get("left", "property").getValueProperty("name") === "mode" &&
            p.get("right").value &&
            p.get("right").getValueProperty("value") in conversion
        ))
        .forEach(() => s("m.route.mode"))
        .replaceWith((p) => j.callExpression(
            j.memberExpression(
                j.memberExpression(
                    j.identifier("m"),
                    j.identifier("route")
                ),
                j.identifier("prefix")
            ),
            [
                j.literal(
                    conversion[p.get("right").value.value]
                )
            ]
        ))
        .toSource();
};
